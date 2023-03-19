import Navbar from "../components/Navbar"
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Flashcards() {
    const { id } = useParams();
    const [results, setResults] = useState(null);
    const [idx, setIdx] = useState(0);
  
    useEffect(() => {
      fetch(`http://localhost:3001/quiz/collections/${id}`, {
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
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 h-96 rounded-md bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center">
        {results ? (
          <div className="text-center">
            <h1 className="text-2xl w-full font-bold text-[#6c63ff] pb-5">
              {results.set.questions[idx].question}
            </h1>
            <ul className="list-disc list-inside">
              {results.set.questions[idx].options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
            <h2 className="text-lg font-bold">Answers:</h2>
            <ul className="list-disc list-inside">
              {results.set.questions[idx].answers.map((answer, index) => (
                <li key={index}>{answer}</li>
              ))}
            </ul>
          </div>
        ) : (
          <h1 className="text-2xl w-full font-bold text-[#6c63ff] pb-5">
            Could not find set. Please try again later.
          </h1>
        )}
      </div>
    </div>
            </div>
        </div>
    );
}