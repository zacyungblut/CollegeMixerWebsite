import React from "react";
import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import { verify } from '../actions/auth';
import { getUserAutoInbounds, outlookActivateAutoInbound, outlookDeactivateAutoInbound, googleActivateAutoInbound, googleDeactivateAutoInbound, deleteAutoInbound } from "../actions/autoInbound";
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import WelcomeImage from '../assets/WelcomeImage.svg';
import MailboxImage from '../assets/ConnectEmail.svg';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import WaveImage from '../assets/Wave.png';
import ShushImage from '../assets/Shush.png';
import WrenchImage from '../assets/Wrench.png';
import AnalyticsImg from '../assets/info.svg';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import TriagePage from "./TriagePage";
import AppNavBar from "./AppNavbar";
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import AddIcon from '@mui/icons-material/Add';
import ComingSoonImg from '../assets/Coming.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import ZohoLogo from "../assets/Zoho.png";
import GmailLogo2 from "../assets/GmailLogo.png";
import Settings from "./Settings";
import MasterInbox from "./MasterInbox";
import MasterInboxNewsletter from "./MasterInboxNewsletter";
import HelperPopup from "./HelperPopup";
import LoginSnackbar from "./LoginSnackbar";
import EditInbound from "./EditCampaign";
import Feed from "./Feed";
import Overview from "./Overview";
import { toast } from 'react-toastify';
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar"
import LayoutSidebar from "./TacticalSidebar"



const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const LMODE = { // (LAYOUT_MODES)
  DEFAULT: 'DEFAULT',
  COLLAPSED: 'COLLAPSED',
  GUIDE: 'GUIDE',
  TACTICAL: 'TACTICAL',
  FULL: 'FULL',
};

