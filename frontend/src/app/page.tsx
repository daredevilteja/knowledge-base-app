"use client";
import Loader from "@/components/Loader";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [metaphorQuery, setMetaphorQuery] = useState("");
  const [numResults, setNumResults] = useState(20);
  const [startPublishedDate, setStartPublishedDate] = useState("2021-01-01");
  const [includeDomains, setIncludeDomains] = useState("");

  const fetchData = async () => {
    const domainsArray = includeDomains.split(",");
    console.log(domainsArray.length);
    domainsArray.forEach((ele) => console.log(ele));
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/internet-search?query=${metaphorQuery}&num_results=${numResults}&start_published_date=${startPublishedDate}&include_domains=${domainsArray}`,
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
        <section className="flex flex-col flex-8 px-4 py-6 gap-8">
          <label className="flex gap-4 items-center">
            Enter a query to fetch data
            <input
              type="text"
              placeholder="What are the recent blogs on react state management?"
              onChange={(e) => setMetaphorQuery(e.target.value)}
              required
            />
          </label>
          <label className="flex gap-4 items-center">
            Number of results you want to fetch
            <input
              type="number"
              placeholder="20"
              onChange={(e) => setNumResults(Number(e.target.value))}
              max={20}
            />
          </label>
          <label className="flex gap-4 items-center">
            Date from which you want to search
            <input
              type="date"
              defaultValue={"2021-01-01"}
              onChange={(e) => setStartPublishedDate(e.target.value)}
            />
          </label>
          <label className="flex gap-4 items-center">
            Domains from which you want to extract information (use comma
            seperated values) <b>Optional</b>
            <input
              type="text"
              placeholder={"https://dev.to, https://www.medium.com"}
              onChange={(e) => setIncludeDomains(e.target.value)}
            />
          </label>
          <button onClick={fetchData}>Submit</button>
        </section>
      )}
    </>
  );
}
