"use client";

import Loader from "@/components/Loader";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

export default function RetrieveAnswers() {
  const [loading, setLoading] = useState(false);
  const [knowledgeQuery, setKnowledgeQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [responseData, setResponseData] = useState("");
  const [responseSource, setResponseSource] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/retrieve-response?query=${knowledgeQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          alert(data.message);
        } else {
          setResponseData(data.data.response);
          setResponseSource(data.data.source);
        }
      } else {
        alert("Error occurred while retrieving the response");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Error occurred while sending the request");
    } finally {
      setLoading(false);
      setQuestion(knowledgeQuery);
      setKnowledgeQuery("");
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="flex flex-col flex-8 px-4 py-2 gap-6">
          <p className="text-2xl font-semibold text-center">Retrieve Answers</p>
          <label className="flex gap-4 items-center">
            Enter the query you want to search for in the database
            <input
              type="text"
              className="w-3/5"
              placeholder="What are react hooks?"
              onChange={(e) => setKnowledgeQuery(e.target.value)}
            />
          </label>
          <p className="flex p-6 justify-center items-center">
            <button onClick={fetchData}>Submit</button>
          </p>

          {responseData != "" ? (
            <main className="flex flex-col px-6 py-6 justify-center items-between gap-4 rounded-2xl text-justify backdrop-blur-xl overflow-hidden shadow-xl bg-white">
              <p className="flex flex-col justify-between gap-2 items-start flex-6 max-h-[40vh]">
                <p>Query: {question}</p>
                <p className="max-h-[35vh] overflow-y-auto">
                  <ReactMarkdown>{responseData}</ReactMarkdown>
                </p>
              </p>
              <p className="flex flex-1 justify-start items-center">
                <a
                  href={responseSource}
                  className="text-blue-500 hover:text-blue-700 hover:underline visited:text-purple-600"
                  target="_blank"
                >
                  Source: {responseSource}
                </a>
              </p>
            </main>
          ) : (
            <></>
          )}
        </section>
      )}
    </>
  );
}
