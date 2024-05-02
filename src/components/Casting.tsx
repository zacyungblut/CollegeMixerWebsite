import React, { useState, useEffect } from "react";
import CollegeMixerLoadingLogo from "../assets/MixerBlack.gif";
import CollegeMixer from "../assets/Mixer.png";
import { useAppDispatch } from "../hooks/hooks";
import { getUserCount } from "../actions/analytics";
import { sendNotificationToAllUsers } from "../actions/notificationMarketing";
import { createNewFilmShoot, getFilmShoots, applyToFilmShoot } from "../actions/casting";
import DailyLikesChart from './DailyLikesChart'; 
import DailyMessagesChart from './DailyMessagesChart';
import  NewUserChart from './NewUserChart';
import { useLocation } from "react-router-dom";



function useQueryParam(name: any) {
    // Hook from react-router to access the location object
    const { search } = useLocation();
  
    // React memoization to ensure the computation is done only when the search changes
    return React.useMemo(() => {
      const params = new URLSearchParams(search);
      return params.get(name);
    }, [name, search]);
  }
  

const Casting = () => {

    const [launchCode, setLaunchCode] = useState(''); // New state for launch code
    const [name, setName] = useState<any>(null);
    const [isTyping, setIsTyping] = useState<any>(null);
    const [major, setMajor] = useState<any>(null);
    const [instagram, setInstagram] = useState<any>(null);
    const [phoneNumber, setPhoneNumber] = useState<any>(null);

    const [selectedFilmShoots, setSelectedFilmShoots] = useState<any>([]);

    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // const [filmShoot, setFilmShoot] = useState<any>(null);

    const [availableFilmShoots, setAvailableFilmShoots] = useState<any>([]);

    const roundToNearestHour = (date: any) => {
        if (date.getMinutes() > 30) {
            date.setHours(date.getHours() + 1);
        }
        date.setMinutes(0);
        return date;
    };

    const now = new Date();
    const roundedNow = roundToNearestHour(new Date(now)); // Clone now to avoid mutating the original date
    const initialDateTime = roundedNow.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'

    // for admin stuff like creating
    const [shootDate, setShootDate] = useState<any>(initialDateTime);
    const [shootName, setShootName] = useState<any>(null);
    const [shootEmojiSummary, setShootEmojiSummary] = useState<any>(null);
    const [shootLocation, setShootLocation] = useState<any>(null);


    const adminCode = useQueryParam('adminCode')

    const dispatch = useAppDispatch();

    const onLoad = async () => {
        const userCountResp = await dispatch(getUserCount());

        const foundAvailableFilmShoots = await dispatch(getFilmShoots());

        setAvailableFilmShoots(foundAvailableFilmShoots.data);

        console.log('we got', foundAvailableFilmShoots)

    }

    useEffect(() => {
        onLoad();
    }, [])

    useEffect(() => {
        const fields = [name, major, instagram, phoneNumber, selectedFilmShoots.length > 0];
        const filledFields = fields.filter(Boolean).length;
        const totalFields = fields.length;
        const progressPercent = (filledFields / totalFields) * 100;
        setProgress(progressPercent);
    }, [name, major, instagram, phoneNumber, selectedFilmShoots]); // Depend on all input fields
      
    const getBackgroundColor = (progress: number) => {
        if (progress <= 50) {
          // Calculate how far progress is between 0 and 50, then interpolate between red and yellow
          const colorProgress = progress / 50;
          const endColor = `rgba(${255}, ${255 * colorProgress}, 0)`; // yellow at 50%
          return `linear-gradient(to right, rgba(255, 0, 0), ${endColor})`; // red to yellow-ish
        } else {
          // Calculate how far progress is between 50 and 100, then interpolate between yellow and green
          const colorProgress = (progress - 50) / 50;
          const startColor = `rgba(${255 - (255 * colorProgress)}, ${255}, ${0})`; // yellow at 50%
          const endColor = `rgba(${255}, ${255}, ${0})`; // green at 100%
          return `linear-gradient(to right, ${startColor}, ${endColor})`; // yellow to green-ish
        }
    }
      

    const handleCreateNewShoot = async () => {
        if (!shootName || !shootDate || !shootEmojiSummary || !shootLocation) {
            alert('Please enter everything for shoot');
            return;
        }

        const shootDateForDB = new Date(shootDate);

        // Assuming createNewFilmShoot expects an object with a date in ISO format
        const shootDetails = {
            shootDate: shootDateForDB.toISOString(),
            shootName: shootName,
            emojiSummary: shootEmojiSummary,
            shootLocation: shootLocation,
        };

        const confirmSend = window.confirm('Are you sure you want to create this new film shoot? This action is irreversible.');
        if (confirmSend) {
            const code = prompt('Please enter the launch code to verify:');
            if (code) {
                await dispatch(createNewFilmShoot(shootDetails, code)); 
            }
        }
    };

    const applyToFilmShootFunction = async () => {
        if (!name || !major || !instagram || !phoneNumber || selectedFilmShoots.length === 0) {
            alert('Please fill all your information and select at least one film shoot to apply for.');
            return;
        }
        setIsLoading(true);
    
        const userInfo = { name, major, instagram, phoneNumber };

        console.log('sfs is', selectedFilmShoots);
    
        // Assuming useAppDispatch hooks up to your Redux store
        const resp = await dispatch(applyToFilmShoot(userInfo, selectedFilmShoots));

        setIsLoading(false);

        if (resp.message === "Sent in your application successfully") {
            setIsSubmitted(true);
            return
        } else {
            alert("Error submitting your application! If it persists please contact our team (hey@collegemixer.us)")
        }


    };

    const handleLinkClick = (link: string) => {
        window.open(link, '_blank');
      }
    

    if (isSubmitted===true) {
        return (
            <div className="items-center justify-center p-2">
                <img src={CollegeMixer} onClick={()=>{}} className="w-[200px] h-[200px] mx-auto my-2" />
                {/* <h1 className="text-center my-4 font-extrabold text-5xl">Winder Admin Dashboard</h1> */}
                <h1 className="text-center font-semibold text-2xl">Submitted your profile. Our casting team will be in touch!</h1>
                <div className="items-center justify-center flex flex-col gap-4 mt-16 mb-4">

                    <button onClick={()=>{handleLinkClick("https://apps.apple.com/us/app/college-mixer/id1671245143")}} className="bg-slate-700 mx-auto m-4 rounded-lg p-3 text-white font-semibold transition-all duration-200 hover:bg-pink-600 hover:scale-95">Get the app</button>
                </div>
            </div>
        )
    }

    return (

        <div className="items-center justify-center p-2">
            <img src={CollegeMixerLoadingLogo} onClick={()=>{}} className="w-[100px] h-[100px] mx-auto my-2" />
            {/* <h1 className="text-center my-4 font-extrabold text-5xl">Winder Admin Dashboard</h1> */}

            <div className="sticky top-0 z-50 bg-white p-1" style={{ width: '100%', height: '30px' }}>
                <div style={{ width: '100%', height: '20px', backgroundColor: '#f3f4f6', borderRadius: '9999px', display: 'flex', alignItems: 'center' }}>
                    <div className="rounded-full duration-200 transition-all" style={{ width: `${progress}%`, height: '100%', background: getBackgroundColor(progress) }}></div>
                    <span className="ml-4 text-sm font-bold" style={{ position: 'absolute', marginLeft: '10px', color: progress < 50 ? 'white' : 'white' }}>{`${progress.toFixed(0)}%`}</span>
                </div>
            </div>


            {adminCode==="zac" && <div className="p-4 bg-gradient-to-r from-red-400 to-orange-700   rounded-lg">
                <h1 className="text-white  font-semibold text-4xl">Create New Shoot (admin)</h1>
                <div><input type="datetime-local" placeholder="Date" className="rounded-md p-2 mt-4 h-8" value={shootDate} onChange={(n) => setShootDate(n.target.value)}></input></div>
                <input placeholder="Shoot Name" className="rounded-md p-2 mt-4 h-8" value={shootName} onChange={(n) => setShootName(n.target.value)}></input>
                <div><input placeholder="Shoot Location" className="rounded-md p-2 mt-4 h-8" value={shootLocation} onChange={(n) => setShootLocation(n.target.value)}></input></div>
                <div className="flex flex-row justify-between">
                    <input placeholder="Emoji Summary (2 emojis)" className="rounded-md p-2 mt-4 h-8" value={shootEmojiSummary} onChange={(n) => setShootEmojiSummary(n.target.value)}></input>
                    <button onClick={handleCreateNewShoot} className="p-2 text-sm shadow-md border border-black shadow-slate-600 px-10 rounded-md bg-slate-800 text-white">Send</button>
                </div>
            </div>
            }




            <h1 className="text-3xl font-bold my-4 mb-10 text-center">College Mixer Video Casting</h1>


            <div className={`p-4 py-4 mt-4 border shadow-inner border-gray-300 rounded-xl duration-100 transition-all ${
                name && isTyping!=="name" ? 'bg-green-500 text-white' : isTyping==="name" ? 'bg-yellow-200' : ''
            }`}>
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl  font-semibold">What's your name?</h3>
                    <div className={`rounded-full text-center text-gray-700 w-12 px-3.5 bg-gray-100 border border-gray-500 p-2`}>
                        {name && isTyping!=="name" ? '✓' : isTyping==="name" ? '...' : '1'}
                    </div>
                </div>

                <input
                    value={name}
                    onFocus={() => setIsTyping("name")}
                    onBlur={() => setIsTyping(null)}
                    onChange={(event) => setName(event.target.value)}
                    className="bg-white mt-4 border text-gray-800 border-gray-200 p-1 rounded-lg"
                    placeholder="e.g., Zac"
                ></input>
            </div>

            <div className={`p-4 py-4 mt-4 border shadow-inner border-gray-300 rounded-xl duration-100 transition-all ${
                major && isTyping!=="major" ? 'bg-green-500 text-white' : isTyping==="major" ? 'bg-yellow-200' : ''
            }`}>
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl  font-semibold">What's your major?</h3>
                    <div className={`rounded-full text-center text-gray-700 w-12 px-3.5 bg-gray-100 border border-gray-500 p-2`}>
                        {major && isTyping!=="major" ? '✓' : isTyping==="major" ? '...' : '2'}
                    </div>
                </div>
                
                <input
                    value={major}
                    onFocus={() => setIsTyping("major")}
                    onBlur={() => setIsTyping(null)}
                    onChange={(event) => setMajor(event.target.value)}
                    className="bg-white mt-4 border text-gray-800 border-gray-200 p-1 rounded-lg"
                    placeholder="e.g., Kinesiology"
                ></input>
            </div>

            <div className={`p-4 py-4 mt-4 border shadow-inner border-gray-300 rounded-xl duration-100 transition-all ${
                instagram && isTyping!=="instagram" ? 'bg-green-500 text-white' : isTyping==="instagram" ? 'bg-yellow-200' : ''
            }`}>
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl  font-semibold">What's your Instagram?</h3>
                    <div className={`rounded-full text-center text-gray-700 w-12 px-3.5 bg-gray-100 border border-gray-500 p-2`}>
                        {instagram && isTyping!=="instagram" ? '✓' : isTyping==="instagram" ? '...' : '3'}
                    </div>
                </div>
                
                <input
                    value={instagram}
                    onFocus={() => setIsTyping("instagram")}
                    onBlur={() => setIsTyping(null)}
                    onChange={(event) => setInstagram(event.target.value)}
                    className="bg-white mt-4 border text-gray-800 border-gray-200 p-1 rounded-lg"
                    placeholder="e.g., @college_mixer"
                ></input>
            </div>

            <div className={`p-4 py-4 mt-4 border shadow-inner border-gray-300 rounded-xl duration-100 transition-all ${
                phoneNumber && isTyping!=="phoneNumber" ? 'bg-green-500 text-white' : isTyping==="phoneNumber" ? 'bg-yellow-200' : ''
            }`}>
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl  font-semibold">What's your phone number?</h3>
                    <div className={`rounded-full text-center text-gray-700 w-12 px-3.5 bg-gray-100 border border-gray-500 p-2`}>
                        {phoneNumber && isTyping!=="phoneNumber" ? '✓' : isTyping==="phoneNumber" ? '...' : '4'}
                    </div>
                </div>
                
                <input
                    value={phoneNumber}
                    type="tel"
                    onFocus={() => setIsTyping("phoneNumber")}
                    onBlur={() => setIsTyping(null)}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className="bg-white mt-4 border text-gray-800 border-gray-200 p-1 rounded-lg"
                    placeholder="e.g., 905-505-1134"
                ></input>
            </div>

            <div className={`p-4 py-4 mt-4  border shadow-inner border-gray-300 rounded-xl duration-100 transition-all ${
                selectedFilmShoots.length>0 && isTyping!=="filmShoot" ? 'bg-green-500 text-white' : isTyping==="filmShoot" ? 'bg-yellow-200' : ''
            }`}>
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl  font-semibold">Pick which shoots to cast for</h3>
                    <div className={`rounded-full text-center text-gray-700 w-12 px-3.5 bg-gray-100 border border-gray-500 p-2`}>
                        {selectedFilmShoots.length>0 && isTyping!=="filmShoot" ? '✓' : isTyping==="filmShoot" ? '...' : '5'}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 my-4">

                    {availableFilmShoots.length > 0 ? (
                        availableFilmShoots.map((shoot: any, index: any) => (
                            <div onClick={() => {
                                    setSelectedFilmShoots(selectedFilmShoots.includes(shoot._id)
                                        ? selectedFilmShoots.filter((id: any) => id !== shoot._id) // Remove the shoot._id if it's already included
                                        : [...selectedFilmShoots, shoot._id] // Add the shoot._id if it's not included
                                    );
                                }} key={index} className={`rounded-lg h-36 w-full p-2 transition-all duration-200 cursor-pointer border  shadow-md my-2 ${selectedFilmShoots.includes(shoot._id) ? 'bg-slate-900  text-white border-slate-700' : ' border-gray-200'}`}>
                                <h2 className="font-bold text-sm">{new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(shoot.shootDate))}</h2>
                                <h3 className="font-semibold text-xs">{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(shoot.shootDate))}</h3>
                                <h4 className={` mt-1 text-xs ${selectedFilmShoots.includes(shoot._id) ? 'text-gray-300' : 'text-gray-600'}`}>{shoot.shootName}</h4>
                                <h1 className="text-2xl my-2">{shoot.emojiSummary}</h1>
                                <h3 className="font-semibold text-xs">📍 {shoot.shootLocation}</h3>
                            </div>
                        ))
                    ) : (
                        <p>No available film shoots found.</p>
                    )}

                    <div onClick={() => {
                            setSelectedFilmShoots(selectedFilmShoots.includes('n/a-other')
                                ? selectedFilmShoots.filter((id: any) => id !== 'n/a-other') // Remove the shoot._id if it's already included
                                : [...selectedFilmShoots, 'n/a-other'] // Add the shoot._id if it's not included
                            );
                        }} className={`rounded-lg h-32 w-full p-2 transition-all duration-200 cursor-pointer border  shadow-md my-2 ${selectedFilmShoots.includes("n/a-other") ? 'bg-slate-900  text-white border-slate-700' : ' border-gray-200'}`}>
                        <h2 className="font-bold text-sm">Other</h2>
                        <h3 className="font-semibold text-xs"></h3>
                        <h4 className={` mt-1 text-xs ${selectedFilmShoots.includes('n/a-other') ? 'text-gray-300' : 'text-gray-600'}`}>If no other times work, select this option</h4>
                        <h1 className="text-2xl my-2">📅🔜</h1>
                    </div>

                </div>

            </div>

            <div onClick={applyToFilmShootFunction} className="p-2 cursor-pointer rounded-lg w-24 border-blue-500 border text-center text-white font-semibold bg-blue-400 shadow-md hover:bg-blue-500 mx-auto mt-4">
                {isLoading ? 'Loading...' : 'Full send'}
            </div>

            <img src={CollegeMixer} onClick={()=>{}} className="w-[200px] h-[200px] mx-auto my-2" />


            {
                adminCode==="zac" && (
                    <>
                    <h1>APPLICANTS</h1>
                        <div className="grid grid-cols-1 gap-2 my-4">
                            {availableFilmShoots.length > 0 ? (
                                availableFilmShoots.map((shoot: any, index: any) => (
                                    <div onClick={() => {
                                            setSelectedFilmShoots(selectedFilmShoots.includes(shoot._id)
                                                ? selectedFilmShoots.filter((id: any) => id !== shoot._id) // Remove the shoot._id if it's already included
                                                : [...selectedFilmShoots, shoot._id] // Add the shoot._id if it's not included
                                            );
                                        }} key={index} className={`rounded-lg h-32 w-full p-2 transition-all duration-200 cursor-pointer border  shadow-md my-2 ${selectedFilmShoots.includes(shoot._id) ? 'bg-slate-900  text-white border-slate-700' : ' border-gray-200'}`}>
                                        <h2 className="font-bold text-sm">{new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(shoot.shootDate))}</h2>
                                        <h3 className="font-semibold text-xs">{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(shoot.shootDate))}</h3>
                                        <h4 className={` mt-1 text-xs ${selectedFilmShoots.includes(shoot._id) ? 'text-gray-300' : 'text-gray-600'}`}>{shoot.shootName}</h4>
                                        <h1 className="text-2xl my-2">{shoot.emojiSummary}</h1>
                                        {/* <h1 className="text-2xl my-2">{shoot.applicants}</h1> */}
                                    </div>
                                ))
                            ) : (
                                <p>No available film shoots found.</p>
                            )}

                        </div>   
                    </>
                   

                )
            }



    </div>

    )
}

export default Casting;