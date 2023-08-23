import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { getUserProcessedEmails } from '../actions/processedEmails';
import { getUserEmailAccounts, getUser } from '../actions/auth';
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import { InputBase, IconButton, Checkbox, Tabs, Tab, Box, ButtonBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MailIcon from '@mui/icons-material/Mail';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InboxIcon from '@mui/icons-material/Inbox'; // simulates Archive icon
import FlagIcon from '@mui/icons-material/Flag'; // simulates Report Spam icon
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'; // simulates Delete icon
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SnoozeIcon from '@mui/icons-material/Snooze';
import LabelIcon from '@mui/icons-material/Label'; 
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PrintIcon from '@mui/icons-material/Print';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Avatar from '@mui/material/Avatar';
import ReplyIcon from '@mui/icons-material/Reply';
import AvatarPic from '../assets/DefaultAvatar.png';
import moment from 'moment-timezone';
import ComposePopup from './ComposePopup';
import DOMPurify from 'dompurify';

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

interface EmailDetailProps {
  email: ProcessedEmail;
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




  const MailSidebar = () => {
    return (
      <div className="flex flex-col bg-gray-50 w-60 py-4 text-gray-600">
        <button onClick={() => {setIsReply(false); setReplyTo(""); setInitString(""); setReplySubject(""); setComposeOpen(true)}} className="rounded-xl shadow mb-4 mx-4 mr-10 justify-center hover:shadow-lg hover:bg-emerald-300  transition duration-200 font-medium flex bg-emerald-200 py-4 px-5">
          <AddIcon className="" /> 
          <span className="ml-2">Compose</span>
        </button>
        <div className={`flex items-center transition duration-150 my-3 mr-4 cursor-pointer p-2 rounded-tr-3xl rounded-br-3xl ${selectedInbox==="Inbox" ? 'bg-emerald-200 shadow font-semibold text-gray-700' : 'hover:bg-gray-200' }`} onClick={()=>setSelectedInbox("Inbox")}>
          <div className="mx-3">
            <MailIcon />
          </div>
          <div>Inbox</div>
        </div>
        <div aria-disabled className={`flex items-center transition duration-150 my-3 mr-4 cursor-pointer p-2 rounded-tr-3xl rounded-br-3xl ${selectedInbox==="Starred" ? 'bg-emerald-200 shadow font-semibold text-gray-700' : 'hover:bg-gray-200' }`} onClick={()=>setSelectedInbox("Starred")}>
          <div className="mx-3">
            <StarIcon />
          </div>
          <div>Starred</div>
        </div>
        <div className={`flex items-center transition duration-150 my-3 mr-4 cursor-pointer p-2 rounded-tr-3xl rounded-br-3xl ${selectedInbox==="Sent" ? 'bg-emerald-200 shadow font-semibold text-gray-700' : 'hover:bg-gray-200' }`} onClick={()=>setSelectedInbox("Sent")}>
          <div className="mx-3">
            <SendIcon />
          </div>
          <div>Sent</div>
        </div>
        <div className={`flex items-center transition duration-150 my-3 mr-4 cursor-pointer p-2 rounded-tr-3xl rounded-br-3xl ${selectedInbox==="Drafts" ? 'bg-emerald-200 shadow font-semibold text-gray-700' : 'hover:bg-gray-200' }`} onClick={()=>setSelectedInbox("Drafts")}>
          <div className="mx-3">
            <DraftsIcon />
          </div>
          <div>Drafts</div>
        </div>
        <div className={`flex items-center transition duration-150 my-3 mr-4 cursor-pointer p-2 rounded-tr-3xl rounded-br-3xl ${selectedInbox==="Spam" ? 'bg-emerald-200 shadow font-semibold text-gray-700' : 'hover:bg-gray-200' }`} onClick={()=>setSelectedInbox("Spam")}>
          <div className="mx-3">
            <ErrorIcon />
          </div>
          <div>Spam</div>
        </div>
        <div className={`flex items-center transition duration-150 my-3 mr-4 cursor-pointer p-2 rounded-tr-3xl rounded-br-3xl ${selectedInbox==="Trash" ? 'bg-emerald-200 shadow font-semibold text-gray-700' : 'hover:bg-gray-200' }`} onClick={()=>setSelectedInbox("Trash")}>
          <div className="mx-3">
            <DeleteIcon />
          </div>
          <div>Trash</div>
        </div>
      </div>
    );
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue);
  };

  const EmailRow = ({ email }: { email: ProcessedEmail }) => {
    const [isStarred, setIsStarred] = useState(email.isStarred || false);
    const [isSelected, setIsSelected] = useState(false);

    const summary = email?.summary || '';

    const lines = summary.split("- ").map((line, index) => index === 0 ? line : '- ' + line);
  
    const handleStarClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsStarred(!isStarred);
      // here you can make a request to your API to persist the starred state
    };
  
    const clickRow = () => {
      setSelectedEmail(email);
    };

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

    const getPertinenceColor = (pertinence: string) => {

      //Irrelevant, Newsletter, Informative, Important, Urgent, Critical, Work, Personal, School

      if (pertinence==="Irrelevant") {
          return "bg-gray-200 text-black"

      } else if (pertinence==="Newsletter") {
          return "bg-gray-200 text-black text-xs"

      } else if (pertinence==="Informative") {
          return "bg-orange-100 text-xs"

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
    
    const showFull = email.pertinence==="Work" || email.pertinence==="Personal" || email.pertinence==="School" || email.pertinence==="Important"


    const clickReply = (num: any) => {
      num===1 ? setInitString(JSON.parse(email?.responseOptions[0]).response2) : setInitString(JSON.parse(email?.responseOptions[0]).response1);
      setIsReply(true);
      setReplyTo(email.fromEmail);
      setReplySubject(`Re: ${email.subject}`);
      const emailAccount = emailAccounts.find((account: any) => account._id === email.emailAccountId);

      if (!emailAccount) {
        alert("Error replying to this email");
        return;
      }

      setEmailAccountSentToName(emailAccount.accountEmail);
      
      setComposeOpen(true)
    }

    

    return (
      <div onClick={clickRow} className={`flex flex-col overflow-x-auto sm:flex-row cursor-pointer items-start w-full sm:items-stretch border-b border-gray-200 p-4 hover:shadow ${isSelected ? 'bg-emerald-100' : ''}`}>
        <div className="sm:mb-auto w-full xl:w-[250px] sm:w-[250px] mr-4">
          <div className="block sm:flex  items-center space-x-2 sm:space-x-0 sm:space-y-2 pr-2 ">
            <div className="pr-0 mt-2.5">
              <Checkbox color="default" inputProps={{ 'aria-label': 'checkbox with default color' }} onClick={(event) => {event.stopPropagation(); setIsSelected(!isSelected)}}/>
            </div>
            <div className="pr-3 cursor-pointer hidden sm:block" onClick={handleStarClick}>
              {isStarred ? <StarIcon color="primary" /> : <StarBorderIcon />}
            </div>
            <div className="font-bold w-64 truncate">{email.fromEmail}</div>
          </div>

          {email.pertinence && <div className={`rounded-3xl mt-3 w-fit shadow-none text-xs  text-center p-2 ${getPertinenceColor(email.pertinence)} px-4 font-semibold`}>{email?.pertinence}</div>}

        </div>
        <div className="sm:w-[20px] md:w-[100px] lg:w-[230px] xl:w-[520px] 2xl:w-[729px] ">
          <div className="font-base text-gray-500 text-lg truncate">{email.subject}</div>
          <div className={`text-black font-medium mt-2 overflow-auto rounded-xl p-2 px-3 ${isSelected ? `bg-white opacity-80 shadow-inner ${getPertinenceColor(email.pertinence)}` : `${getPertinenceColor(email.pertinence)} bg-opacity-20`}`}>
              {lines.map((line, index) => (
                  <div className="mb-1" key={index}>{parseSummary(line)}</div>
              ))}
          </div>
        </div>
        <div className={`ml-auto space-x-5 flex items-center ${showFull && email.responseOptions.length > 0 ? 'w-fit' : 'w-16'}`}>
          {showFull && email.responseOptions.length > 0 ?
            <div className="flex flex-col mr-2 space-y-3">
              <ButtonBase sx={{ borderRadius: '12px' }}><div onClick={(event)=> {event.stopPropagation(); clickReply(0);}} className="p-2 border-2 text-sm w-full border-gray-700 rounded-xl truncate bg-gray-100 bg-opacity-90 flex hover:bg-gray-200 transition duration-150"><span className="mr-4">{JSON.parse(email?.responseOptions[0]).option1Name}</span> <ReplyIcon className="ml-auto" fontSize="small" /></div></ButtonBase>
              <ButtonBase sx={{ borderRadius: '12px' }}><div onClick={(event)=> {event.stopPropagation(); clickReply(1);}} className="p-2 border-2 text-sm w-full border-gray-700 rounded-xl truncate bg-gray-100 bg-opacity-90 flex hover:bg-gray-200 transition duration-150"><span className="mr-4">{JSON.parse(email?.responseOptions[0]).option2Name}</span> <ReplyIcon className="ml-auto" fontSize="small" /></div></ButtonBase>
            </div>
          : null}
          <div className="text-sm tracking-tight text-gray-800">{formatTimestamp(email.timestamp, timeZone)}</div>
        </div>
      </div>
    );
  };

  const EmailDetail = ({ email }: EmailDetailProps) => { 

    const timestamp = moment(email.timestamp).format('MMM D, YYYY, h:mm A');
    const fromNow = moment(email.timestamp).fromNow();
    const [isStarred, setIsStarred] = useState(false);
    const sanitizedHTML = DOMPurify.sanitize(email.body);
    
    return(
      <div className="p-4">
        <div className="flex items-center justify-start mb-4">
          <div className="mr-8"><IconButton  onClick={() => setSelectedEmail(null)}>
            <ArrowBackIcon fontSize="small" />
          </IconButton></div>
          <div className="flex space-x-4">
            <IconButton className="mx-2">
              <MoveToInboxIcon fontSize="small" />
            </IconButton>
            <IconButton className="mx-2">
              <RemoveCircleIcon fontSize="small" />
            </IconButton>
            <IconButton className="mx-2">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </div>
          <div className="mx-2 border-l border-gray-200 h-6"></div>
          <div className="flex space-x-4">
            <IconButton className="mx-2">
              <MailOutlineIcon fontSize="small" />
            </IconButton>
            <IconButton className="mx-2">
              <SnoozeIcon fontSize="small" />
            </IconButton>
            <IconButton className="mx-2">
              <LabelIcon fontSize="small" />
            </IconButton>
            <IconButton className="mx-2">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </div>
          <div className="ml-auto flex justify-center items-center my-auto">
            <text className="text-sm text-gray-500">1 of {processedEmails.length}</text>
            <div className="space-x-2 ml-4">
              <IconButton className="mx-2">
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton className="mx-2">
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="mx-16 mt-4 text-2xl mb-8 font-base text-black">{email.subject}</h2>
            <IconButton className="mx-2">
              <PrintIcon fontSize="small" />
            </IconButton>
          </div>
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

          <p className="text-sm px-16 py-6" dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></p>

        </div>
      </div>
    );
  };
  
  
  

  const MailFilter = () => {
    return (
      <div className="flex items-center space-x-2 p-2">
        <div className=" rounded-full p-1">
          <Checkbox color="default" inputProps={{ 'aria-label': 'checkbox with default color' }}/>
        </div>
        <div className=" rounded-full p-1">
          <IconButton size="small">
            <ExpandMoreIcon />
          </IconButton>
        </div>
        <div className=" rounded-full p-1">
          <IconButton size="small">
            <RefreshIcon />
          </IconButton>
        </div>
        <div className="rounded-full p-1">
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 flex overflow-auto">
      <MailSidebar />
      <div className="MainContentContainer w-full flex flex-col">
        <div className="border rounded-2xl overflow-hidden flex items-center py-0.5 bg-slate-50 focus:bg-white my-2">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <InputBase placeholder="Search mail" className="px-4 -mb-1 w-full" />
        </div>
        <div className="bg-white rounded-xl w-full h-full my-1">
        {selectedEmail===null ? <div>
          
          <MailFilter />
          <Tabs value={selectedTab} onChange={handleTabChange} className="ml-4 border-b overflow-x-auto">
            <Tab icon={<InboxIcon className="mr-3" fontSize="small" />} label="All" value="All" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }} />
            {emailAccounts.map((emailAccount: any, index: any)=> (
              <Tab icon={<img src={emailAccount.provider==="Google" ? GmailLogo : OutlookLogo} alt="icon" className="mr-4" style={{width: '16px', height: '16px'}} />} 
                key={index} className="hover:bg-gray-50" label={emailAccount.accountEmail} value={emailAccount.accountEmail}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
              />
            ))}
              <Tab icon={<AddIcon className="mr-3" fontSize="small" />} onClick={()=>navigate("/app/connect")} label="Connect New" value="Connect New" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }} />
          </Tabs>
          <div className="overflow-y-auto">
            {processedEmails.map((email) => (
              <EmailRow key={email._id} email={email} />
            ))}
          </div></div> : <EmailDetail email={selectedEmail} />}
        </div>
      </div> 
      {composeOpen && <ComposePopup onClose={()=>setComposeOpen(false)} initString={initString} user={user} isReply={isReply} emailAccountSentTo={emailAccountSentToName} replyTo={replyTo} replySubject={replySubject} />}
    </div>
  );
};

export default MasterInbox;