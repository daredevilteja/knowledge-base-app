"use client";

import Loader from "@/components/Loader";
import { useState } from "react";

export default function RetrieveAnswers() {
  const [loading, setLoading] = useState(false);
  const [knowledgeQuery, setKnowledgeQuery] = useState("");
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
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="flex flex-col flex-8 px-4 py-6 gap-8">
          <label className="flex gap-4 items-center">
            Enter the query you want to search for in the database
            <input
              type="text"
              placeholder="What are react hooks?"
              onChange={(e) => setKnowledgeQuery(e.target.value)}
            />
          </label>
          <button onClick={fetchData}>Submit</button>

          <main className="flex flex-col px-6 py-10 justify-center items-between gap-6">
            <p className="flex flex-6">{responseData}</p>
            <p className="flex flex-1 justify-start items-center">
              <a href={responseSource} target="_blank">
                Source: {responseSource}
              </a>
            </p>
          </main>
        </section>
      )}
    </>
  );
}
