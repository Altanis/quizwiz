import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import QuestionBox from '../components/Question';
import SweetAlert from '../components/SweetAlert';

export default function StudySet() {
    const { id } = useParams();
    const [results, setResults] = useState(null);
  
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
    
    const modal = async (title, cb) => {
        const { value } = await SweetAlert.fire({
            title: title,
            icon: 'question',
            confirmButtonText: 'Create',
            html:
            `<input id="swal2-qname" class="swal2-input" placeholder="Name of question" required><br><br>
            <ul id="choices">
                <li>
                    <input id="select-opt1" type="checkbox"> <input id="swal2-opt1" class="swal2-input" placeholder="Choice 1" required><br>
                    <input id="select-opt2" type="checkbox"> <input id="swal2-opt2" class="swal2-input" placeholder="Choice 2" required><br>
                    <input id="select-opt3" type="checkbox"> <input id="swal2-opt3" class="swal2-input" placeholder="Choice 3" required><br>
                    <input id="select-opt4" type="checkbox"> <input id="swal2-opt4" class="swal2-input" placeholder="Choice 4" required>
                </li>
            </ul>
            `,
            preConfirm() {
                const name = document.getElementById('swal2-qname').value;
                const options = [];
                const answers = [];

                for (let i = 1; i < 5; i++) {
                    const option = document.getElementById(`swal2-opt${i}`).value;
                    if (!option) break;

                    if (document.getElementById(`select-opt${i}`).checked) {
                        answers.push(option);
                    }

                    options.push(option);
                }

                if (!name || !options.length || !answers.length) {
                    SweetAlert.showValidationMessage(`Please enter a name, at least one option, and at least one answer.`);
                }

                return { name, options, answers };
            },
        });

        console.log(value);
        cb(value);
    };

    const createQuestion = (question) => {
        fetch(`http://localhost:3001/quiz/collections/${id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        })
            .then((response) => response.status.toString().startsWith("2") && response.json())
            .then((data) => {
                console.log(data);
                setResults(data);
            });
    };
  
    const modalPlay = async title => {
        SweetAlert.fire({
            title: title,
            icon: 'question',
            html:
            `<ul id="choices" style="inline-block">
                <li>
                    <button id="swal2-flashcard" class="bg-white shadow-md rounded-md p-4 cursor-pointer bg-sky-400 hover:shadow-lg mt-3" onclick="window.redirect('flashcard')">Flashcards</button><br>
                    <button id="swal2-flashcard" class="bg-white shadow-md rounded-md p-4 cursor-pointer bg-sky-400 hover:shadow-lg mt-3" onclick="window.redirect('game')">Game</button>
                </li>
            </ul>
            `,
        });
    };

    window.redirect = (type) => {
        window.location.href = `http://localhost:3000/collections/${id}/${type}`;
    };

    return (
        <div>
            <Navbar />
                <div className="h-1/5 px-[10%] p-12 pb-[0%]">
                    {results ? (
                        <>
                            <h1 className="text-2xl font-bold text-[#6c63ff] pb-5">{results.set.name}</h1>
                            <h5 className="w-full font-bold pb-5">Created by {results.set.owner}</h5>
                            <button className="transition ease-in-out delay-150 bg-green-300 hover:scale-110 hover:bg-green-500 duration-300 p-3 rounded-lg font-semibold" onClick={() => modalPlay("Play")}>Play <i class="fa-solid fa-play text-red-400"></i></button>
                            <div className="flex flex-row">
                                <div className="flex flex-col w-full">
                                    <div className="grid grid-cols-1 gap-4 w-full">
                                        {!results.set.questions.length ? <h2>Wow, such empty.</h2>: results.set.questions.map((question, idx) => {
                                            return (
                                                <QuestionBox key={idx} question={question} />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    : <h1 className="text-2xl w-full font-bold text-[#6c63ff] pb-5">Could not find set. Please try again later.</h1>
                    }
                    <button className="transition ease-in-out delay-150 bg-green-300 hover:scale-110 hover:bg-green-500 duration-300 p-3 rounded-lg font-semibold mt-9" onClick={() => modal("New Question", createQuestion)}>New Question</button>
            </div>
        </div>
    );
}