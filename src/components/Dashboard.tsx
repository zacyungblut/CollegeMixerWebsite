import React, { useState, useEffect } from "react";
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import ZohoLogo from "../assets/Zoho.png";
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import GmailLogo2 from "../assets/GmailLogo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { getUserAutoInbounds, outlookActivateAutoInbound, outlookDeactivateAutoInbound, googleActivateAutoInbound, googleDeactivateAutoInbound, deleteAutoInbound } from "../actions/autoInbound";
import { unsubscribeUser, getDashNewsletters } from "../actions/newsletter";
import { getUser, getUserSubscriptions } from "../actions/auth";
import { dashboardGetUserProcessedEmails } from "../actions/processedEmails";
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress } from '@mui/material';
import EditInbound from "./EditCampaign";
import DailyStatsChart from "./Charts/DailyStatsChart";
import RatioChart from "./Charts/RatioChart";
import SurferImg from "../assets/Surfer.png";
import ForestImg from "../assets/Forest.png";
import ForestImg2 from "../assets/Forest2.png";
import ForestImg3 from "../assets/Forest3.png";
import ForestImg4 from "../assets/Forest4.png";
import ForestImg5 from "../assets/Forest5.png";
import ForestImg6 from "../assets/Forest6.png";
import ForestImg7 from "../assets/Forest7.png";
import ForestImg8 from "../assets/Forest8.png";
import ForestImg9 from "../assets/Forest9.png";
import ForestImg10 from "../assets/Forest10.png";
import ForestImg11 from "../assets/Forest11.png";
import usePreloadImages from "../hooks/usePreloadImages";
import Skeleton from '@mui/material/Skeleton';
import moment from 'moment-timezone';
import SpeedIcon from '@mui/icons-material/Speed';
import { InputBase, IconButton, Checkbox, Tabs, Tab, Box, ButtonBase } from '@mui/material';
import Divider from "@mui/material/Divider";
import ReplyIcon from '@mui/icons-material/Reply';
import MorningBrewImg from "../assets/MorningBrew.png";
import DOMPurify from 'dompurify';





interface AutoInbound {
  _id: string;
  name: string;
  ownerEmail: string;
  emailAccount: string;
  calendarLink: string;
  emailAccountId: string;
  industry: string;
  provider: string; 
  responseTime: any;
  isActive: boolean;
  subjectLine: string;
  receivedCount: number;
  responseCount: number;
  revenueCount: number;
}
  


