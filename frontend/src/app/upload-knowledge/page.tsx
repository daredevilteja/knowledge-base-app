"use client";

import Loader from "@/components/Loader";
import { useState } from "react";

export default function UploadKnowledge() {
  const [loading, setLoading] = useState(false);
  const [metaphorQuery, setMetaphorQuery] = useState("");
  const [numResults, setNumResults] = useState(20);
  const [startPublishedDate, setStartPublishedDate] = useState("2021-01-01");
  const [includeDomains, setIncludeDomains] = useState("");

  const fetchData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/internet-search?query=${metaphorQuery}&num_results=${numResults}&start_published_date=${startPublishedDate}` +
          `${
            includeDomains !== "" ? `&include_domains=${includeDomains}` : ""
          }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        alert("Error occurred while retrieving the response");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Error occurred while sending the request");
    } finally {
      setLoading(false);
      setMetaphorQuery("");
      setIncludeDomains("");
      setNumResults(20);
      setStartPublishedDate("2021-01-01");
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={fetchData}
          className="flex flex-col flex-8 px-4 py-2 gap-8"
        >
          <p className="text-2xl font-semibold text-center">Load Data</p>
          <label className="flex gap-4 items-center">
            Enter a query to fetch data
            <input
              type="text"
              className="w-1/2"
              placeholder="What are the recent blogs on react state management?"
              onChange={(e) => setMetaphorQuery(e.target.value)}
              required
            />
          </label>
          <label className="flex gap-4 items-center">
            Number of results you want to fetch
            <input
              type="number"
              className="w-1/12"
              placeholder="20"
              onChange={(e) => setNumResults(Number(e.target.value))}
              max={20}
            />
          </label>
          <label className="flex gap-4 items-center">
            Date from which you want to search
            <input
              type="date"
              className="w-2/12"
              defaultValue={"2021-01-01"}
              onChange={(e) => setStartPublishedDate(e.target.value)}
            />
          </label>
          <label className="flex gap-4 items-center">
            Domains from which you want to extract information (use comma
            seperated values)
            <input
              type="text"
              className="w-1/4"
              placeholder={"https://dev.to, https://www.medium.com"}
              onChange={(e) => setIncludeDomains(e.target.value)}
            />
          </label>
          <div className="flex justify-center">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </>
  );
}
