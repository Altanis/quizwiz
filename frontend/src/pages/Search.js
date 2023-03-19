import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Search() {
  const { query } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/account/search/${query}`, {
      method: 'GET',
      credentials: 'include',
    })
    .then((response) => response.status.toString().startsWith("2") && response.json())
    .then((data) => {
        setResults(data);
      });
  }, [query]);

  return (
    <div>
      <Navbar />
      <div className="h-1/5 px-[10%] p-12 pb-[0%]">
        <h1 className="text-2xl w-full font-bold text-[#6c63ff] pb-5">
          Search Results For "{query}"
        </h1>
        {results && (
          <div className="flex">
            <div className="w-1/2 pr-5">
              <h2 className="text-lg font-semibold mb-2">Profiles</h2>
              {results.users.map((user) => (
                <div
                  key={user.id}
                  className="p-5 rounded-md bg-white shadow-md hover:shadow-lg cursor-pointer"
                  onClick={() => window.location.href = `/profile/${user.id}`}
                >
                  <p className="text-xl font-bold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.id}</p>
                </div>
              ))}
            </div>
            <div className="w-1/2 pl-5">
              <h2 className="text-lg font-semibold mb-2">Sets</h2>
              {results.sets.map((set) => (
                <div
                  key={set.id}
                  className="p-5 rounded-md bg-white shadow-md hover:shadow-lg cursor-pointer"
                  onClick={() => window.location.href = `/sets/${set.id}`}
                >
                  <p className="text-xl font-bold" onClick={() => window.location.href = `/collections/${set.id}`}>{set.name}</p>
                  <p className="text-sm text-gray-500">{set.id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {!results && (
          <h2 className="text-lg font-semibold mb-2">
            Your query did not match any records in our database.
          </h2>
        )}
      </div>
    </div>
  );
};