const Dashboard = () => {

    const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
    const [editInbound, setEditInbound] = useState(null);
    const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
    const dispatch = useAppDispatch();
    const [loadingAutoInbounds, setLoadingAutoInbounds] = useState(true);
    const [autoInbounds, setAutoInbounds] = useState<AutoInbound[]>([]);
    const [loadingActivation, setLoadingActivation] = useState(-1);
    const [emails, setEmails] = useState<any>(null);
    const navigate = useNavigate();
    const isValidated = useAppSelector((state: any) => state.user.isValidated);
    const userTokenFromSlice = useAppSelector((state: any) => state.user.token);
    const [verifyingUserSession, setVerifyingUserSession] = useState(true);
    const [user, setUser] = useState<any>(null);
    const sunriseImages = [ForestImg, ForestImg2, ForestImg3];
    const dayImages = [ForestImg4, ForestImg5, ForestImg6, ForestImg7];
    const sunsetImages = [ForestImg, ForestImg2, ForestImg3];
    const nightImages = [ForestImg8, ForestImg9, ForestImg10, ForestImg11]
    const sunriseLoadedImages = usePreloadImages(sunriseImages);
    const dayLoadedImages = usePreloadImages(dayImages);
    const sunsetLoadedImages = usePreloadImages(sunsetImages);
    const nightLoadedImages = usePreloadImages(nightImages);
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const [bgImage, setBgImage] = useState('');
    const [timeOfDay, setTimeOfDay] = useState(0);
    const [newEmailCount, setNewEmailCount] = useState(0);
    const [newsletters, setNewsletters] = useState<any>([]);


    async function setActivationAutoInbound(autoInboundId: string, setActiveTo: boolean, index: number) {
        if(loadingActivation!==-1) {return}
  
        setLoadingActivation(index);
  
        if (setActiveTo === true) {
          var validResp = {result: "", valid: false};
          if (autoInbounds[index].provider==="Outlook") {validResp = await dispatch(outlookActivateAutoInbound(userToken, autoInboundId));}
          if (autoInbounds[index].provider==="Google") {validResp = await dispatch(googleActivateAutoInbound(userToken, autoInboundId));}
          if (autoInbounds[index].provider==="Zoho") {validResp = await dispatch(outlookActivateAutoInbound(userToken, autoInboundId));}
          if (autoInbounds[index].provider==="GoogleAppPassword") {validResp = await dispatch(googleActivateAutoInbound(userToken, autoInboundId));}
  
          if (validResp.valid===true) {
            setAutoInbounds((prevItems) =>
              prevItems.map((item, i) => {
                if (i === index) {
                  return { ...item, isActive: true };
                }
                return item;
              })
            );
          } else {
            alert("Error activating your auto-inbound. Please try again soon.")
          }
        } else if (setActiveTo === false) {
          var validResp = {result: "", valid: false};
          if (autoInbounds[index].provider==="Outlook") {validResp = await dispatch(outlookDeactivateAutoInbound(userToken, autoInboundId));}
          if (autoInbounds[index].provider==="Google") {validResp = await dispatch(googleDeactivateAutoInbound(userToken, autoInboundId));}
          if (autoInbounds[index].provider==="Zoho") {validResp = await dispatch(outlookDeactivateAutoInbound(userToken, autoInboundId));}
  
          if (validResp.valid===true) {
            setAutoInbounds((prevItems) =>
            prevItems.map((item, i) => {
              if (i === index) {
                return { ...item, isActive: false };
              }
              return item;
            })
          );
          } else {
            alert("Error deactivating your auto-inbound. Please try again soon.")
          }
  
        }
  
        setLoadingActivation(-1);
  
      }

  
    const handleEdit = (inbound: any) => {
      setEditInbound(inbound);
      setEditSidebarOpen(true);
    };

    async function handleEditSent() {
      setEditSidebarOpen(false);
      setLoadingAutoInbounds(true);
      const resp4 = await dispatch(getUserAutoInbounds(userToken));
      if (resp4.valid===true) {
        setAutoInbounds(resp4.result);
      } else {
        console.log('error');
      }
      setLoadingAutoInbounds(false);
    }
  
    const [openedDropdownIndex, setOpenedDropdownIndex] = useState(-1);

    const handleDelete = async (id: string) => {

      console.log('deleting', id);
      setLoadingAutoInbounds(true);
      await dispatch(deleteAutoInbound(userToken, id));
      const resp2 = await dispatch(getUserAutoInbounds(userToken));
      if (resp2.valid===true) {
        setAutoInbounds(resp2.result);
      } else {
        console.log('error');
      }
      setLoadingAutoInbounds(false);

    };


    const formatDate = (timestamp: Date) => {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
      });
  };


    useEffect(() => {
      const handleClickOutside = (event: any) => {
        if (!event.target.closest('.dropdown-container') && !event.target.hasAttribute('data-ignore')) {
          setOpenedDropdownIndex(-1);
        }
      };
    
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      // Update the background image with a random image from the array
      if (bgImage==='') {
        // Get user's local time
        let userTime = moment().tz(moment.tz.guess());
    
        // Define periods of day
        let morningStart = moment().hours(5).minutes(0);
        let dayStart = moment().hours(12).minutes(0);
        let eveningStart = moment().hours(17).minutes(0);
        let nightStart = moment().hours(20).minutes(0);
    
        // Initialize images array
        let imageArray = [];
    
        // Select array based on time of day
        if (userTime.isAfter(morningStart) && userTime.isBefore(dayStart)) {
          imageArray = sunriseLoadedImages;
          setTimeOfDay(0);
        } else if (userTime.isAfter(dayStart) && userTime.isBefore(eveningStart)) {
          imageArray = dayLoadedImages;
          setTimeOfDay(1);
        } else if (userTime.isAfter(eveningStart) && userTime.isBefore(nightStart)) {
          imageArray = sunsetLoadedImages;
          setTimeOfDay(2);
        } else {
          imageArray = nightLoadedImages;
          setTimeOfDay(3);
        }
    
        // Choose random image from array
        const newImage = imageArray[Math.floor(Math.random() * imageArray.length)];
        if (newImage) {
          setBgImage(newImage);
        }
        // console.log('Setting background image:', newImage);
      }
    }, [sunriseLoadedImages, dayLoadedImages, sunsetLoadedImages, nightLoadedImages]);

    async function tryVerify() {

      if (verifyingUserSession===false) {return;} // just a blocker so we don't go through multiple times


      if (isValidated===true) { // if the user has been validated this session, then we're good.
        const resp3 = await dispatch(getUserAutoInbounds(userToken));
        if (resp3.valid===true) {
          setAutoInbounds(resp3.result);
        } else {
          console.log('error');
        }
        const resp4 = await dispatch(dashboardGetUserProcessedEmails(userToken));
        if (resp4.valid===true) {
          setEmails(resp4.result);
        } else {
          console.log('error');
        }
        setVerifyingUserSession(false);
        setLoadingAutoInbounds(false);
        return;
      }


      const resp2 = await dispatch(getUserAutoInbounds(userToken));
      if (resp2.valid===true) {
        setAutoInbounds(resp2.result);
        setVerifyingUserSession(false);
        setLoadingAutoInbounds(false);
      } else {
        console.log('error');
        setLoadingAutoInbounds(false);
        setVerifyingUserSession(false);
      }
      const resp4 = await dispatch(dashboardGetUserProcessedEmails(userToken));
      if (resp4.valid===true) {
        setEmails(resp4.result);
      } else {
        console.log('error');
      }
      const resp5 = await dispatch(getUser(userToken));
      if (resp5.valid===true) {
        setUser(resp5.result);
        setNewEmailCount(resp5.result.emailsSinceLastLogin);
        // console.log(resp5.result);
      } else {
        console.error('could not fetch user');
        return;
      }
      const resp9 = await dispatch(getUserSubscriptions(userToken));
      if (resp9.valid===true) {
        setUserSubscriptions(resp9.result);
        // console.log(resp9.result);
      } else {
        console.error('could not fetch user');
        return;
      }
      const resp10 = await dispatch(getDashNewsletters(userToken));
      if (resp10.valid===true) {
        setNewsletters(resp10.result);
      } else {
        return;
      }
    }


    
    useEffect(() => {

      if (userToken!=='') { // if the user isn't valid but they have a token in local storage, check it.
        tryVerify();
      } else {
        navigate("/login") // otherwise they are logged out, so boot them
      }

    }, [])

    const getPertinenceColor = (pertinence: string) => {

      //Irrelevant, Newsletter, Informative, Important, Urgent, Critical, Work, Personal, School

      if (pertinence==="Irrelevant") {
          return "bg-gray-200 text-black"

      } else if (pertinence==="Newsletter") {
          return "bg-gray-200 text-black"

      } else if (pertinence==="Informative") {
          return "bg-yem text-black"

      } else if (pertinence==="Personal") {
        return "bg-emerald-100 text-lg font-medium bg-opacity-50 shadow-emerald-200"

      } else if (pertinence==="Work") {
        return "bg-cyan-500 text-md bg-opacity-20 shadow-md shadow-cyan-100"

      } else if (pertinence==="School") {
        return "bg-cyan-500 text-md bg-opacity-20 shadow-md shadow-cyan-100"

      } else if (pertinence==="Important") {
          return "bg-yem text-md bg-opacity-90"

      } else if (pertinence==="Urgent") {
          return "bg-rem text-md"

      } else if (pertinence==="Critical") {
          return "bg-rem text-lg"

      } else {

          return "bg-gray-200 text-xs font-lighter"

      }

    }

    const parseSummary = (summary: any) => {
      const pattern = /(__[^__]*__)|([^__]+)/g;
      const segments = summary.match(pattern);
      if (!segments) {return summary;}
      return segments.map((segment: any, index: any) => {
        if (segment.startsWith('__') && segment.endsWith('__')) {
          return <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 font-bold">{segment.replace(/_/g, '')}</span>;
        }
        return <span key={index}>{segment} </span>;
      });
    };


    const sanitizedHTML = newsletters.length > 0 ? DOMPurify.sanitize(newsletters[0].body) : '';


    return (
      <div className="overflow-y-auto">
        <div className="relative flex justify-between z-0 bg-white items-center border hover:shadow-inner rounded-xl max-h-64 pt-8 p-8 w-full overflow-hidden">
          {bgImage && <div className="absolute hidden lg:block right-0 w-5/12 h-full" style={{background: `linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1)), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>}
          <div>
            <h1 className="text-3xl font-bold">{timeOfDay===0 ? 'Good morning' : timeOfDay===1 ? 'Good afternoon' : timeOfDay===2 ? 'Good evening' : 'Good evening'}
              {user && `, ${user.name}`}!</h1>
            <h3 className="text-lg text-gray-400 font-base">View your new mail and analytics </h3>
          </div>
        </div>


        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 w-full">

          <div className="p-10 max-h-[400px] col-span-3 lg:col-span-2 mt-6 border  overflow-y-auto rounded-xl hover:shadow-inner">

            <div className="md:flex flex-row justify-between my-auto "><h1 className="mb-2 md:mb-0 text-slate-600 font-bold text-xl truncate oveflow-y-scroll">Since you've been gone</h1>
              <div className="-mt-2">
              <IconButton><SpeedIcon fontSize="large" sx={{transform: newEmailCount > 5 ? "scaleX(-1)" : "none",color: newEmailCount > 5 ? "#FFB13F" : "#1a2e05"}} /></IconButton>
              <Link className="ml-3" to="/app?page=master-inbox">
                <button className="md:ml-auto border inline mb-4 -mt-1 shadow-lg border-gray-500 hover:bg-emerald-500 text-sm hover:shadow-xl hover:shadow-emerald-200 hover:text-white hover:border-emerald-500 transition duration-150 rounded  px-4 py-2 font-bold text-gray-600">
                  <span className="text-xl mr-1">{newEmailCount}</span> new
                </button>
              </Link>
              </div>
            </div>
            {loadingAutoInbounds ? <div className="justify-center items-center mx-auto">
              <div className={`px-6 py-2 cursor-pointer hover:shadow h-14 flex flex-row justify-between mb-3 rounded-xl items-center animate-pulse bg-gray-100 border'}`} />
              <div className={`px-6 py-2 cursor-pointer hover:shadow h-14 flex flex-row justify-between my-3 rounded-xl items-center animate-pulse bg-gray-100 border'}`} />
              <div className={`px-6 py-2 cursor-pointer hover:shadow h-14 flex flex-row justify-between mb-3 rounded-xl items-center animate-pulse bg-gray-100 border'}`} />

            </div> : 
            <div className="flex flex-row w-full space-x-4">
              <div className="w-3/4 border rounded-2xl p-4">
                  {emails && emails.map((email: any, index: any) => {
                      if (!email.summary) {return;}
                      const lines = email?.summary.split("- ").map((line: any, index: any) => index === 0 ? line : '- ' + line);
                      // console.log(lines);
                      return (
                          <div className="space-x-4 px-2">
                              <div className={`text-black font-medium mt-2 overflow-auto rounded-xl p-2 px-3 ${getPertinenceColor(email.pertinence)} bg-opacity-20`}>
                                  <div className="mb-1">{lines[1]}</div>
                              </div>
                          </div>
                      )
                  })}
              </div>
              <div className="flex flex-col w-1/4 border rounded-2xl py-6 px-2 space-y-2">
                <div className="rounded-2xl px-2 py-2 text-xs font-semibold bg-cyan-600 bg-opacity-70 text-white">
                  0 Work
                </div>
                <div className="rounded-2xl px-2 py-2 text-xs font-semibold bg-emerald-400 text-white">
                  0 Personal
                </div>
                <div className="rounded-2xl px-2 py-2 text-xs font-semibold bg-yellow-500 bg-opacity-80 text-white">
                  0 Informative
                </div>
                <div className="rounded-2xl px-2 py-2 text-xs font-semibold bg-gray-400 text-white">
                  0 Newsletter
                </div>
              </div>
            </div>
            }
            </div>
            <div className="grid sm:grid-cols-1 gap-4">
              <div className="p-10 mt-6 border h-92 max-h-[400px] overflow-y-auto rounded-xl hover:shadow-inner">
                <h1 className=" text-slate-600 mb-1 font-bold text-xl truncate overflow-y-hidden">Subscriptions</h1>
                <h3 className=" text-slate-300 font-semibold text-sm ">SpeedLead will detect and show your subscriptions </h3>
                <div className="mt-4 overflow-y-auto">
                  {userSubscriptions.length > 0 ?
                  userSubscriptions.map((sub: any, index: any)=> {
                    const cancelSubscription = async () => {
                      const unsubLink = await dispatch(unsubscribeUser(userToken, sub._id));
                      if (unsubLink.valid) {
                        // Open the unsubscribe link in a new window or tab
                        const newWindow = window.open(unsubLink.result, '_blank', 'height=600,width=800');
                        if (!newWindow) alert('Failed to open unsubscribe window');
                      } else {
                        // Show an alert message if the response is not valid
                        alert(unsubLink.result);
                      }
                    }
                    return (
                    <div className="my-2 py-2 px-3 rounded-2xl w-full bg-gray-100 font-semibold items-center flex justify-between">
                    <span>{sub.name}</span>
                    <div>
                      <button className="mr-2 text-sm p-1">ON</button>
                      <ButtonBase onClick={cancelSubscription} sx={{ borderRadius: '6px' }}><button className="ml-auto px-2 rounded-full">&times;</button></ButtonBase>
                    </div>
                  </div>
                  )
                  }) : <p className="text-gray-600 font-semibold mt-20 text-center">You don't have any subscriptions yet</p>}
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <div className="p-10 mt-6 border max-h-[2000px] overflow-y-auto rounded-xl hover:shadow-inner">
                <div className="mb-1 md:flex flex-row justify-between">
                  <h1 className=" text-slate-600 font-bold text-xl truncate max-h-80 oveflow-y-scroll">Newsletters</h1>
                  <Link to="/app?page=master-inbox">
                    <button className="md:ml-auto underline -mt-1 flex text-sm hover:text-emerald-500 hover:border-emerald-500 transition duration-150 rounded  py-2 font-bold text-slate-500">
                      View
                    </button>
                  </Link>
                </div>
                
                
                  <h3 className=" text-slate-300 font-semibold text-sm ">Keep up with your favourite newsletters </h3>
                  <div className="mt-4 h-52 rounded-xl p-4">
                  <p className="text-sm px-16 py-6" dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></p>
                  </div> 
                
              </div>
            </div>

        </div>

          {/* <div className="CHART-DIV border hover:shadow-inner rounded-xl h-64 pt-8 p-6 mt-10 w-full">
            {user && <DailyStatsChart dailyStats={user.dailyStats} />}
          </div> */}

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
    );
  };

export default Dashboard;