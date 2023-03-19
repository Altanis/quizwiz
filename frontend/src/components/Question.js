import React from "react";
import SweetAlert from "./SweetAlert";

export default function QuestionBox({ question }) {
    let choices = "";
    for (let i = 1; i < 5; i++) {
      const choice = question.options[i - 1];
      choices += `<button id="swal2-opt${i}" class="bg-white shadow-md rounded-md p-4 cursor-pointer bg-sky-400 hover:shadow-lg mt-3" onclick="window.check('${choice}')">${choice}</button><br>`
    }

    function getCorrectAnswers(input) {
      let correctChoices = "";
      for (let i = 1; i < 5; i++) {
        const choice = question.options[i - 1];
        correctChoices += `<button id="swal2-opt${i}" class="bg-white shadow-md rounded-md p-4 cursor-pointer mt-3 ${
          question.answers.includes(choice) ? "bg-green-400" : "bg-rose-400"
        } hover:shadow-lg">${choice}${choice === input ? '    <i class="fa-solid fa-arrow-left text-sky-400"></i>' : ''}</button><br>`
      }

      return correctChoices;
    }

    window.check = (choice) => {
        SweetAlert.fire({
            title: question.name,
            icon: question.answers.includes(choice) ? 'success' : 'error',
            html:
            `
            <ul id="choices">
                <li> 
                  ${getCorrectAnswers(choice)}          
                </li>
            </ul>
            `
        });
    };

    const fireQuestion = async () => {
        await SweetAlert.fire({
          title: question.name,
          icon: 'question',
          html:
          `
          <ul id="choices">
              <li>  
                ${choices}          
              </li>
          </ul>
          `
      });
    };

    return (
      <div className="bg-white shadow-md rounded-md p-4 cursor-pointer hover:shadow-lg mt-9" onClick={() => fireQuestion()}>
        <h2 className="text-lg font-semibold mb-2">{question.name}</h2>
      </div>
    );
}

/**
 *         {question.options.map((option, index) => (
          <p key={index} className="text-gray-500">
            {option}
          </p>
        ))}
 */