import { useState } from "react";
import { UserAuth } from "../context/AuthContext";

import SweetAlert from "./SweetAlert";

export default function Navbar() {
    let { user, logOut } = UserAuth();
    if (!document.cookie) user = {};

    const [visibile, setVisibility] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const modal = async (title, placeholder, cb) => {
        const { value } = await SweetAlert.fire({
            title: title,
            html:
            `<input id="swal-input1" class="swal2-input" placeholder="${placeholder[0]}">` +
            `<input id="swal-input2" class="swal2-input" placeholder="${placeholder[1]}">`,
            preConfirm() {
                const inputs = [document.getElementById("swal-input1").value, document.getElementById("swal-input2").value];
                if (inputs.find(input => !input)) return;
                return inputs;
            },
        });

        if (!value) return;
        cb(value);
    };

    const createSet = async ([name, description]) => {
        const response = await fetch("http://localhost:3001/quiz/collections", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                description
            })
        });
        const data = await response.json();
    };

    return (
        <>
            <nav className="flex flex-row items-center py-4 px-[10%] justify-between">
                <a href="/" className="text-3xl transition ease-in-out delay-150 hover:scale-110 duration-300">Quiz<b>Wiz</b></a>
                <ul className="flex">
                    <li className="relative pt-2.5">
                        <input 
                            type="text" 
                            class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:border-indigo-500 block p-2.5 h-10 outline-none h-5px"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.keyCode === 13 && (window.location.href = `/search/${searchQuery}`)}
                        />
                    </li>
                    {user?.displayName ? (
                        <>
                            <li className="relative">
                                <div className="cursor-pointer block font-medium p-3 m-2" onMouseEnter={() => setVisibility(true)} onMouseLeave={() => setVisibility(false)} >
                                    {/** TODO(Altanis): Make it work better. */}
                                    <span>Create</span>
                                    <ul className={`absolute right-0 w-36 bg-white shadow-lg rounded-lg overflow-hidden ${visibile ? '' : 'hidden'}`}>
                                        <li onClick={() => modal("Create Set", ["Name of set", "Description of set"], createSet)}>
                                            <button className="cursor-pointer block font-medium p-3 hover:bg-gray-200 w-full text-left">Create Set</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <button className="cursor-pointer block font-semibold bg-green-300 hover:bg-green-500 p-3 rounded-lg m-2" onClick={async () => (await logOut())} >Sign Out</button>
                            </li>                    
                        </>
                    ) : (
                        <>
                            <li>
                                <button className="cursor-pointer block font-semibold transition ease-in-out delay-150 bg-green-300 hover:scale-110 hover:bg-green-500 duration-300 p-3 rounded-lg m-2" onClick={() => window.location.href = "/login"}>Sign In</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
};