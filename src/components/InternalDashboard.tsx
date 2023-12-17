import React, { useState, useEffect } from "react";
import WinderLogo from "../assets/WinderLogo.gif";
import { useAppDispatch } from "../hooks/hooks";
import { getUserCount } from "../actions/analytics";
import { sendNotificationToAllUsers } from "../actions/notificationMarketing";




const Dashboard = () => {

    const [notificationSubject, setNotficationSubject] = useState("");
    const [notificationMessage, setNotficationMessage] = useState("");
    const [launchCode, setLaunchCode] = useState(''); // New state for launch code
    const [userCount, setUserCount] = useState<number | null>();
    const [incompleteCount, setIncompleteCount] = useState<number | null>();
    const [maleCount, setMaleCount] = useState<number | null>();
    const [femaleCount, setFemaleCount] = useState<number | null>();
    const [otherGenderCount, setOtherGenderCount] = useState<number | null>();


    const dispatch = useAppDispatch();

    const onLoad = async () => {
        const userCountResp = await dispatch(getUserCount());
        setUserCount(userCountResp.totalUsers);
        setIncompleteCount(userCountResp.incompleteProfiles);
        setMaleCount(userCountResp.maleUsers);
        setFemaleCount(userCountResp.femaleUsers);
        setOtherGenderCount(userCountResp.nonBinaryOrNonStraightUserss);


    }

    useEffect(() => {
        onLoad();
    }, [])

    const handleSendClick = async () => {
        if (!notificationSubject || !notificationMessage) {
            alert('Please enter both subject and message.');
            return;
        }
        const confirmSend = window.confirm('Are you sure you want to send this notification? This action is irreversible.');
        if (confirmSend) {
            const code = prompt('Please enter the launch code to verify:');
            if (code) {
                await dispatch(sendNotificationToAllUsers(notificationSubject, notificationMessage, code)); 
            }
        }
    };
    


    return (

        <div className="items-center justify-center p-2">
            <img src={WinderLogo} className="w-[100px] h-[100px] mx-auto my-2" />
            {/* <h1 className="text-center my-4 font-extrabold text-5xl">Winder Admin Dashboard</h1> */}

            <div className="p-4 bg-gradient-to-r from-sky-600 to-sky-700   rounded-lg">
                <h1 className="text-white  font-semibold text-4xl">Send Notification</h1>
                <input placeholder="Subject" className="rounded-md p-2 mt-4 h-8" value={notificationSubject} onChange={(n) => setNotficationSubject(n.target.value)}></input>
                <div className="flex flex-row justify-between">
                    <input placeholder="Message" className="rounded-md p-2 mt-4 h-8" value={notificationMessage} onChange={(n) => setNotficationMessage(n.target.value)}></input>
                    <button onClick={handleSendClick} className="p-2 text-sm shadow-md border border-black shadow-slate-600 px-10 rounded-md bg-slate-800 text-white">Send</button>
                </div>
            </div>

            <div className="flex-row flex mt-8 gap-2">
                <div className="border gap-4 rounded-lg w-1/2 p-2 flex flex-col items-center">
                    <div className="flex  items-center">
                        <h3>Total Users:&nbsp;</h3>
                        <h3 className="text-5xl font-semibold">{userCount || ""}</h3>
                    </div>
                    <div className="flex  items-center">
                        <h3># incomplete profiles:&nbsp;</h3>
                        <h3 className="text-5xl font-semibold text-gray-500">{incompleteCount || ""}</h3>
                    </div>

                </div>
                <div className="border gap-4 rounded-lg w-1/2 p-2 flex flex-col items-center">
                    <div className="flex  items-center">
                        <h3>Number of Guys:&nbsp;</h3>
                        <h3 className="text-5xl text-blue-800 font-semibold">{maleCount || ""}</h3>
                    </div>
                    <div className="flex items-center">
                        <h3>Number of Girls:&nbsp;</h3>
                        <h3 className="text-5xl text-red-700 font-semibold">{femaleCount || ""}</h3>
                    </div>
                </div>
                <div className="border gap-4 rounded-lg w-1/2 p-2 flex items-center">
                    <h3>Number of user actions</h3>
                    <h3 className="text-5xl font-semibold">0</h3>
                </div>
            </div>

        </div>

    )
}

export default Dashboard