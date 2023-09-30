# KNOWLEDGE BASE

Knowledge Base is application where we can store relevant and reliable knowledge from the internet. Then we can ask questions and get relevant answers from the knowledge base with source url. This application helps all types of people be it developers, designers, engineers and many more. People can build their own custom knowledge base from the internet and use it as a agent to solve their queries.

## Software Installation

1. Install Docker Desktop from docker official website. If you are a Windows user install `wsl` first.
2. Run the Docker Desktop application.
3. Install and setup git.

## Running the Application

1. Clone this repo into your system using git.
2. **Open the .env file located in the repository and enter your openai-api-key and metaphor-api-key and save the file.**
3. Open the terminal in the root folder of the repo and run `sudo docker-compose -f docker-compose.prod.yml up --build`(This will take around 5-10 mins on the first run and from consequent runs it will take less time).
4. Wait till the both the frontend and backend servers start.(on first run wait for 10 mins and from subsequent runs wait for 2 mins)
5. Open [http://localhost:3000](http://localhost:3000) in your browser and use the application.

## Usage

1. In the Load Data tab you can enter the search query for the knowledge you want to get in `Enter a query to fetch data` input field and you can also set optional parameters. After entering the query press submit.
2. Then go to Retrieve Answers tab using sidebar.
3. You can ask any number of questions you want in the input box and get relevant responses with source from which the response is picked up.
