import React, { useState } from "react";
import WinderLogo from "../assets/WinderLogo.gif";



const Dashboard = () => {

    const [notificationSubject, setNotficationSubject] = useState("");
    const [notificationMessage, setNotficationMessage] = useState("");


    return (

        <div className="items-center justify-center p-2">
            <img src={WinderLogo} className="w-[100px] h-[100px] mx-auto my-2" />
            {/* <h1 className="text-center my-4 font-extrabold text-5xl">Winder Admin Dashboard</h1> */}

            <div className="p-4 bg-gradient-to-r from-sky-600 to-sky-700   rounded-lg">
                <h1 className="text-white  font-semibold text-4xl">Send Notification</h1>
                <input placeholder="Subject" className="rounded-md p-2 mt-4 h-8" value={notificationSubject} onChange={(n) => setNotficationSubject(n.target.value)}></input>
                <div className="flex flex-row justify-between">
                    <input placeholder="Message" className="rounded-md p-2 mt-4 h-8" value={notificationMessage} onChange={(n) => setNotficationMessage(n.target.value)}></input>
                    <button className="p-2 text-sm shadow-md border border-black shadow-slate-600 px-10 rounded-md bg-slate-800 text-white">Send</button>
                </div>
            </div>

            <div className="flex-row flex mt-8 gap-2">
                <div className="border gap-4 rounded-lg w-1/2 p-2 flex items-center">
                    <h3>Total Users:&nbsp;</h3>
                    <h3 className="text-5xl font-semibold">17,490</h3>
                </div>
                <div className="border gap-4 rounded-lg w-1/2 p-2 flex items-center">
                    <h3>User Hours:&nbsp;</h3>
                    <h3 className="text-5xl font-semibold">846,284</h3>
                </div>
            </div>

        </div>

    )
}

export default Dashboard