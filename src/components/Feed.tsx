import React, { useState, useEffect, useReducer, useRef, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { getUserProcessedEmails, readEmail } from '../actions/processedEmails';
import { getUserEmailAccounts, getUser } from '../actions/auth';
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import ZohoLogo from "../assets/Zoho.png";
import { InputBase, IconButton, Checkbox, Tabs, Tab, Box, ButtonBase } from '@mui/material';
import moment from 'moment-timezone';
import ComposePopup from './ComposePopup';
import DOMPurify from 'dompurify';
import { faInbox, faBell, faArrowRight, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WaveImage from '../assets/Wave.png';
import PartyImage from '../assets/Party.png';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize'
import { getPertinenceColor, getCategoryColor } from './Widgets/getPertinenceColor';
import { formatTimestamp } from './Widgets/formatTimestamp';
import parseSummary from './Widgets/parseSummary';
import Guidebar from './Guidebar';
import TacticalSidebar from './TacticalSidebar';
import { useProcessedEmails } from '../hooks/hooks';
import { CircularProgress } from '@mui/material';


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
  category: string;
  pertinence: number;
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

type FeedProps = {
  activePage: string;
  setActivePage: (page: string) => void;
  layoutState: string;
};



const Feed = ({activePage, setActivePage, layoutState}: FeedProps) => {

  const [processedEmails, setProcessedEmails] = useState<ProcessedEmail[]>([]);
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
  const [user, setUser] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [verifyingUserSession, setVerifyingUserSession] = useState(true);
  const [tryAttempt, setTryAttempt] = useState(0);
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
  const [noEmailConnected, setNoEmailConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { emails, setEmails, newsletterEmails, setNewsletterEmails, selectedGlobalEmail, setSelectedGlobalEmail, nextGlobalEmail, setNextGlobalEmail, isStartScreen, setIsStartScreen, isFinishedScreen, setIsFinishedScreen, isBreakdownMode, setIsBreakdownMode } = useProcessedEmails();

  // email flow management (visual)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCurrentEmail, setShowCurrentEmail] = useState(true);
  const presenterRef = useRef<HTMLDivElement>(null);

  // progress bar
  const progress = selectedGlobalEmail===null ? 0 : (processedEmails.length - emails.length);
  const numEmails = processedEmails.length;

  const { width, height } = useWindowSize();
  const colors = ['#ef4444', '#fb923c', '#fde047', '#4ade80', '#22d3ee'];


  
  async function tryVerify() {
    const resp = await dispatch(getUserProcessedEmails(userToken));
    if (resp.valid===true) {
      setVerifyingUserSession(false);
      const regularEmails = resp.result.filter((email: ProcessedEmail) => email.category === "1" || email.category === "2" || email.category === "3");
      const fetchedNewsletterEmails = resp.result.filter((email: ProcessedEmail) => email.category !== "1" && email.category !== "2" && email.category !== "3");
      setNewsletterEmails(fetchedNewsletterEmails);
      setProcessedEmails(regularEmails);
      setEmails(regularEmails);
      setSelectedGlobalEmail(isStartScreen ? null : regularEmails[0]);
      setNextGlobalEmail(isStartScreen ? regularEmails[0] : regularEmails[1]);
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

  async function goToNextEmail() {
    const emailIndex = emails.findIndex(email => email._id === selectedGlobalEmail?._id);
    // setSelectedEmail(processedEmails[emailIndex+1]);
    setIsStartScreen(false);
    if (isStartScreen) {
      setIsStartScreen(false);
      setSelectedGlobalEmail(emails[0]);
      setNextGlobalEmail(emails[1]);
    } else {
      setSelectedGlobalEmail(emails[emailIndex]);
      setNextGlobalEmail(emails[emailIndex+1]);
    }
  }

  const findNextBlockStart = (currentIndex: number, emails: any[]) => {
    let blockCount = 0; // count of emails in the current block
    const initIndex = currentIndex;
  
    // Skip through current block
    while (currentIndex < emails.length && emails[currentIndex].category === '3' && blockCount < 4) {
      currentIndex++;
      blockCount++;
    }
  
    // If we've not reached the end of the emails and haven't found a new block
    if (currentIndex < emails.length && emails[currentIndex].category !== '3') {
      // Find the start of the next block
      while (currentIndex < emails.length && emails[currentIndex].category !== '3') {
        currentIndex++;
      }
    }
  
    // If we've reached the end of the emails or found a new block, currentIndex is correct
    // If we've not found a new block but haven't reached the end, there are less than 4 emails in the last block
  
    // If we're in the last block (can have 1, 2, 3, or 4 emails)
    if (currentIndex === emails.length && emails.length > 0) {
      // Perform some different logic here
      // For example, return -1
      return initIndex;
    } else if (currentIndex === emails.length && emails.length <= 0) {
      setIsFinishedScreen(true);
      setIsStartScreen(false);
      return -1;
    } else {
      return currentIndex;
    }
  };


  const FocusScreen = () => {

    return (
      <div className="bg-gray-100 w-full h-feed-screen overflow-hidden mx-2 p-6 text-gray-600">
          

        <div className="flex h-[40px] justify-center items-center -mt-5 mb-2 w-full">

          <div className="borderflex w-36 items-center"><span className="text-xl font-semibold mr-1.5">{processedEmails.length - (processedEmails.length - emails.length)}</span> emails left</div>
          <div className="text-xl ml-2 font-semibold mr-8"></div>
            <div className="h-2 w-full mx-0 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-150" 
                  style={{
                    width: `${progress * 100 / numEmails}%`,
                    backgroundColor: `rgb(${progress * 255 / numEmails}, ${progress * 120 / numEmails}, ${progress * 120 / numEmails})`
                  }}
              ></div>
          </div>

        </div>

        <div className="flex gap-8 ">

          <div className="flex flex-col max-w-[1400px] justify-content w-full h-screen-182 relative PRESENTER" ref={presenterRef}>


              {isLoading ? 
              
              <div className={`bg-gray-100 animate-pulse flex items-center justify-center h-[530px] w-full overflow-autos mb-4 rounded-2xl px-8 py-6 transition-all duration-200 col-span-2 row-span-2 shadow-lg ${isTransitioning ? 'opacity-0' : ''}`}>
                <CircularProgress size={58} style={{ 'color': '#d1d5db' }} />
              
              </div> : noEmailConnected ? 
              
              <div className={`bg-white w-full overflow-auto flex flex-col justify-between mb-4 rounded-2xl px-8 py-6 transition-all duration-200 col-span-2 row-span-2 shadow-lg h-fit max-h-[530px]`}>


                <div className="mt-14 mb-8 rounded-lg p-4 mx-32 text-center group flex flex-col">
                  <h1 className="text-5xl font-semibold mt-4 mb-2">Connect your email to <span className="text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400">get started</span></h1>
                  <h2 className="text-lg mt-2 text-gray-400 font-base mb-4">We'll scan your 10 most recent emails to start off</h2>
                </div>
                
                <Link to="/app/connect" className="flex shadow hover:shadow-lg mb-10 group hover:bg-gray-200 transition duration-200 cursor-pointer items-center mx-80 justify-center text-center px-8 py-4 text-2xl font-semibold border rounded-lg"><h1>Connect</h1><FontAwesomeIcon className="ml-2 -mb-[2px] transition duration-200 group-hover:translate-x-1" scale="1px" icon={faLink} style={{ color: "#808080", fontSize: "20px" }} /></Link>
       

              </div> : selectedGlobalEmail && !isStartScreen && (selectedGlobalEmail.category!=="3" || !isBreakdownMode) ? <div className={`bg-white w-full overflow-auto flex flex-col justify-between mb-4 rounded-2xl px-8 py-6 transition-all duration-200 col-span-2 row-span-2 shadow-lg h-fit max-h-[530px] ${isTransitioning ? 'opacity-0' : ''}`}>
                <div>
                  <div className="flex flex-row w-full">
                    <div className="flex flex-row w-full">
                        <p className={`flex mr-0.5 tracking-widest ${selectedGlobalEmail.emojiSummary.length > 1 ? 'w-[56px]' : 'w-[26px]'} ${selectedGlobalEmail.emojiSummary==="" ? 'hidden' : ''}`}>{selectedGlobalEmail.emojiSummary.slice(0, 4)}</p>
                        <div className="truncate w-full font-semibold text-sm mr-auto">{selectedGlobalEmail.fromEmail}</div>
                    </div>
                    <div className="flex">
                        <div className={`rounded-xl shadow-md max-w-[300px] truncate w-fit overflow-hidden  h-full text-xs text-center px-4 p-2 ${getCategoryColor(parseInt(selectedGlobalEmail.category))} font-semibold mr-4 mx-2`}>
                            <div className="text-left truncate my-auto">{parseSummary(selectedGlobalEmail?.summary.split("- ").map((line, index) => index === 0 ? line : '- ' + line)[1])}</div>
                        </div>
                        <span className={`text-xs min-w-[50px] w-fit truncate font-light text-gray-400`}>{formatTimestamp(selectedGlobalEmail.timestamp, timeZone)}</span>

                    </div>
                  </div>
                  <div className="flex flex-row w-full">
                    <h2 className="text-xs mt-1 mb-2 truncate">
                      {selectedGlobalEmail.subject}
                    </h2>
                  </div>
                  <p className="text-md text-black text-start mx-auto py-6 max-w-[900px] overflow-x-auto overflow-y-auto" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedGlobalEmail.body) }}></p>
                </div>
              </div> : selectedGlobalEmail && !isStartScreen && selectedGlobalEmail.category==="3" && isBreakdownMode ? 
              
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {
                  emails && (() => {
                    // Filtering emails with category "3"
                    const category3Emails = emails.filter((email) => email.category === "3");

                    // Find the index of the current email in the filtered emails
                    const currentIndex = category3Emails.findIndex(email => email._id === selectedGlobalEmail?._id);
                    
                    // If the current email is not in the list (not category "3" or not found for some reason), do nothing
                    if (currentIndex === -1) return null;

                    // Get the next block of emails. It will include 2, 3, or 4 emails that also have category "3"
                    const nextBlockEmails = category3Emails.slice(currentIndex + 0, currentIndex + 4);

                    // Render the emails in the next block
                    return nextBlockEmails.map((email, index) => (
                      <div className={`bg-white scrollbar-track-transparent w-full hover:scale-[1.01] hover:border-red-500 overflow-x-hidden overflow-y-auto flex flex-col justify-between mb-0 rounded-2xl px-8 py-6 transition-all duration-200 col-span-1 row-span-1 shadow-lg h-[300px]`}>
                        <div>
                          <div className="flex flex-row w-full">
                            <div className="flex flex-row w-full">
                                <p className={`flex mr-0.5 tracking-widest ${email.emojiSummary.length > 1 ? 'w-[56px]' : 'w-[26px]'} ${email.emojiSummary==="" ? 'hidden' : ''}`}>{email.emojiSummary.slice(0, 4)}</p>
                                <div className="truncate w-full font-semibold text-sm mr-auto">{email.fromEmail}</div>
                            </div>
                            <div className="flex">
                                <span className={`text-xs min-w-[50px] w-fit truncate font-light text-gray-400`}>{formatTimestamp(email.timestamp, timeZone)}</span>
                            </div>
                          </div>
                          <div className="flex flex-row w-full">
                            <h2 className="text-xs mt-1 mb-2 truncate">
                              {email.subject}
                            </h2>
                          </div>
                          <p className="text-md text-black text-start mx-auto py-6 max-w-[900px] overflow-x-auto overflow-y-auto" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.body) }}></p>
                        </div>
                      </div>
                    ));
                  })()
                }
              </div>
      
              : isStartScreen ? 
                <div className={`bg-white w-full overflow-auto flex flex-col justify-between mb-4 rounded-2xl px-8 py-8 transition-all duration-200 col-span-2 row-span-2 shadow-lg h-fit max-h-[530px] ${isTransitioning ? 'opacity-0' : ''}`}>
                    
                    <div className="text-4xl font-semibold flex justify-between">
                        <h1>Welcome back! <img src={WaveImage} alt="Wave" className="w-10 h-auto mr-4 inline" /></h1>
                        <div className=""><span className="text-3xl mr-1.5">{emails.length}</span><span className="mr-2 text-sm font-semibold text-gray-500">new emails</span>
                        <IconButton className="relative" size="medium" aria-label="notifications"><NotificationsIcon style={{ color: 'black' }} fontSize="inherit" /><div className="p-1 top-2.5 right-2.5 rounded-full animate-pulse bg-red-500 absolute"></div></IconButton>
                        </div>
                    </div>
                    <div className="text-xl text-gray-400 font-base flex justify-between">
                        Here's a snapshot of what you missed
                    </div>

                    <div className="border bg-gray-100 transition duration-200 hover:shadow-red-200 rounded-lg h-[320px] w-full mt-6 overflow-auto rounded-t-lg flex flex-col">
                      <div className="w-full flex flex-wrap">

                      {emails.length > 0 ? emails.map((item: any, index: any) => (
                        <div key={item._id} onClick={()=> {setSelectedGlobalEmail(item); setNextGlobalEmail(emails[emails.findIndex(item => item._id === item?._id)+1]); setIsStartScreen(false);}} className={`${item.category==="3" ? 'w-1/4' : 'w-full'} ${getCategoryColor(parseInt(item.category))} max-h-[48px] transition-all duration-200 group overflow-hidden py-4 px-4 flex flex-row cursor-pointer ${index % 2===0 ? 'bg-opacity-[0.90]' : ''}`}>
                          <p className={`flex mr-0.5 group-hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap overflow-hidden tracking-widest ${item.emojiSummary.length > 1 ? 'w-[50px]' : 'w-[25px]'} ${item.emojiSummary==="" ? 'hidden' : ''}`}>{item.emojiSummary.slice(0, 4)}</p>
                          <h3 className="text-md truncate group-hover:translate-x-1 transition-all duration-200">{item.subject}</h3>
                          <span className={`text-xs ml-auto min-w-[50px] w-fit truncate font-light ${item.category==="3" ? 'hidden' : ''}`}>{formatTimestamp(item.timestamp, timeZone)}</span>
                        </div>
                      )) : 
                      <div className="flex flex-col relative p-10 gap-2 items-center justify-center mx-auto">
                        <FontAwesomeIcon size="5x" icon={faInbox} style={{ color: "#d1d5db" }} />

                        <h1 className="text-xl mt-4 text-gray-400 font-semibold mb-2">You've got no new emails. </h1>
                        <div><button className={`text-white hover:translate-y-[1px] active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-yellow-500 from-40% via-yellow-300 via-80% to-yellow-50`}>A</button>
                        <div className="bg-yellow-900 rounded-xl -mt-[9px] w-[26.5px] pb-[9px] pt-[5px] px-2"></div></div>
                        

                      </div>
                      }
                      </div>

                    </div>


                    <div className="mt-6 text-center group flex flex-col">
                        <h3 className="text-gray-400 text-lg mb-4">Ready to dive in?</h3>
                        <button onClick={goToNextEmail} className="text-white shadow-sm mx-auto flex z-10 w-[234px] text-3xl hover:translate-y-[2px] active:translate-y-[4px] transition duration-100 font-bold py-2 px-4 rounded-md bg-gradient-to-tr from-slate-500 from-20% via-slate-400 via-70% to-slate-300">GET STARTED</button>
                        <div className="bg-slate-700 mx-auto z-0 rounded-xl -mt-[9px] w-[232px] pb-[9px] pt-[7px] px-2"></div>
                    </div>


                </div> : isFinishedScreen ? 
                <div className={`bg-white w-full overflow-auto flex flex-col justify-between mb-4 rounded-2xl px-8 py-8 transition-all duration-200 col-span-2 row-span-2 shadow-lg h-fit max-h-[530px] ${isTransitioning ? 'opacity-0' : ''}`}>
                  <Confetti
                    width={width}
                    height={height}
                    colors={colors}
                    numberOfPieces={200}
                    recycle={false}
                  />
                  <div className="text-3xl font-semibold flex justify-between">
                      <h1>Congrats! <img src={PartyImage} alt="Wave" className="w-7 h-auto mr-4 inline" /></h1>
                      <div className=""><span className="text-3xl mr-1.5">0</span><span className="mr-2 text-sm font-semibold text-gray-500">new emails</span>
                      <IconButton className="relative" size="medium" aria-label="notifications"><NotificationsIcon style={{ color: 'black' }} fontSize="inherit" /><div className="p-1 top-2.5 right-2.5 rounded-full animate-pulse bg-red-500 absolute"></div></IconButton>
                      </div>
                  </div>
                  <div className="text-xl text-gray-400 font-base flex justify-between">
                    You're all caught up for now
                  </div>

                  <div className="mt-14 mb-20 rounded-lg p-4 mx-40 text-center group flex flex-col">
                    <h1 className="text-5xl font-semibold mt-4 mb-2">You saved <span className="text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400">{(processedEmails.length * 30 / 60)}</span> today</h1>
                    {/* <h2 className="text-lg mt-2 text-gray-400 font-base mb-4">And are on track to save 1.5 hours this week</h2> */}

                  </div>

                  <h3 className="text-gray-400 text-center text-lg mb-4">Check these out, or keep scrolling for more content</h3>

                  <div className="flex flex-row justify-center gap-4 mt-2 mx-8">
                    <div onClick={()=>{setActivePage("contacts")}} className="border group hover:shadow-inner px-4 py-2 font-semibold rounded-lg hover:bg-gray-200 cursor-pointer transition duration-200 bg-gray-50">Contacts<FontAwesomeIcon className="ml-2 transition duration-200 group-hover:translate-x-0.5" scale="1px" icon={faArrowRight} style={{ color: "#808080", fontSize: "14px" }} /></div>
                    <div className="border group hover:shadow-inner px-4 py-2 font-semibold rounded-lg hover:bg-gray-200 cursor-pointer transition duration-200 bg-gray-50">Auto-Notes<FontAwesomeIcon className="ml-2 transition duration-200 group-hover:translate-x-0.5" scale="1px" icon={faArrowRight} style={{ color: "#808080", fontSize: "14px" }} /></div>
                    <div onClick={()=>{setActivePage("analytics")}} className="border group hover:shadow-inner px-4 py-2 font-semibold rounded-lg hover:bg-gray-200 cursor-pointer transition duration-200 bg-gray-50">Analytics<FontAwesomeIcon className="ml-2 transition duration-200 group-hover:translate-x-0.5" scale="1px" icon={faArrowRight} style={{ color: "#808080", fontSize: "14px" }} /></div>
                    <div className="border group hover:shadow-inner px-4 py-2 font-semibold rounded-lg hover:bg-gray-200 cursor-pointer transition duration-200 bg-gray-50">Compose email<FontAwesomeIcon className="ml-2 transition duration-200 group-hover:translate-x-0.5" scale="1px" icon={faArrowRight} style={{ color: "#808080", fontSize: "14px" }} /></div>
                  </div>

                </div>
                
                : <></>
              }

              {nextGlobalEmail && 
                <div onClick={goToNextEmail} className={`${isTransitioning ? 'bg-white opacity-100 h-[400px]' : 'h-[400px] mt-auto -mb-[400px] hover:opacity-70 hover:-translate-y-1 bg-gray-900 opacity-50'} w-full overflow-auto flex flex-col justify-between rounded-2xl px-8 py-5 cursor-pointer transition-all duration-200 col-span-2 row-span-2 shadow-lg`}>
                  <div>
                    <div className="flex flex-row w-full">
                      <p className={`flex  mr-0.5 tracking-widest ${nextGlobalEmail.emojiSummary.length > 1 ? 'w-[56px]' : 'w-[26px]'}`}>{nextGlobalEmail.emojiSummary.slice(0, 4)}</p>
                      <div className="truncate w-full font-semibold text-sm mr-auto">{nextGlobalEmail.fromEmail}</div>
                    </div>
                    <h2 className="text-xs mt-1 mb-2 truncate">
                      {nextGlobalEmail.subject}
                    </h2>
                    {isTransitioning && <p className="text-sm px-16 py-6 truncate max-w-full overflow-x-auto overflow-y-auto" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(nextGlobalEmail.body) }}></p>}
                  </div>
                </div>
              }

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 w-full ">
      <div className="bg-gray-100 flex">
        {<Guidebar layoutState={layoutState} />}
        <FocusScreen />
        <TacticalSidebar layoutState={layoutState} />
      </div>
      {composeOpen && <ComposePopup onClose={()=>setComposeOpen(false)} initString={initString} user={user} isReply={isReply} emailAccountSentTo={emailAccountSentToName} replyTo={replyTo} replySubject={replySubject} />}
    </div>
  );
};

export default Feed;