interface AutoInboundInterface {
  _id: string;
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




const AppPage = () => {
    const [activePage, setActivePage] = useState('feed');
    const [activeSubPage, setActiveSubPage] = useState('')
    const [open, setOpen] = useState(false)
    const query = useQuery();
    const pageId = query.get('page');
    const [isActionPlanOpen, setIsActionPlanOpen] = useState(false)
    const [isReportingOpen, setIsReportingOpen] = useState(false)
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [verifyingUserSession, setVerifyingUserSession] = useState(true);
    let urlSubPage = searchParams.get('subpage');
    const [autoInboundConfig, setAutoInboundConfig] = useState("Unconnected");
    const [autoInbounds, setAutoInbounds] = useState<AutoInboundInterface[]>([]);
    const dispatch = useAppDispatch();
    const [loadingActivation, setLoadingActivation] = useState(-1);
    const [loadingAutoInbounds, setLoadingAutoInbounds] = useState(true);
    const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
    const isValidated = useAppSelector((state: any) => state.user.isValidated);
    const userTokenFromSlice = useAppSelector((state: any) => state.user.token);
    const isFirstSessionLogin = useAppSelector((state: any) => state.user.isFirstSessionLogin);
    const [completedStep, setCompletedStep] = useState({1: false, 2: false, 3: false});
    const [classicMode, setClassicMode] = useState(false);
    const [layoutState, setLayoutState] = useState(LMODE.DEFAULT);



  
    async function tryVerify() {
      if (verifyingUserSession===false) {return;} // just a blocker so we don't go through multiple times

      // if (isValidated===true) {
      //   setAutoInboundConfig("Initialized");
      //   const resp3 = await dispatch(getUserAutoInbounds(userToken));
      //   if (resp3.valid===true) {
      //     if (resp3.result.length===0) {setAutoInboundConfig("Unconnected"); console.log('EMAIL NOT CONNECTED');}
      //     setAutoInbounds(resp3.result);
      //     setCompletedStep({...completedStep, 1: true, 2: true});
      //   } else {
      //     console.log('error');
      //   }
      //   setVerifyingUserSession(false);
      //   setLoadingAutoInbounds(false);
      //   return;
      // }


      const resp = await dispatch(verify(userToken));
      if (resp.valid===true) {
        if (resp.receivedResponse && resp.receivedResponse===true) {setCompletedStep({...completedStep, 1: true, 2: true, 3: true});}
        if (resp.result==="Email connected") {
          setAutoInboundConfig("Empty");
          setCompletedStep({...completedStep, 1: true});
        } else if (resp.result==="Auto Inbound Initialized") {
            setAutoInboundConfig("Initialized");
            const resp2 = await dispatch(getUserAutoInbounds(userToken));
            if (resp2.valid===true) {
              setAutoInbounds(resp2.result);
              setCompletedStep({...completedStep, 1: true, 2: true});
            } else {
              console.log('error');
            }
        }
        setVerifyingUserSession(false);
        setLoadingAutoInbounds(false);

        toast('Welcome to your dashboard!', {
          className: 'bg-green-500 text-white font-semibold p-3 rounded-lg',
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          toastId: 'welcomeMessage',
          }
        );

      } else {
        localStorage.removeItem('profile');
        navigate('/login');
      }
    }

    
    useEffect(() => {

      if (userToken!=='') { // if the user isn't valid but they have a token in local storage, check it.
        tryVerify();
      } else {
        navigate("/login") // otherwise they are logged out, so boot them
      }

      if (pageId && pageId!=='') {
        setActivePage(pageId);
      }
      
      document.title = 'ReallyMail - App';

      // if (isFirstSessionLogin) {
      
      //   toast('Welcome to SpeedLead!', {
      //     className: 'bg-green-500 text-white font-semibold p-3 rounded-lg',
      //     position: "top-center",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //     toastId: 'welcomeMessage',
      //     }
      //   )
      // }
      
    }, [])

    useEffect(() => {
      if (pageId && pageId!=='') {
        setActivePage(pageId);
      }
    }, [pageId])
    

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


    const EmailConfig = () => {
      return (
        <div>
          <div className="flex justify-between items-center">
            <div className="">
              <h2 className="text-gray-700 font-semibold text-3xl">Dashboard</h2>
              <p className="text-gray-500">
                Connect email account to get access to your dashboard
              </p>
            </div>
            <Link to="/app/connect"><button className="border border-gray-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition duration-300 rounded mx-4 px-4 py-2 font-bold text-gray-600">
              <InsertLinkOutlinedIcon className="-mt-0.5" /> Add Email
            </button></Link>
          </div>
          <div className="flex flex-col items-center mt-12">
            <img src={MailboxImage} alt="MailImage" className="w-[200px] h-auto mx-auto mb-16 mt-32" />
            <div className="flex items-center mb-4">
              <img src={WaveImage} alt="Wave" className="w-12 h-auto mr-4" />
              <p className="text-gray-800 text-xl font-bold">Add an email account to get started</p>
            </div>
            <Link to="/app/connect"><button className="bg-emerald-500 hover:bg-cyan-500 hover:shadow-md transition duration-150 text-white px-4 py-2 rounded">
              Add Email
            </button></Link>
          </div>
        </div>
      );
    };
      

    return(<>
        {verifyingUserSession!==true ?
        <><AppNavBar />
        {/* {activePage!=="master-inbox" && <HelperPopup completedStep={completedStep} />} */}
        <div className="bg-white overflow-y-hidden font-sans leading-normal tracking-normal max-w-screen max-h-feed-screen">
            <div className="flex h-full">
              <Sidebar activePage={activePage} setActivePage={setActivePage} classicMode={classicMode} setClassicMode={setClassicMode} layoutState={layoutState} setLayoutState={setLayoutState} />
              <div className={`overflow-y-auto w-full py-0 bg-gray-100 ${activePage==="master-inbox" ? 'hidden' : 'flex-1'}`}>
                {activePage === 'dashboard' && autoInboundConfig==="Unconnected" ? <EmailConfig /> : null}
                {activePage === 'dashboard' && autoInboundConfig==="Empty" ? <Dashboard /> : null}
                {activePage === 'dashboard' && autoInboundConfig==="Initialized" ? <Dashboard /> : null}
                {activePage === 'settings' ? <Settings /> : null}
                {activePage === 'feed' ? <Feed activePage={activePage} setActivePage={setActivePage} layoutState={layoutState} /> : null}
                {activePage === 'overview' ? <Overview classicMode={classicMode} /> : null}
              </div>
              {/* <div className={`flex-1 -ml-4 ${activePage==="master-inbox" ? '' : 'hidden'}`}>{activePage === 'master-inbox' ? <Feed activePage={activePage} setActivePage={setActivePage} layoutState={layoutState} /> : null}</div> */}
            </div>
        </div></> : <TriagePage />
        }
    </>)


}

export default AppPage;