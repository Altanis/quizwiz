import Navbar from "../components/Navbar";
import Info from "../components/Info";

import { UserAuth } from "../context/AuthContext";

export default function Home() {
    const { user } = UserAuth();
    
    return (
        <div>
            <Navbar />
            <div className="flex flex-row px-[10%] p-12 pb-[0%]">
                <div className="w-1/5 h-1/5">
                    <h1 className="text-5xl font-bold text-[#6c63ff] pb-5">Memorize Smarter For Your Next Exam</h1>
                    <p className="text-lg underline decoration-yellow-500 pb-14">Accelerate your learning by using the only study tool you'll ever need.</p>
                    {user?.displayName ? 
                        <button className="transition ease-in-out delay-150 bg-green-300 hover:scale-110 hover:bg-green-500 duration-300 p-3 rounded-lg font-semibold mt-9" onClick={() => window.location.href = `/profile/${localStorage.id}`}>Go to Profile</button>
                        : <button className="transition ease-in-out delay-150 bg-green-300 hover:scale-110 hover:bg-green-500 duration-300 p-3 rounded-lg font-semibold mt-9" onClick={() => window.location.href = "/login"}>Get Started</button>
                    }
                </div>
            </div>
            <div className="pl-[10%] pt-[10%] pr-[10%] absolute inset-y-20 right-0">
                <Info icon="fa-solid fa-key fa-2x text-orange-400" header="Unlock your potential." paragraph="Become part of the QuizWiz community and experience improved grades beyond your expectations." />
                <Info icon="fa-solid fa-repeat fa-2x text-green-400" header="Repetition is key." paragraph="Your study sets are built like a carousel, so you can continuously review without interruption." />
                <Info icon="fa-solid fa-heart fa-2x text-red-600" header="Made by students, for students." paragraph="We understand what students need, and so QuizWiz is designed to be entirely free without annoying ads." />
            </div>
        </div>
    )
};