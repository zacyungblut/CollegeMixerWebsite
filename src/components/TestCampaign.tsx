import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GmailLogo from "../assets/Google.png";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { testAutoInbound } from '../actions/autoInbound';
import { verify, getUser, signin } from '../actions/auth';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { CircularProgress } from '@mui/material';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize'
import { toast } from 'react-toastify';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import HomeIcon from '@mui/icons-material/Home';
import EditInbound from "./EditCampaign";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import Wrench from "../assets/Wrench.png";




const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};


const TestCampaign = () => {
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
  const [verifyingUserSession, setVerifyingUserSession] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const query = useQuery();
  const id = query.get('id');
  const isValidated = useAppSelector((state: any) => state.user.isValidated);
  const userTokenFromSlice = useAppSelector((state: any) => state.user.token);
  const { width, height } = useWindowSize();
  const [message, setMessage] = useState('');
  const colors = ['#fb923c', '#f472b6', '#ef4444'];
  const [gotTest, setGotTest] = useState("");

  const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
  const [editInbound, setEditInbound] = useState<any>(null);

  const m1 = 'Hi there, I am interested in your services. How can I get started?';
  const m2 = 'What packages do you have to meet the needs of my small business?';
  const m3 = 'Are you available for a call early next week by chance?';

  const handleTextareaChange = (e: any) => {
    const textareaLength = e.target.value.length;
    setMessage(e.target.value);
  };

  const handleEdit = () => {
    // setEditInbound(inbound);
    setEditSidebarOpen(true);
  };

  async function handleEditSent() {
    setEditSidebarOpen(false);
    setGotTest("");
    setMessage("");
  }


  async function tryVerify() {
    if (isValidated && userTokenFromSlice) {
      return;
    }

    const resp = await dispatch(verify(userToken));
    if (resp.valid === true) {
      setVerifyingUserSession(false);
    } else {
      localStorage.removeItem('profile');
      navigate('/login');
    }

    const resp2 = await dispatch(getUser(userToken));
    if (resp2.valid === true) {
      setName(resp2.result.name);
    }
  }

  useEffect(() => {
    if (userToken !== '') {
      tryVerify();
    } else {
      navigate("/login")
    }
  }, []);

  async function submit() {
    setIsLoading(true);

    if (message === "") {
      alert("Please enter a message");
      setIsLoading(false);
      return;
    }

    if (id==="" || !id) {
      navigate("/app");
      return;
    }

    toast.promise(
      dispatch(testAutoInbound(userToken, message, id)).then(resp => {
        if (resp.valid) {
          setIsLoading(false);
          setGotTest(resp.result);
          setEditInbound(resp.autoInbound);
          console.log('result is', resp.result);
        } else {
          setIsLoading(false);
          return;
        }
      }),
      {
        pending: 'Fetching response...',
        success: 'Response generated!',
        error: 'Error',
      },
      {
        toastId: 'fetchEmail',
        theme: "light",
        position: "bottom-left",
        autoClose: 5000,
      }
    );
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <>
      <div className={`transition-colors font-sans leading-normal tracking-normal min-h-screen max-w-screen h-screen duration-1000`}>
        <Confetti
          width={width}
          height={height}
          colors={colors}
          numberOfPieces={200}
          recycle={false}
        />
        <div className="relative h-full">
          <Link to="/app">
            <button className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded shadow">
              <HomeIcon className="-mt-1 mr-1.5" />
              Home
            </button>
          </Link>
            {gotTest!=="" ?
            <>
                <div className="mx-auto  my-auto w-[550px] transform">
                    <div
                        className={`transition-all duration-500 ${gotTest !== "" ? 'opacity-100 transform translate-y-0' : 'hidden opacity-0 -translate-y-2'}`}
                        style={{
                        transitionProperty: 'opacity, transform'
                        }}
                    >
                        <h1 className="text-4xl font-bold mb-2 pt-20">Result:</h1>
                        <div className="text-gray-500 font-base text-sm mb-6">
                            This is exactly how ChatGPT will respond to a potential client named <strong>Michael</strong>. Use the insights to perfect your campaign
                        </div>
                        <p className="p-4 font-medium bg-white border border-red-500 shadow-xl rounded-2xl leading-10">
                        {gotTest}
                        </p>
                        <div className="mt-4 text-sm text-gray-400">waited <span className="font-semibold underline">{formatTime(editInbound?.responseTime+3 ?? 0)}</span> before sending response</div>
                        <div className="flex flex-row mt-6">
                          <SubdirectoryArrowRightIcon className="mr-2" style={{ color: '#0ea5e9' }} fontSize="large" />
                          <div className="text-gray-600 font-base text-md mb-6 border p-2 rounded-sm">
                            {message}
                          </div>
                        </div>
                    </div>

                    <div className="justify-start mx-auto mt-4 items-start pt-1">
                      <div className="text-lg text-white bg-gray-900 hover:-translate-y-px hover:opacity-80 hover:bg-black cursor-pointer shadow-md font-semibold p-2 rounded-lg px-4 transition duration-200 hover:shadow-lg inline-block" onClick={handleEdit}>
                        Edit Campaign <img className="inline ml-1 -mt-0.5 h-5 w-auto" src={Wrench} />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-12">
                        <div className="py-3 px-2 w-1/3 underline cursor-pointer mt-4 text-xl rounded-xl text-gray-600 hover:text-gray-800 text-center font-semibold" onClick={() => {setGotTest(""); setMessage("");}}>
                          Retry
                        </div>
                        <div className={`shadow-red-200 shadow-xl py-3 mb-20 px-2 w-2/3 bg-red-600 cursor-pointer text-xl hover:shadow-md hover:bg-red-700 mt-4 rounded-xl text-white text-center font-semibold`} onClick={()=>{navigate("/app")}}>
                            Dashboard
                        </div>
                    </div>
                </div>
            </> 
            : 
            <div className="absolute w-[550px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="rounded px-12 pt-8 pb-10 mb-6">
                <h2 className="text-black font-semibold text-5xl mb-4 mt-16">
                    Let's give it a try!
                </h2>
                <div className="text-gray-500 font-base text-md mb-4">
                    Test your campaign out now with a custom message or one of our pre-built prompts
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <label htmlFor="subject" className="block text-base font-semibold text-gray-700 mt-6">
                    Message
                    </label>
                    <textarea className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-32 resize-none" value={message} onChange={handleTextareaChange} id="message" placeholder="e.g. I run a Toronto based bakery and am looking for help with my SEO"></textarea>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden -mt-3 mb-2">
                    <div className="h-full rounded-full transition-all duration-150" style={{ width: `${message.length * 100 / 45}%`, backgroundColor: `rgb(${255 - message.length * 255 / 45}, ${message.length * 255 / 45}, 0)` }}></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div onClick={() => { setMessage(m1) }} className="py-1 w-full font-medium border rounded-lg px-4 bg-gray-100 text-gray-800 bg-opacity-30 hover:border-1 hover:shadow  transition duration-150 hover:bg-gray-200 hover:bg-opacity-100 cursor-pointer">
                        <AddBoxOutlinedIcon fontSize="small" className="mb-0.5 mr-1" />
                        Hi there, I am interested in your services...
                      </div>
                      <div onClick={() => { setMessage(m2); }} className="py-1 w-full font-medium border rounded-lg px-4 bg-gray-100 text-gray-800 bg-opacity-30 hover:border-1 hover:shadow  transition duration-150 hover:bg-gray-200 hover:bg-opacity-100 cursor-pointer">
                        <AddBoxOutlinedIcon fontSize="small" className="mb-0.5 mr-1" />
                        What packages do you have for small businesses...
                      </div>
                      <div onClick={() => { setMessage(m3); }} className="py-1 w-full font-medium border rounded-lg px-4 bg-gray-100 text-gray-800 bg-opacity-30 hover:border-1 hover:shadow  transition duration-150 hover:bg-gray-200 hover:bg-opacity-100 cursor-pointer">
                        <AddBoxOutlinedIcon fontSize="small" className="mb-0.5 mr-1" />
                        Are you available for a call early next week...
                      </div>
                    </div>
                    <div className="flex gap-2 mt-12">
                        <Link to="/app" className="py-3 px-2 w-1/4 mt-4 text-xl rounded-xl hover:underline text-gray-600 hover:text-gray-800 text-center font-semibold">
                            <div onClick={() => {}}>
                            Cancel
                            </div>
                        </Link>
                        {isLoading ?
                            <div className="justify-center items-center mx-auto my-auto pt-6">
                            <CircularProgress className="justify-center items-center" style={{ 'color': '#000000' }} size={32} />
                            </div> :
                            <><div className={`shadow-red-200 shadow-xl py-3 px-2 w-9/12 bg-red-600 cursor-pointer text-xl hover:shadow-md hover:bg-red-700 mt-4 rounded-xl text-white text-center font-semibold transition duration-200`} onClick={submit}>
                              Test
                            </div>
                            {/* <div className={`shadow-blue-200 font-semibold text-black shadow-xl py-3 px-2 w-3/12 border-2 border-blue-600 cursor-pointer text-sm hover:shadow-md hover:text-white hover:bg-blue-600 mt-4 rounded-xl text-center transition duration-200`} onClick={submit}>
                              Test & Email
                            </div> */}
                            </>}
                        </div>
                    </div>
                </div>
            </div>}
        </div>
        <div
          className={`w-[500px] overflow-scroll bg-gray-50 shadow-lg fixed right-0 top-0 h-full z-50 transform transition-transform duration-300 ${
              isEditSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-600 focus:outline-none py-0.5 px-2 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => setEditSidebarOpen(false)}>
            &times;
          </button>
          {!isEditSidebarOpen ? null : <EditInbound autoInbound={editInbound} handleEditSent={handleEditSent} />}
          <div></div>
        </div>
      </div>
    </>
  );
};

export default TestCampaign;
