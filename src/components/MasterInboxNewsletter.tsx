import React, { useState, useEffect, useReducer, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { getUserProcessedEmails } from '../actions/processedEmails';
import { getUserEmailAccounts, getUser } from '../actions/auth';
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import { InputBase, IconButton, Checkbox, Tabs, Tab, Box, ButtonBase } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import PrintIcon from '@mui/icons-material/Print';
import Avatar from '@mui/material/Avatar';
import ReplyIcon from '@mui/icons-material/Reply';
import AvatarPic from '../assets/DefaultAvatar.png';
import moment from 'moment-timezone';
import ComposePopup from './ComposePopup';
import DOMPurify from 'dompurify';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import IrrelevantImg from '../assets/Irrelevant.png';
import NewsletterImg from '../assets/Newsletter.png';
import InformativeImg from '../assets/Informative.png';
import WorkImg from '../assets/Work.png';
import PersonalImg from '../assets/Personal.png';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CropFreeIcon from '@mui/icons-material/CropFree';





interface ProcessedEmail {
  _id: string;
  ownerEmail: string;
  subject: string;
  body: string;
  googleId?: string;
  outlookId?: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  responseId?: string;
  isStarred: boolean;
  isOpened: boolean;
  summary: string;
  emojiSummary: string;
  timestamp: Date;
  pertinence: string;
  hasResponse: boolean;
  responseOptions: string[];
  defaultResponses: string[];
  isResponse: boolean;
  intent: string;
  emailAccountId: string;
  profilePic: string;
  autoInboundId: string;
  provider: string;
  id?: string;
  threadId?: string;
  parentEmailId?: string | null;
}



const MasterInbox = () => {

  const [processedEmails, setProcessedEmails] = useState<ProcessedEmail[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedInbox, setSelectedInbox] = useState("Inbox");
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
  const [user, setUser] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [verifyingUserSession, setVerifyingUserSession] = useState(true);
  const [tryAttempt, setTryAttempt] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState<ProcessedEmail | null>(null);
  const [initString, setInitString] = useState("");
  const [emailAccounts, setEmailAccounts] = useState<any>([]);
  const [loadingEmailAccounts, setLoadingEmailAccounts] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [isReply, setIsReply] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [emailAccountSentToName, setEmailAccountSentToName] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [floatMode, setFloatMode] = useState(true);
  const [floatFilter, setFloatFilter] = useState("Recent");
  const [isFocusMode, setIsFocusMode] = useState(false);


  
  async function tryVerify() {
      const resp = await dispatch(getUserProcessedEmails(userToken));
      console.log('response is', resp.result);
      setProcessedEmails(resp.result);
      if (resp.valid===true) {
        setVerifyingUserSession(false);
      } else {
          setTryAttempt(tryAttempt+1);
          if (tryAttempt > 0) {
              localStorage.removeItem('profile');
              navigate('/login');
          }
      }

      const emailAccountsData = await dispatch(getUserEmailAccounts(userToken));

      if (emailAccountsData.valid===true) {
        setEmailAccounts(emailAccountsData.result);
        setLoadingEmailAccounts(false);
      } 

      const resp5 = await dispatch(getUser(userToken));
      if (resp5.valid===true) {
        setUser(resp5.result);
        console.log(resp5.result);
      } else {
        console.error('could not fetch user');
        return;
      }

    }

    useEffect(() => {
      tryVerify();
    }, [])


    const formatTimestamp = (timestamp: Date, userTimeZone: string) => {
      const now = moment();
      const yesterday = moment().subtract(1, 'days');
      const inputTime = moment(timestamp).tz(userTimeZone);
      
      const is24HourFormat = userTimeZone === 'Europe/Paris' // Add other timezones that use 24 hour format

      if (inputTime.isSame(yesterday, 'day')) {
        // If the timestamp is from 'yesterday', show it as 'MMM D'
        return inputTime.format('MMM D');
      } else if (inputTime.isSame(now, 'day')) {
        // If time is within today, show it in 'h:mm A' format if in a AM/PM timezone, else 'HH:mm'
        return inputTime.format(is24HourFormat ? 'HH:mm' : 'h:mm A');
      } else {
        // If time is older than yesterday, show it in 'MMM D' format
        return inputTime.format('MMM D');
      }
    };

  const parseSummary = (summary: any) => {
    if (!summary) return "";
    const pattern = /(__[^__]*__)|([^__]+)/g;
    const segments = summary.match(pattern);
    if (!segments) {return summary;}
    return segments.map((segment: any, index: any) => {
      if (segment.startsWith('__') && segment.endsWith('__')) {
        return <span key={index} className="text-black bg-clip-text bg-gradient-to-r font-bold">{segment.replace(/_/g, '')}</span>;
      }
      return <span key={index}>{segment} </span>;
    });
  };


  const MailSidebar = () => {



    const getPertinenceColor = (pertinence: string) => {

      //Irrelevant, Newsletter, Informative, Important, Urgent, Critical, Work, Personal, School

      if (pertinence==="Irrelevant") {
          return "bg-gray-200 text-black"

      } else if (pertinence==="Newsletter") {
          return "bg-gray-200 text-black text-xs"

      } else if (pertinence==="Informative") {
          return "bg-emerald-200 text-xs text-black"

      } else if (pertinence==="Personal") {
        return "bg-emerald-100 text-lg font-bold bg-opacity-50 shadow-sm shadow-emerald-100"

      } else if (pertinence==="Work") {
        return "bg-blem text-md bg-opacity-20 shadow-md shadow-blue-200"

      } else if (pertinence==="School") {
        return "bg-blem text-md bg-opacity-20 shadow-md shadow-blue-200"

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

    return (
      <div className="flex flex-col bg-gray-100 w-1/3 py-2 text-gray-600">

          <div className="w-full mb-1 font-medium ml-2 text-xs text-gray-400">Today</div>

          <div className="bg-white w-full rounded-md">
            {processedEmails.slice(0, 8).map((email, index) => {
              const summary = email?.summary || '';
              const lines = summary.split("- ").map((line, index) => index === 0 ? line : '- ' + line);
              return (
                <div className="cursor-pointer mb-1 mt-1 w-full h-[100px] flex flex-row" onClick={()=>{setSelectedEmail(processedEmails[index])}}>
                  <div className={`w-[3px] rounded-r-xl h-full ${getPertinenceColor(email.pertinence)}`}></div>
                  <div className={`flex flex-col h-full items-start w-full max-w-[400px] transition duration-75 ml-1 mr-1 p-2 rounded-md ${selectedEmail===email ? 'bg-blue-600 text-white shadow font-semibold' : `bg-blue-50 hover:bg-blue-100 ` }`} onClick={()=>setSelectedInbox("Inbox")}>
                    <div className="flex w-full items-center">
                      <img src={AvatarPic} alt="MailImage" className="w-5 h-auto mr-2" />
                      <div className="font-semibold w-40 truncate text-sm mr-auto">{email.fromEmail}</div>
                      <span className={`text-xs  w-22 truncate font-light ml-auto ${selectedEmail===email ? 'text-white' : 'text-gray-400'}`}>{email.emojiSummary} {formatTimestamp(email.timestamp, timeZone)}</span>
                    </div>
                    <div className="w-full mt-1 pr-2">
                      <div className="text-xs truncate font-light ml-7">{email.subject}</div>
                    </div>
                    <div>
                    <div className={`rounded-xl w-80  mt-2 text-xs text-center px-4 p-2 bg-gray-50 shadow-gray-700 font-semibold mx-2`}>
                      <div className="text-left text-gray-700 truncate my-auto">{parseSummary(lines[1])}</div>
                    </div>
                    </div>
                  </div>
                </div>
            )})}
        </div>

        <div className="w-full mt-5 font-semibold ml-2 text-xs text-gray-400">Yesterday</div>



        
      </div>
    );
  };


  const EmailDetail = () => { 

    const email = selectedEmail;

    const timestamp = moment(email?.timestamp).format('MMM D, YYYY, h:mm A') || '';
    const fromNow = moment(email?.timestamp).fromNow() || '';
    const [isStarred, setIsStarred] = useState(false);
    // const sanitizedHTML = DOMPurify.sanitize(email.body) || '';
    
    if (email!==null) return (

      <div className="MainContentContainer w-full flex flex-col overflow-auto">
        <div className="rounded-xl w-full h-full my-1">
            <div className="p-4">
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="mx-4 mt-4 w-[700px] break-words text-2xl mb-8 font-base text-black">{email.subject}</h2>
                  <IconButton className="mx-2">
                    <PrintIcon fontSize="small" />
                  </IconButton>
                </div>
                {/* email detail bubble */}
                <div className="bg-white p-2.5 py-8 rounded-lg shadow w-full oveflow-auto">  
                  <div className="flex ml-2">
                    <Avatar alt={email.fromEmail} src={email.profilePic || AvatarPic} />
                    <div className="flex ml-4 -mt-4 items-center">
                      <h2 className="mr-1 text-md font-medium">{email.fromName}</h2>
                      <h4 className="text-xs text-gray-600">{"<"}{email.fromEmail}{">"}</h4>
                    </div>
                    <div className="flex ml-auto items-center space-x-2">
                      <h4 className="text-xs text-gray-600">{`${timestamp} (${fromNow})`}</h4>
                      <IconButton className="mx-2">
                        {isStarred ? <StarIcon fontSize="small" color="primary" /> : <StarBorderIcon fontSize="small" />}
                      </IconButton>
                      <IconButton className="mx-2">
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                      <IconButton className="mx-2">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                  <p className="text-sm px-16 py-6 truncate max-w-[800px]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.body) }}></p>
                </div>
            </div>
          </div>
        </div>      
      </div>

    ); else return (
      <div className="MainContentContainer w-full flex flex-col">
        <div className="rounded-xl w-full h-full my-1">
          <div className="rounded-xl h-full flex my-64 justify-center">
            <FontAwesomeIcon size="5x" icon={faInbox} style={{ color: "#d1d5db" }} />
          </div>
        </div>
      </div>
    );
  };

  const initialState = { 
    selectedCard: null,
    processedEmails: processedEmails,
    originalEmails: processedEmails 
  };
  
  function reducer(state: any, action: any) {
    switch (action.type) {
      case 'SELECT_CARD':
      if (state.selectedCard === action.index) {
        return {...state, selectedCard: null};  // If the selected card is clicked again, unselect it
      } else {
          return {...state, selectedCard: action.index}; // select the card
      }      
      case 'SWAP_CARDS':
        const newEmails = [...state.processedEmails];
        [newEmails[action.index - 1], newEmails[action.index]] = [newEmails[action.index], newEmails[action.index - 1]];
        return {...state, processedEmails: newEmails, selectedCard: action.index-1};
      case 'RESET_EMAILS':
        return {...state, processedEmails: state.originalEmails, selectedCard: null};
      default:
        throw new Error();
    }
  }


  const activateFocus = (startEmail: any) => {
    setIsFocusMode(true);
  }

  const FloatScreen = () => {
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [originalEmails, setOriginalEmails] = useState<any[]>(processedEmails);
    const [state, dispatch] = useReducer(reducer, initialState);

    const getPertinenceColor = (pertinence: number) => {

      //Now a score from 0 through 10

      if (pertinence===1) {
        return "bg-gray-50 text-xs font-lighter"
      } else if (pertinence===2) {
        return "bg-zinc-50 text-xs font-lighter"

      } else if (pertinence===3) {
        return "bg-slate-100 text-xs font-lighter"
      } else if (pertinence===4) {
        return "bg-slate-200 text-xs font-lighter"
      } else if (pertinence===5) {
          return "bg-slate-300 text-xs font-lighter"
      } else if (pertinence===6) {
        return "bg-slate-400 text-white bg-opacity-80 text-xs font-lighter"
      } else if (pertinence===7) {
        return "bg-slate-500 text-white text-xs font-lighter"
      } else if (pertinence===8) {
        return "bg-slate-600 text-white text-xs font-lighter"

      } else if (pertinence===9) {
        return "bg-teal-700 text-white text-xs font-lighter"

      } else if (pertinence===10) {
        return "bg-emerald-700 text-white text-xs font-lighter"

      }

      return "bg-gray-50 text-xs font-lighter bg-opacity-"

    }

    const getPertinenceIcon = (pertinence: string) => {

      //Irrelevant, Newsletter, Informative, Important, Urgent, Critical, Work, Personal, School

      if (pertinence==="Irrelevant") {
          return IrrelevantImg

      } else if (pertinence==="Newsletter") {
          return NewsletterImg

      } else if (pertinence==="Informative") {
          return InformativeImg

      } else if (pertinence==="Personal") {
        return PersonalImg

      } else if (pertinence==="Work") {
        return NewsletterImg

      } else {
          return NewsletterImg
      }

    }
    
    return (
      <div className="bg-gray-100 w-full min-h-screen h-full p-6 text-gray-600">
        <LayoutGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.processedEmails.slice(0,8).map((email: any, index: any) => {
              const isSelected = state.selectedCard === index;
              const lines = email.summary.split("- ").map((line: any, index: any) => index === 0 ? line : '- ' + line);
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!isSelected && index % 4 === 3) {
                      dispatch({type: 'SWAP_CARDS', index});
                    } else if (!isSelected && index % 4 !==3) {
                      dispatch({type: 'SELECT_CARD', index});
                    } else {
                      dispatch({type: 'RESET_EMAILS', index});
                    }
                  }}
                  className={`shadow-lg flex flex-col justify-between mb-4 rounded-lg p-5 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'col-span-2 row-span-2 shadow-lg h-[400px]' : 'hover:scale-[0.99] h-[200px]'
                  } ${!isSelected && state.selectedCard!==null ? `${getPertinenceColor(email.pertinence)} ` : `${getPertinenceColor(email.pertinence)}`}`}
                >
                  <div>
                    <div className="flex flex-row w-full">
                      <p className={`flex mr-0.5 tracking-widest ${isSelected ? 'w-[44px]' : 'w-[44px]'}`}>{email.emojiSummary}</p>
                      <div className="truncate w-full font-semibold text-sm mr-auto">{email.fromEmail}</div>
                      {isSelected && <div onClick={(event)=> {event.stopPropagation(); activateFocus(state.selectedCard);}} className={`ml-auto p-1 hover:bg-gray-500 hover:bg-opacity-30 rounded-full transition duration-200`}><FullscreenExitIcon  /></div>}
                    </div>
                    <h2 className="text-xs mb-2 truncate">
                      {email.subject}
                    </h2>
                  </div>
                  {}
                  <div>
                    {/* <div className={`rounded-xl mb-0 justify-start gap-2 mx-0 flex h-fit max-h-[100px] overflow-clip mt-2 text-xs text-center px-4 p-2 ${isSelected ? '' : 'hidden'} font-semibold mx-0`} style={{ maxWidth: '100%' }}>
                      <div className="rounded-xl text-base border border-black px-3 py-2 bg-gray-500 hover:bg-opacity-30 bg-opacity-10">Respond</div>
                      <div className="rounded-xl text-base border border-black px-3 py-2 bg-gray-500 hover:bg-opacity-30 bg-opacity-10">Respond</div>
                      <div className="rounded-xl text-base border border-black px-3 py-2 bg-gray-500 hover:bg-opacity-30 bg-opacity-10">Respond</div>
                    </div> */}
                    <div className={`rounded-xl mb-0 h-fit max-h-[100px] overflow-clip mt-2 text-xs text-center px-4 p-2 bg-gray-50 shadow-gray-200 ${isSelected ? 'h-16 shadow font-bold' : ''} font-semibold mx-0`} style={{ maxWidth: '100%' }}>
                      <div className="text-left text-black text-sm overflow-hidden break-words my-auto">{parseSummary(lines[1])}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {state.processedEmails.slice(9,25).map((email: any, index: any) => {
              const fixedIndex = index+8;
              const isSelected = state.selectedCard === index+8;
              const lines = email.summary.split("- ").map((line: any, index: any) => index === 0 ? line : '- ' + line);
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!isSelected && index % 4 === 3) {
                      dispatch({type: 'SWAP_CARDS', fixedIndex});
                    } else if (!isSelected && index % 4 !==3) {
                      dispatch({type: 'SELECT_CARD', fixedIndex});
                    } else {
                      dispatch({type: 'RESET_EMAILS', fixedIndex});
                    }
                  }}
                  className={`shadow-lg flex flex-col justify-between mb-4 rounded-lg p-5 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'col-span-2 row-span-2 shadow-lg h-[200px]' : 'hover:scale-[0.99] h-[100px]'
                  } ${!isSelected && state.selectedCard!==null ? `${getPertinenceColor(email.pertinence)} shadow-xl` : `${getPertinenceColor(email.pertinence)}`}`}
                >
                  <div>
                    <div className="flex flex-row w-full">
                      {/* <img src={getPertinenceIcon(email.pertinence)} className="h-5 w-5 mr-2" /> */}
                      <div className="truncate font-semibold text-sm">{email.fromEmail}</div>
                      <span className="text-xs text-gray-400 w-32 truncate font-light ml-auto">{formatTimestamp(email.timestamp, timeZone)}</span>
                    </div>
                    {/* <h2 className="text-xs mt-1 mb-2">
                      {email.subject}
                    </h2> */}
                  </div>
                  {}
                  <div className={`rounded-xl mb-4 h-8 mt-2 text-xs text-center px-4 p-2 bg-gray-50 shadow-gray-200 ${isSelected ? 'h-16 shadow font-bold' : ''} font-semibold mx-0`} style={{ maxWidth: '100%' }}>
                    <div className="text-left text-md overflow-hidden truncate my-auto">{parseSummary(lines[1])}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    );
  };

  const FocusScreen = () => {


    //power box
    const [isRActive, setIsRActive] = useState(false);
    const [respondMenuState, setRespondMenuState] = useState<any>({isActive: false, options: [], activeSub: -1}); 
    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedSubOption, setSelectedSubOption] = useState(0);

    // email flow management
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showCurrentEmail, setShowCurrentEmail] = useState(true);
    const [emailIndex, setEmailIndex] = useState(0);
    const [email, setEmail] = useState(processedEmails[0]);
    const [nextEmail, setNextEmail] = useState(processedEmails[1]);
    const presenterRef = useRef<HTMLDivElement>(null);

    // progress bar
    const progress = emailIndex+1;
    const numEmails = processedEmails.length;


    useEffect(() => {
      const handleKeyDown = (event: any) => {
        if (event.key === 'r' || event.key === 'R') {
          setIsRActive(true);  // Make the R button "active" (cosmetic not utility)
        }
        if (event.key === 'ArrowDown') {
          if (respondMenuState.activeSub === -1) {
            if (selectedOption+1 < respondMenuState.options.length) setSelectedOption(selectedOption+1);
          } else {
            if (selectedSubOption+1 < respondMenuState.options[selectedOption].subOptions.length) setSelectedSubOption(selectedSubOption+1);

          }
        }
        if (event.key === 'ArrowUp') {
          if (respondMenuState.activeSub === -1) {
            if (selectedOption > 0) setSelectedOption(selectedOption-1);
          } else {
            if (selectedSubOption > 0) setSelectedSubOption(selectedSubOption-1);
          }
        }
        if (event.key === 'ArrowRight') {
          openSubRespondMenu();
        }
        if (event.key === 'ArrowLeft') {
          if (respondMenuState.activeSub !== -1) {
            closeSubRespondMenu();
          } else {
            openRespondMenu();
          }
        }
      };
  
      const handleKeyUp = (event: any) => {
        if (event.key === 'r' || event.key === 'R') {
          // setIsRActive(false);  // Make the R button "inactive" when key is released
          openRespondMenu();
        }
      };
  
      // Add event listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      // Clean up the event listeners on unmount
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };

    }, [emailIndex, email, nextEmail, respondMenuState.isActive, respondMenuState.activeSub, selectedOption, selectedSubOption]);
    

    function goToNextEmail() {
      setEmailIndex(emailIndex+1);
      setIsTransitioning(true);

      setTimeout(()=> {
        setShowCurrentEmail(false);
        setEmail(nextEmail);
        setNextEmail(processedEmails[emailIndex]);
        setIsTransitioning(false);
        setShowCurrentEmail(true);
      }, 200)
    }

    function openRespondMenu() {
      if (respondMenuState.isActive===true) {
        setRespondMenuState({isActive: false, options: [], activeSub: -1})
        setIsRActive(false)
        return;
        console.log('yo')
      }

      setRespondMenuState({isActive: true, options: [ 

        {name: "Sounds good Mark.", subOptions: ["", "", ""]}, 
        {name: "I won't be able to make it.", subOptions: ["", "", ""]}, 
        {name: "How about Wednesday at 11:30?", 
          subOptions: [
            {val: "Hey Mark, unfornately Thursday doesn't work for me. Don't want to be a bother, but is there any way we could do Wednesday at 11:30 instead?"},
            {val: "I'm a bit tied up Thursday afternoon - any shot we can do Wednesday at 11:30?"},
            {val: "Can we do Wednesday at 11:30 instead?"}
          ]},
        {name: "Can we include Jack on the call?", subOptions: ["", "", ""]},
        {name: "Lunch instead?", subOptions: ["", "", ""]},

      ], activeSub: -1,
      });
    }

    function openSubRespondMenu() {

      setRespondMenuState({isActive: true, options: [ 

        {name: "Sounds good Mark.", subOptions: ["", "", ""]}, 
        {name: "I won't be able to make it.", subOptions: ["", "", ""]}, 
        {name: "How about Wednesday at 11:30?", 
          subOptions: [
            {val: "Hey Mark, unfornately Thursday doesn't work for me. Don't want to be a bother, but is there any way we could do Wednesday at 11:30 instead?"},
            {val: "I'm a bit tied up Thursday afternoon - any shot we can do Wednesday at 11:30?"},
            {val: "Can we do Wednesday at 11:30 instead?"}
          ]},
        {name: "Can we include Jack on the call?", subOptions: ["", "", ""]},
        {name: "Lunch instead?", subOptions: ["", "", ""]},

      ], activeSub: selectedOption,
      });
    }

    function closeSubRespondMenu() {

      setRespondMenuState({isActive: true, options: [ 

        {name: "Sounds good Mark.", subOptions: ["", "", ""]}, 
        {name: "I won't be able to make it.", subOptions: ["", "", ""]}, 
        {name: "How about Wednesday at 11:30?", 
          subOptions: [
            {val: "Hey Mark, unfornately Thursday doesn't work for me. Don't want to be a bother, but is there any way we could do Wednesday at 11:30 instead?"},
            {val: "I'm a bit tied up Thursday afternoon - any shot we can do Wednesday at 11:30?"},
            {val: "Can we do Wednesday at 11:30 instead?"}
          ]},
        {name: "Can we include Jack on the call?", subOptions: ["", "", ""]},
        {name: "Lunch instead?", subOptions: ["", "", ""]},

      ], activeSub: -1,
      });
    }
    


    return (
      <div className="bg-gray-100 h-screen-126 overflow-hidden w-full mx-4 p-6 text-gray-600">
          
        <div className="flex h-[40px] justify-center items-center -mt-4 mb-4 w-full">

          <div className="flex w-32 items-center"><span className="text-xl font-semibold mr-1.5">{processedEmails.length - emailIndex+1}</span> emails left</div>
          <div className="text-xl ml-2 font-semibold mr-8"></div>
            <div className="h-2 w-full mx-0 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-150" 
                  style={{
                    width: `${progress * 100 / numEmails}%`,
                    backgroundColor: `rgb(0, ${progress * 255 / numEmails}, ${progress * 255 / numEmails})`
                  }}
              ></div>
          </div>

        </div>

        <div className="flex gap-8">

          {/* <div className="relative flex w-1/4">
            
            <div className={`bg-transparent border w-64 flex flex-col mb-4 rounded-2xl p-6 transition-all duration-200 col-span-2 row-span-2 h-[460px]`}>
                <div className="text-lg font-semibold">Power Box</div>

                <div className="BUTTONS flex flex-col gap-2 mt-5">

                    <div onClick={()=> {openRespondMenu(); setIsRActive(!isRActive);}} className={`flex flex-row RESPOND-BUTTON cursor-pointer ${isRActive && 'bg-gray-200'} hover:bg-gray-200 transition duration-100 group border rounded-lg p-2`}>
                      <div><button className={`text-white ${isRActive ? 'translate-y-[2.5px]' : 'group-hover:translate-y-[1px]'}  group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-red-600 from-40% via-orange-500 via-80% to-orange-300`}>R</button>
                      <div className="bg-red-800 rounded-xl -mt-[9px] w-[27px] pb-[9px] pt-[5px] px-2"></div></div>
                      <div className="flex flex-col ml-3">
                        <div className="text-gray-500 font-medium -mt-0.5 text-sm">Respond</div>
                        <div className="text-gray-400 text-xs">Craft a perfect response</div>
                      </div>
                    </div>

                    <div className="flex flex-row SAVE-BUTTON cursor-pointer hover:bg-gray-200 transition duration-100 group border rounded-lg p-2">
                      <div><button className="text-white group-hover:translate-y-[1px] group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-amber-500 from-40% via-yellow-500 via-80% to-yellow-300">S</button>
                      <div className="bg-yellow-800 rounded-xl -mt-[9px] w-[26.5px] pb-[9px] pt-[5px] px-2"></div></div>
                      <div className="flex flex-col ml-3">
                        <div className="text-gray-500 font-medium -mt-0.5 text-sm">Save</div>
                        <div className="text-gray-400  text-xs">Save email for later</div>
                      </div>
                    </div>

                    <div className="flex flex-row SAVE-BUTTON cursor-pointer hover:bg-gray-200 transition duration-100 group border rounded-lg p-2">
                      <div><button className="text-white group-hover:translate-y-[1px] group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-blue-600 from-40% via-sky-500 via-80% to-teal-300">C</button>
                      <div className="bg-blue-900 rounded-xl -mt-[9px] w-[27.5px] pb-[9px] pt-[5px] px-2"></div></div>
                      <div className="flex flex-col ml-3">
                        <div className="text-gray-500 font-medium -mt-0.5 text-sm">Calendar</div>
                        <div className="text-gray-400  text-xs">Create new event</div>
                      </div>
                    </div>

                    <div className="flex flex-row SAVE-BUTTON cursor-pointer hover:bg-gray-200 transition duration-100 group border rounded-lg p-2">
                      <div><button className="text-white group-hover:translate-y-[1px] group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-violet-700 from-40% via-purple-600 via-80% to-fuchsia-400">D</button>
                      <div className="bg-violet-900 rounded-xl -mt-[9px] w-[27.5px] pb-[9px] pt-[5px] px-2"></div></div>
                      <div className="flex flex-col ml-3">
                        <div className="text-gray-500 font-medium -mt-0.5 text-sm">Delete</div>
                        <div className="text-gray-400  text-xs">Keep 'em comin</div>
                      </div>
                    </div>

                    <div className="flex flex-row SAVE-BUTTON cursor-pointer hover:bg-gray-200 transition duration-100 group border rounded-lg p-2">
                      <div><button className="text-white group-hover:translate-y-[1px] group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-green-500 from-40% via-lime-500 via-80% to-green-300">SPACE</button>
                      <div className="bg-green-700 rounded-xl -mt-[9px] w-[68px] pb-[9px] pt-[5px] px-2"></div></div>
                      <div className="flex flex-col ml-3">
                        <div className="text-gray-500 font-medium -mt-0.5 text-sm">Compose</div>
                        <div className="text-gray-400 truncate text-xs">Write a new email</div>
                      </div>
                    </div>


                </div>
            </div>

            <div className="relative MENUS-CONTAINER">
              {respondMenuState.isActive &&
              <div className="absolute z-40 flex flex-col top-[74px] justify-start text-left -ml-6 left-full h-fit w-80 rounded-lg  bg-gray-600  text-white items-center">
                {respondMenuState.options.map((option: any, index: any)=> {
                  return (
                    <>
                      <div onClick={()=> {setSelectedOption(index); openSubRespondMenu();}} className={`font-medium hover:bg-gray-700 cursor-pointer text-gray-100 w-full p-3 border-gray-20 flex flex-row justify-between items-center ${index===0 && 'rounded-t-lg'} ${index+1===respondMenuState.options.length && 'rounded-b-lg'} ${selectedOption===index && ' bg-gray-700 animate-pulse'}`}>
                        <span>{option.name}</span><div><ChevronRightIcon /></div>
                      </div>
                    </>
                  )
                  })

                }
              </div>
              }

              {respondMenuState.activeSub !== -1 &&
              <div className="absolute z-40 flex flex-col top-[74px] justify-start text-left -ml-6 left-80 h-fit w-[400px] rounded-lg  bg-gray-600  text-white items-center">
                {respondMenuState.options[selectedOption].subOptions.map((option: any, index: any)=> {
                  return (
                    <>
                      <div onClick={()=> {}} className={`font-medium hover:bg-gray-700 cursor-pointer text-gray-100 w-full p-3 border-gray-20 flex flex-row justify-between items-center ${index===0 && 'rounded-t-lg'} ${index+1===respondMenuState.options[selectedOption].subOptions.length && 'rounded-b-lg'} ${selectedSubOption===index && ' bg-gray-700'}`}>
                        <span>{option.val}</span><div></div>
                      </div>
                    </>
                  )
                  })

                }
              </div>
              }
            </div>


          </div> */}

          <div className="flex flex-col max-w-[1400px] justify-content w-full h-screen-182 relative PRESENTER" ref={presenterRef}>


              {showCurrentEmail && <div className={`bg-white w-full overflow-auto flex flex-col justify-between mb-4 rounded-2xl px-8 py-5 transition-all duration-200 col-span-2 row-span-2 shadow-lg h-fit max-h-[500px] ${isTransitioning ? 'opacity-0' : ''}`}>
                <div>
                  <div className="flex flex-row w-full">
                    <p className={`flex mr-0.5 tracking-widest w-[48px]`}>{email.emojiSummary}</p>
                    <div className="truncate w-full font-semibold text-sm mr-auto">{email.fromEmail}</div>
                  </div>
                  <h2 className="text-xs mt-1 mb-2 truncate">
                    {email.subject}
                  </h2>
                  <p className="text-sm py-6 max-w-[900px] overflow-x-auto overflow-y-auto" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.body) }}></p>
                </div>
              </div>
              }

              {nextEmail && 
                <div onClick={goToNextEmail} className={`${isTransitioning ? 'bg-white opacity-100 h-[400px]' : 'h-[400px] mt-auto -mb-96 hover:opacity-70 hover:-translate-y-1 bg-gray-900 opacity-50'} w-full overflow-auto flex flex-col justify-between rounded-2xl px-8 py-5 cursor-pointer transition-all duration-200 col-span-2 row-span-2 shadow-lg`}>
                  <div>
                    <div className="flex flex-row w-full">
                      <p className={`flex  mr-0.5 tracking-widest w-[48px]`}>{nextEmail.emojiSummary}</p>
                      <div className="truncate w-full font-semibold text-sm mr-auto">{nextEmail.fromEmail}</div>
                    </div>
                    <h2 className="text-xs mt-1 mb-2 truncate">
                      {nextEmail.subject}
                    </h2>
                    {isTransitioning && <p className="text-sm px-16 py-6 truncate max-w-full overflow-x-auto overflow-y-auto" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(nextEmail.body) }}></p>}
                  </div>
                </div>
              }

          </div>
        </div>

      </div>
    )
  }

  return (
    <div className="bg-gray-100 ml-2 h-screen-4rem">
      {/* <div className="bg-white p-2 w-full flex z-50 border-b border-l">
        <div className="w-80 rounded-lg overflow-hidden flex items-center py-0.5 bg-gray-100 focus:bg-white">
          <IconButton>
              <SearchIcon />
          </IconButton>
          <InputBase placeholder="Search mail" className="px-4 w-full" />
        </div>
        
        <div onClick={()=>{setFloatMode(!floatMode)}} className="h-full my-auto rounded-2xl"><Toggle /></div>
        

      </div> */}
      <div className="w-full h-full bg-gray-100 flex">
        {!floatMode ? 
        <>
          <MailSidebar />
          <EmailDetail />
        </> : !isFocusMode ?
        <>
          {/* <FloatSidebar /> */}
          <FloatScreen />
        </> : 
        <>
          <FocusScreen />
        </>
        }
      </div>
      {composeOpen && <ComposePopup onClose={()=>setComposeOpen(false)} initString={initString} user={user} isReply={isReply} emailAccountSentTo={emailAccountSentToName} replyTo={replyTo} replySubject={replySubject} />}
    </div>
  );
};

export default MasterInbox;