import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import ZohoLogo from "../assets/Zoho.png";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { verify, connectGoogleAppPassword } from '../actions/auth';
import GAuth1 from "../assets/GAuth1.png";
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';


//our link: 653017425960-a2oj5ecd2ar5es7bvomossol18tut19b.apps.googleusercontent.com

const ConnectEmail = () => {

    const [connectState, setConnectState] = useState({'step': 1, 'provider': 'none'})
    const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
    const [verifyingUserSession, setVerifyingUserSession] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const [tryAttempt, setTryAttempt] = useState(0);
    const isValidated = useAppSelector((state: any) => state.user.isValidated);
    const userTokenFromSlice = useAppSelector((state: any) => state.user.token);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [googleEmail, setGoogleEmail] = useState('');
    const [googlePassword, setGooglePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    async function tryVerify() {
        
        if (isValidated && userTokenFromSlice) {return}

        const resp = await dispatch(verify(userToken));
        console.log('respver is', resp);
        if (resp.valid===true) {
            setVerifyingUserSession(false);
            setUserEmail(resp.email);
            console.log('your email is', resp.email);
        } else {
            setTryAttempt(tryAttempt+1);
            if (tryAttempt > 0) {
                localStorage.removeItem('profile');
                navigate('/login');
            }
        }
      }

      useEffect(() => {
        if (userToken!=='') {
          tryVerify();
      } else {
        navigate("/login")
      }
      }, [])
      
      

    const copyToClipboard = async () => {
        try {
          const textToCopy = '653017425960-a2oj5ecd2ar5es7bvomossol18tut19b.apps.googleusercontent.com';
          await navigator.clipboard.writeText(textToCopy);
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
    };

    async function submitGoogleAppPassword() {
        setIsLoading(true);
        const resp = await dispatch(connectGoogleAppPassword(userToken, googleEmail, googlePassword));
        if (resp.valid===true) {
            toast.success("Email connected!", 
            {
              position: "top-center",
            });
            navigate("/app");
            setIsLoading(false);
        } else {
            toast.error("Failed to connect",
            {
                position: "top-center",
            });
            setIsLoading(false);
        }

    }

    if (connectState.step===1) {
        return (
            <>
        <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-screen">
            <div className="relative h-full">
            <Link to="/app">
                <button className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded shadow">
                <ChevronLeftIcon className="-mt-0.5" />
                Back
                </button>
            </Link>
            <div className="absolute w-92 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-gray-700 font-semibold text-2xl mb-4">
                    Connect a new email account
                </h2>
                <Divider />
                <div className="grid grid-cols-1 gap-4 mt-8">
                    <button className="p-4 rounded-lg transition duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:shadow-outline" onClick={()=> { if (userEmail!=="test@google.com") {setConnectState({step: 4, provider: 'google'})} else {setConnectState({step: 4, provider: 'google'})} }}> 
                        <div className="flex text-left items-center">
                            <img src={GmailLogo} alt="Gmail Logo" className="w-10 h-10 mr-4" />
                            <div>
                                <p className="font-bold">Google</p>
                                <p className="-mr-4">use Gmail</p>
                            </div>
                        </div>
                    </button>
                    <button className="p-4 rounded-lg transition duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:shadow-outline">
                        <a href={`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=d08555f8-a260-4d70-b2fc-2eaeaa598eae&response_type=code&prompt=consent&redirect_uri=https://speedlead.xyz/app/connect/outlook-callback&response_mode=query&scope=openid%20email%20offline_access%20profile%20https%3A%2F%2Fgraph.microsoft.com%2FUser.Read%20https%3A%2F%2Fgraph.microsoft.com%2FMail.Read%20https%3A%2F%2Fgraph.microsoft.com%2FMail.Send`}>
                            <div className="flex text-left items-center">
                                <img src={OutlookLogo} alt="Outlook Logo" className="w-10 h-10 mr-4" />
                                <div>
                                <p className="font-bold">Microsoft</p>
                                <p className="-mr-4">use Outlook</p>
                                </div>
                            </div>
                        </a>
                    </button>
                    <button className="p-4 rounded-lg transition duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:shadow-outline">
                        <a href={`https://accounts.zoho.com/oauth/v2/auth?scope=ZohoMail.messages.READ,ZohoMail.messages.CREATE,ZohoMail.accounts.READ&client_id=1000.XTQTR1IAB48WBGZQQQC3EE71UM2GUU&response_type=code&access_type=offline&prompt=consent&redirect_uri=http://127.0.0.1:5173/app/connect/zoho-callback`}>
                        <div className="flex text-left items-center">
                            <img src={ZohoLogo} alt="Zoho Logo" className="w-10 h-10 mr-4" />
                            <div>
                            <p className="font-bold">Zoho</p>
                            <p className="-mr-4">use Zoho Mail</p>
                            </div>
                        </div>
                        </a>
                    </button>
                    <div className="text-xs mt-6 text-gray-500">
                    SpeedLead's use and transfer of information received from Google APIs to any other app will adhere to <a className="underline text-blue-400 hover:text-blue-500" href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank">Google API Services User Data Policy</a>, including the Limited Use requirements.

                    </div>
                </div>
                
                </div>
            </div>
            </div>
        </div>
        </>
        )
    }

    if (connectState.provider==='google' && connectState.step===2) {
        return (
            <>
            <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-screen">
            <div className="relative h-full">
            <Link to="/app">
                <button className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded">
                <ChevronLeftIcon className="-mt-0.5" />
                Back
                </button>
            </Link>
            <div className="absolute w-[400px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-gray-400 cursor-pointer font-semibold text-sm mb-4 hover:underline" onClick={()=> {setConnectState({step: 1, provider: "none"})}}>
                    <ChevronLeftIcon />
                    Connect a different provider
                </h2>
                <Divider />
                <div className="grid grid-cols-1 gap-4 mt-2">
                    <div className="p-4 rounded-lg transition duration-300 ease-in-out">
                        <div className="flex">
                            <img src={GmailLogo} alt="Gmail Logo" className="w-10 h-10 mr-4" />
                            <div className="flex-col text-left">
                                <p className="font-bold">Connect your Google Account</p>
                                <p className="-mr-4 font-semibold text-gray-500">Gmail/G-suite</p>
                            </div>
                        </div>
                        <div className="mt-10 text-center text-md">
                                First, <a className="font-bold text-sunset">enable IMAP</a> access for your Google account
                        </div>
                    </div>
                </div>
            <Divider />
            <p className="ml-4 mt-8 text-black">1. Open Gmail on your Desktop</p>
            <p className="ml-4 mt-4 text-black">2. Open <SettingsIcon fontSize="small" /> Settings in the top right corner</p>
            <p className="ml-4 mt-4 text-black">3. Click the <a className="text-sunset font-semibold">Forwarding and POP/IMAP</a> tab.</p>
            <p className="ml-4 mt-4 text-black">4. In the "IMAP access" section, select <a className="font-bold">Enable IMAP.</a></p>
            <p className="ml-4 mt-4 text-black">5. Click Save Changes.</p>

            <button className="flex mx-auto mt-8 items-center bg-sunset px-8 text-white hover:bg-rose-800 shadow-lg text-lg py-2 rounded-md text-center justify-center" onClick={()=> {setConnectState({step: 3, provider: "google"})}}>IMAP has been enabled <ChevronRightIcon className="-mr-4 -mb-0.5" /></button>
            <Link to="/app"><button className="flex mx-auto mt-4 items-center py-2 rounded-md text-center justify-center underline">Cancel</button></Link>




            </div>
            </div>
            </div>
        </div>
        </>
    )}

    if (connectState.provider==='google' && connectState.step===3) {
        return (
            <>
        <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-fit">
            <div className="relative h-full">
            <Link to="/app">
                <button className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded">
                <ChevronLeftIcon className="-mt-0.5" />
                Back
                </button>
            </Link>
            <div className="w-[600px] mx-auto pt-10 ">
                <div className="bg-white shadow-md rounded p-10 mb-4">
                <h2 className="text-gray-400 cursor-pointer font-semibold text-sm mb-4 hover:underline" onClick={()=> {setConnectState({step: 1, provider: "none"})}}>
                    <ChevronLeftIcon />
                    Connect a different provider
                </h2>
                <Divider />
                <div className="grid grid-cols-1 gap-4 mt-2">
                    <div className="p-4 rounded-lg transition duration-300 ease-in-out">
                        <div className="flex">
                            <img src={GmailLogo} alt="Gmail Logo" className="w-10 h-10 mr-4" />
                            <div className="flex-col text-left">
                                <p className="font-bold">Connect your Google Account</p>
                                <p className="-mr-4 font-semibold text-gray-500">Gmail/G-suite</p>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-md font-bold text-gray-500">
                            Enable 2-step verification & generate App password
                        </div>
                        <a href="https://www.youtube.com/watch?v=J4CtP1MBtOE&t=10s"></a>
                        <div className="mt-4 mb-2 text-center mx-8">
                        </div>
                    </div>
                </div>
            <Divider />
            <p className="ml-4 mt-6 font-medium text-black">1. Go to your <a href="https://myaccount.google.com/security" target="_blank" className="text-sunset cursor-pointer hover:text-rose-800 hover:underline">Google Account's Security Settings</a></p>
            <p className="ml-4 mt-4 font-medium text-black">2. Enable <a href="https://myaccount.google.com/signinoptions/two-step-verification" target="_blank" className="text-sunset cursor-pointer hover:text-rose-800 hover:underline">2-step verification</a></p>
            <p className="ml-4 mt-4 font-medium text-black">3. Create an <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-sunset cursor-pointer hover:text-rose-800 hover:underline">App Password</a>
                <p className="mt-2 text-gray-500 ml-2 text-sm p-1 rounded-md overflow-x-auto">
                    Select 'Other'for both App and Device
                </p>
            </p>

            <div className="flex flex-row gap-4 justify-center items-center">
                <button onClick={()=> {setConnectState({step: 2, provider: "google"})}} className="flex mt-8 items-center px-8 text-gray-600 text-lg py-2 transition duration-150 hover:underline hover:text-black rounded-md text-center justify-center"><ChevronLeftIcon className="-ml-4 -mb-0.5" />Back</button>
                <button onClick={()=> {setConnectState({step: 6, provider: "google"})}} className="flex mt-8 items-center bg-sunset px-8 text-white hover:shadow-xl transition duration-150 hover:bg-rose-800 shadow-lg text-lg py-2 rounded-md text-center justify-center">Final Step<ChevronRightIcon className="-mr-4 -mb-0.5" /></button>
            </div>
 
                <Link to="/app"><button className="flex mx-auto mt-4 items-center py-2 rounded-md text-center justify-center underline">Cancel</button></Link>



            </div>
            </div>
            </div>
        </div>
        </>
        );

    }

    if (connectState.provider==='google' && connectState.step===6) {
        return (
            <>
        <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-fit">
            <div className="relative h-full">
            <Link to="/app">
                <button className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded">
                <ChevronLeftIcon className="-mt-0.5" />
                Back
                </button>
            </Link>
            <div className="w-[600px] mx-auto pt-10 ">
                <div className="bg-white shadow-md rounded p-10 mb-4">
                <h2 className="text-gray-400 cursor-pointer font-semibold text-sm mb-4 hover:underline" onClick={()=> {setConnectState({step: 1, provider: "none"})}}>
                    <ChevronLeftIcon />
                    Connect a different provider
                </h2>
                <Divider />
                <div className="grid grid-cols-1 gap-4 mt-2 mb-10">
                    <div className="p-4 rounded-lg transition duration-300 ease-in-out">
                        <div className="flex">
                            <img src={GmailLogo} alt="Gmail Logo" className="w-10 h-10 mr-4" />
                            <div className="flex-col text-left">
                                <p className="font-bold">Connect your Google Account</p>
                                <p className="-mr-4 font-semibold text-gray-500">Gmail/G-suite</p>
                            </div>
                        </div>
    
                    </div>
                </div>
            <Divider />
    
            <form className="px-10 my-4">
                {/* <div className="flex flex-row gap-10 mb-3 w-full">
                    <label htmlFor="subject" className="block w-1/2 text-lg font-semibold text-gray-700">First Name</label>
                    <label htmlFor="subject" className="block w-1/2 text-lg font-semibold text-gray-700">Last Name</label>
                </div>
                <div className="flex flex-row gap-10 w-full">
                    <input type="text" placeholder="First Name" className="w-1/2 border rounded py-3.5 px-3 text-grey-darker"/>
                    <input type="text" placeholder="Last Name" className="w-1/2 border rounded py-3.5 px-3 text-grey-darker"/>
                </div> */}
                <label htmlFor="subject" className="block mt-6 text-lg font-semibold text-gray-700">Email<span className="text-red-500 ml-1">*</span></label>
                <input type="email" value={googleEmail} onChange={(e)=>setGoogleEmail(e.target.value)} placeholder="Email" className="border rounded py-3.5 px-3 text-grey-darker mt-2 w-full"/>
                <label htmlFor="subject" className="block mt-6 text-lg font-semibold text-gray-700">App Password<span className="text-red-500 ml-1">*</span></label>
                <div className="text-gray-500 text-sm mb-2 mt-1">Enter your 16 character app password <span className="text-sunset font-semibold pr-32">without any spaces</span></div>
                <input type="text" value={googlePassword} onChange={(p)=>setGooglePassword(p.target.value)} placeholder="App Password" className="border rounded py-3.5 px-3 text-grey-darker mt-2 w-full"/>
            </form>
    
            <div className="flex flex-row gap-4 justify-center items-center">
                <button onClick={()=> {setConnectState({step: 3, provider: "google"})}} className="flex mt-8 items-center px-8 text-gray-600 text-lg py-2 transition duration-150 hover:underline hover:text-black rounded-md text-center justify-center"><ChevronLeftIcon className="-ml-4 -mb-0.5" />Back</button>
                {isLoading ? <CircularProgress className="-mb-8" size={28} style={{ color: '#000000' }} /> : <button onClick={submitGoogleAppPassword} className="flex mt-8 items-center bg-green-500 px-8 text-white hover:shadow-xl transition duration-150 hover:bg-green-600 shadow-lg shadow-green-200 text-lg py-2 rounded-md text-center justify-center">Connect<ChevronRightIcon className="-mr-4 ml-1 -mb-0.5" /></button>}
            </div>
    
                <Link to="/app"><button className="flex mx-auto mt-4 items-center py-2 rounded-md text-center justify-center underline">Cancel</button></Link>
    
    
    
            </div>
            </div>
            </div>
        </div>
        </>
        );
    
    }
    

    if (connectState.provider==='google' && connectState.step===5) {
        return (
            <>
        <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-fit">
            <div className="relative h-full">
            <Link to="/app">
                <button className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded">
                <ChevronLeftIcon className="-mt-0.5" />
                Back
                </button>
            </Link>
            <div className="w-[500px] mx-auto pt-10 ">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-gray-400 cursor-pointer font-semibold text-sm mb-4 hover:underline" onClick={()=> {setConnectState({step: 1, provider: "none"})}}>
                    <ChevronLeftIcon />
                    Connect a different provider
                </h2>
                <Divider />
                <div className="grid grid-cols-1 gap-4 mt-2">
                    <div className="p-4 rounded-lg transition duration-300 ease-in-out">
                        <div className="flex">
                            <img src={GmailLogo} alt="Gmail Logo" className="w-10 h-10 mr-4" />
                            <div className="flex-col text-left">
                                <p className="font-bold">Connect your Google Account</p>
                                <p className="-mr-4 font-semibold text-gray-500">Gmail/G-suite</p>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-md font-bold text-gray-500">
                            Allow SpeedLead to access your Google workspace
                        </div>
                        <div className="mt-4 mb-2 text-center mx-8">
                            <p className="py-2 px-2 rounded-md text-xs font-semibold text-gray-500 bg-orange-300">You must use a Google workspace account, not Gmail</p>
                        </div>
                    </div>
                </div>
            <Divider />
            <p className="ml-4 mt-6 text-black">1. Go to your <a href="https://admin.google.com/u/1/ac/owl/list?tab=configuredApps" target="_blank" className="text-sunset cursor-pointer hover:text-rose-800 hover:underline">Google Workspace Admin Panel</a></p>
            <p className="ml-4 mt-4 text-black">2. Click "Add App" and then select "OAuth App Name or Client ID"</p>
            <p className="ml-4 mt-4 text-black">3. Use the following Client-ID to search for SpeedLead, and approve access to your Google workspace: 
                <pre className="mt-4 bg-gray-800 p-4 rounded-md overflow-x-auto">
                    <code className="text-gray-200 text-xs font-mono whitespace-pre-wrap break-words select-all">
                        653017425960-a2oj5ecd2ar5es7bvomossol18tut19b.apps.googleusercontent.com
                    </code>
                    </pre>
                    <button className="mt-2 px-4 py-1 text-sm font-semibold bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg" onClick={copyToClipboard} ><ContentCopyIcon fontSize="small" /> Copy</button>
            </p>

            <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=653017425960-a2oj5ecd2ar5es7bvomossol18tut19b.apps.googleusercontent.com&redirect_uri=https://speedlead.xyz/app/connect/google-callback&response_type=code&scope=https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=consent">
                <button className="flex mx-auto mt-8 items-center bg-sunset px-8 text-white hover:bg-rose-800 shadow-lg text-lg py-2 rounded-md text-center justify-center">Connect <ChevronRightIcon className="-mr-4 -mb-0.5" /></button>
            </a>
            <Link to="/app"><button className="flex mx-auto mt-6 items-center py-2 rounded-md text-center justify-center underline">Cancel</button></Link>




            </div>
            </div>
            </div>
        </div>
        </>
        );

    }

    if (connectState.provider==='google' && connectState.step===4) {
        return (
            <>
            <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-screen">
            <div className="relative h-full">
            <Link to="/app">
                <button className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded">
                <ChevronLeftIcon className="-mt-0.5" />
                Back
                </button>
            </Link>
            <div className="absolute w-[400px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-gray-400 cursor-pointer font-semibold text-sm mb-4 hover:underline" onClick={()=> {setConnectState({step: 1, provider: "none"})}}>
                    <ChevronLeftIcon />
                    Connect a different provider
                </h2>
                <Divider />
                <div className="grid grid-cols-1 gap-4 mt-2">
                    <div className="p-4 rounded-lg transition duration-300 ease-in-out">
                        <div className="flex">
                            <img src={GmailLogo} alt="Gmail Logo" className="w-10 h-10 mr-4" />
                            <div className="flex-col text-left">
                                <p className="font-bold">Connect your Google Account</p>
                                <p className="-mr-4 font-semibold text-gray-500">Gmail/G-suite</p>
                            </div>
                        </div>
                        <div className="mt-10 text-center text-md">
                                We need access to a few things so you can <span className="font-bold text-sunset">get started.</span>
                        </div>
                    </div>
                </div>
            <Divider />
            <p className="ml-4 mt-8 text-black">1. SpeedLead needs access to view emails</p>
            <p className="ml-4 mt-4 text-black">2. SpeedLead needs access to send emails</p>

            <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=653017425960-a2oj5ecd2ar5es7bvomossol18tut19b.apps.googleusercontent.com&redirect_uri=https://speedlead.xyz/app/connect/google-callback&response_type=code&scope=https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=consent">
                <button className="flex mx-auto mt-8 items-center py-2 rounded-md text-center justify-center">
                    <img src={GAuth1} alt="SignIn" className="w-auto h-auto" />
                </button>
            </a>
            
            <Link to="/app"><button className="flex mx-auto mt-4 items-center py-2 rounded-md text-center justify-center underline">Cancel</button></Link>




            </div>
            </div>
            </div>
        </div>
        </>
    )}

    return (
        <>
        <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-screen">
            Error
        </div>
        </>
    );
};

export default ConnectEmail;
