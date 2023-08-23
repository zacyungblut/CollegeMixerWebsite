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
import { faInbox, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@mui/material';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';



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

type OverviewProps = {
    classicMode: boolean;
  };


const Overview = ({classicMode}: OverviewProps) => {

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
  const [floatFilter, setFloatFilter] = useState("Recent");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [noEmailConnected, setNoEmailConnected] = useState(false);



  
  async function tryVerify() {
      const resp = await dispatch(getUserProcessedEmails(userToken));
      console.log('response is', resp.result);
      if (resp.valid===true) {
        setProcessedEmails(resp.result);
        setVerifyingUserSession(false);
      } else {
        if (resp.result==="No email account connected") {
            setNoEmailConnected(true);
          } else {
            setTryAttempt(tryAttempt+1);
            if (tryAttempt > 0) {
                localStorage.removeItem('profile');
                navigate('/login');
            }
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

      setIsLoading(false);

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
                        <div className="w-[320px] mt-1 pr-2">
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



  

    const initialState = { 
        selectedCard: null,
        processedEmails: processedEmails || [],
        originalEmails: processedEmails || [], 
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

        return "bg-slate-100 text-xs font-lighter bg-opacity-"

        }

        
        return (
        <div className="bg-gray-100 w-full min-h-screen h-full p-6 text-gray-600">
            {isLoading ? 
            <div className="flex items-center h-80 justify-center mt-20 mx-auto">
                <CircularProgress size={58} style={{ 'color': '#d1d5db' }} />
            </div>
            : processedEmails.length===0 ? 
            <div className="flex flex-col relative h-80 gap-10 items-center justify-center mt-20 mx-auto">
                <FontAwesomeIcon size="10x" icon={faInbox} style={{ color: "#d1d5db" }} />

                <h1 className="text-3xl absolute bottom-0 text-gray-400 font-semibold mb-2">You've got no new emails</h1>
                {/* <Link to="/app/connect" className="flex shadow hover:shadow-lg mb-10 group hover:bg-gray-200 transition duration-200 cursor-pointer items-center mx-80 justify-center text-center px-8 py-4 text-2xl font-semibold border rounded-lg"><h1>Connect</h1><FontAwesomeIcon className="ml-2 -mb-[2px] transition duration-200 group-hover:translate-x-1" scale="1px" icon={faLink} style={{ color: "#808080", fontSize: "20px" }} /></Link> */}
            </div>
            : 
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
                        <p className={`flex mr-0.5 tracking-widest ${isSelected ? 'w-[44px]' : 'w-[44px]'} ${email.emojiSummary ? '' : 'hidden'}`}>{email.emojiSummary}</p>
                        <div className="truncate w-full font-semibold text-sm mr-auto">{email.fromEmail}</div>
                        {isSelected && <div onClick={(event)=> {event.stopPropagation(); activateFocus(state.selectedCard);}} className={`ml-auto p-1 hover:bg-gray-500 hover:bg-opacity-30 rounded-full transition duration-200`}><FullscreenExitIcon  /></div>}
                        </div>
                        <h2 className={`text-xs mb-2 truncate`}>
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
                        <div className="text-left text-black text-md overflow-hidden truncate my-auto">{parseSummary(lines[1])}</div>
                    </div>
                    </div>
                );
                })}
            </div>
            </LayoutGroup>
            }
        </div>
        );
    };



    return (
        <div className="bg-gray-100 h-screen-4rem">

            {!classicMode && processedEmails && <FloatScreen />}
            {classicMode && processedEmails && <div className="w-full h-full bg-gray-100 flex"><MailSidebar /><EmailDetail /></div>}

        {composeOpen && <ComposePopup onClose={()=>setComposeOpen(false)} initString={initString} user={user} isReply={isReply} emailAccountSentTo={emailAccountSentToName} replyTo={replyTo} replySubject={replySubject} />}
        </div>
    );
    };

export default Overview;