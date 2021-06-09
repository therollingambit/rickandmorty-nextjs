import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

const defaultEndpoint = "https://rickandmortyapi.com/api/character/";

export const getServerSideProps = async () => {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();

  return {
    props: {
      characters: data,
    },
  };
};

export default function Home({ characters }) {
  const { info, results: defaultResults = [] } = characters;
  const [results, setResults] = useState(defaultResults);
  const [page, setPage] = useState({ ...info, current: defaultEndpoint });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    const request = async () => {
      const res = await fetch(current);
      const nextData = await res.json();

      setPage({ current, ...nextData.info });

      if (!nextData.info?.prev) {
        setResults(nextData.results);
        return;
      }

      setResults((prev) => {
        return [...prev, ...nextData.results];
      });
    };

    request();
  }, [current]);

  // function
  const handleLoadMore = () => {
    setPage((prev) => {
      return { ...prev, current: page?.next };
    });
  };

  // function
  const handleSubmit = (e) => {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === "query");

    const value = fieldQuery.value || "";
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    setPage({ current: endpoint });
  };

  return (
    <div className="flex flex-col items-center py-2">
      <div className="mt-8">
        <Image src="/rickmorty.png" width={320} height={150} alt="logo" />
      </div>
      <div className="mt-5">
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            name="query"
            className="bg-gray-900 text-green-300 shadow rounded border-0 p-2 px-5 focus:outline-none"
          />
          <button className="bg-gray-800 hover:bg-gray-900 text-gray-300 font-bold py-2 px-4 ml-4 rounded">
            Search
          </button>
        </form>
      </div>
      <div className="cards">
        {/* Cards */}
        {results.map((character) => {
          const { id, name, location, image } = character;
          const locationName = location.name;

          return (
            <div
              className="lg:m-4 shadow-md hover:shadow-lg hover:bg-gray-100 rounded-lg bg-white my-12 mx-8"
              key={id}
            >
              <Image
                src={image}
                width={323}
                height={280}
                className="rounded-lg"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-600 text-lg my-2 uppercase">
                  {name}
                </h3>
                <p className="text-justify font-semibold">Last known location:</p>
                <p className="text-gray-500">{location.name}</p>

                <div className="mt-5">
                  <Link
                    href="/character/[id]"
                    as={`/character/${id}`}
                    className="hover:bg-gray-700 rounded-full py-2 px-3 font-semibold hover:text-white bg-gray-400 text-gray-100"
                  >
                    <button className="bg-gray-800 hover:bg-gray-900 text-gray-300 font-bold py-2 px-4 ml-4 rounded">
                      Read more
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <button
          onClick={handleLoadMore}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Load More
        </button>
      </div>
    </div>
  );
}
