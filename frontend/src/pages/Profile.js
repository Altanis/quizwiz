import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';

export default function Profile() {
    const { id } = useParams();
    const [results, setResults] = useState(null);
  
    useEffect(() => {
      fetch(`http://localhost:3001/account/profile/${id}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.status.toString().startsWith("2") && response.json())
        .then((data) => {
            console.log(data);
            setResults(data);
        });
    }, [id]);
  
    return (
        <div>
            <Navbar />
                <div className="h-1/5 px-[10%] p-12 pb-[0%]">
                {results ? (
                    <>
                        <h1 className="text-2xl w-full font-bold text-[#6c63ff] pb-5">{results?.name || "Guest"}</h1>
                        <div className="flex flex-row">
                            <div className="flex flex-col w-1/2">
                                <h1 className="text-2xl font-bold text-[#6c63ff] pb-5">Study Sets</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {!results.sets.length ? <h2>Wow, such empty.</h2>: results.sets.map((set) => (
                                        <div key={set.title} className="bg-white shadow-md rounded-md p-4 cursor-pointer hover:shadow-lg" onClick={() => window.location.href = `/collections/${set.id}`}>
                                            <h2 className="text-lg font-semibold mb-2">{set.name}</h2>
                                            <p className="text-gray-500">{set.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )
                : <h1 className="text-2xl w-full font-bold text-[#6c63ff] pb-5">Could not find profile. Please try again later.</h1>
                }
            </div>
        </div>
    );
}