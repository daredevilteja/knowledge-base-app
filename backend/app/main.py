import os
import openai
import shutil
from llama_index import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    load_index_from_storage,
    StorageContext,
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from metaphor_python import Metaphor

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")
metaphor = Metaphor(os.getenv("METAPHOR_API_KEY"))

id_to_context_mapping = {}


def create_txt_files(file_contents, output_directory):
    global id_to_context_mapping

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for index, content in enumerate(file_contents):
        file_name = f"{content.id}.txt"
        file_path = os.path.join(output_directory, file_name)

        id_to_context_mapping.update(
            {content.id: {"content": content.extract, "url": content.url}}
        )
        with open(file_path, "w") as file:
            file.write(content.title)
            file.write(content.extract)

        print(f"File created: {file_path}")


def delete_directory(directory_path):
    if os.path.exists(directory_path):
        try:
            shutil.rmtree(directory_path)  # Remove the directory and its contents
            print(f"The directory '{directory_path}' has been successfully deleted.")
        except OSError as e:
            print(f"Failed to delete the directory '{directory_path}': {str(e)}")
    else:
        print(f"The directory '{directory_path}' does not exist.")


def empty_directory(directory_path):
    for file_name in os.listdir(directory_path):
        file_path = os.path.join(directory_path, file_name)
        if os.path.isfile(file_path):
            os.remove(file_path)
        elif os.path.isdir(file_path):
            empty_directory(file_path)
            os.rmdir(file_path)


def get_source_url(response: object) -> str:
    source_url = ""
    for key, value in id_to_context_mapping.items():
        if value["content"] in response.source_nodes[0].text:
            source_url = value["url"]
            break
    return source_url


def indexing_documents():
    flash_directory = "app/flash_storage"
    documents = SimpleDirectoryReader("app/data").load_data()
    index = VectorStoreIndex.from_documents(documents, show_progress=True)
    index.storage_context.persist(persist_dir=flash_directory)


def id_generation(search_response) -> list:
    return [result.id for result in search_response.results]


def creating_content_files(ids: list) -> bool:
    contents = metaphor.get_contents(ids)
    file_contents = contents.contents
    output_directory = "app/data"

    try:
        delete_directory(f"{output_directory}")
        create_txt_files(file_contents, output_directory)
    except Exception as e:
        print(f"Exception: {str(e)}")


@app.get("/api/internet-search")
async def get_internet_data(query: str):
    global id_to_context_mapping
    id_to_context_mapping = {}

    empty_directory("app/flash_storage")
    USER_QUESTION = query
    SYSTEM_MESSAGE = "You are a helpful assistant that generates advanced queries based on user questions. Only generate one search query."
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": SYSTEM_MESSAGE},
            {"role": "user", "content": USER_QUESTION},
        ],
    )

    metaphor_query = completion.choices[0].message.content
    search_response = metaphor.search(
        metaphor_query,
        use_autoprompt=True,
        include_domains=[
            "https://hashnode.com/",
            "https://medium.com/",
            "https://dev.to/",
        ],
        start_published_date="2021-01-01",
        num_results=20,
    )
    ids = id_generation(search_response)

    try:
        creating_content_files(ids)
        indexing_documents()
    except Exception as e:
        return {"message": str(e), "error": True}

    return {"message": "Knowledge base created successfully", "error": False}


@app.get("/api/retrieve-response")
async def retrieve_response(query: str):
    flash_directory = "app/flash_storage"
    storage_context = StorageContext.from_defaults(persist_dir=flash_directory)
    index = load_index_from_storage(storage_context)
    query_engine = index.as_query_engine(verbose=True)
    try:
        response = query_engine.query(query)
        source_url = get_source_url(response)
    except Exception as e:
        print(e)
        return {"message": "Exception occured", "data": str(e), "error": True}

    return {
        "message": "Operation completed successfully",
        "data": {"response": response.response, "source": source_url},
    }


@app.get("/")
def read_root():
    return {"message": "Server started successfully", "error": False}
