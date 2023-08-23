import React, { useState, useEffect, useRef, createRef } from 'react';
import AvatarPic from '../assets/DefaultAvatar.png';
import { formatTimestamp } from './Widgets/formatTimestamp';
import { getPertinenceColor } from './Widgets/getPertinenceColor';
import { LMODE } from './Widgets/constants';
import WaveImage from '../assets/Wave.png';
import LockImage from '../assets/Lock.png';
import PartyImage from '../assets/Party.png';
import { useProcessedEmails } from '../hooks/hooks';
import parseSummary from './Widgets/parseSummary';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { ViewModule } from '@mui/icons-material';

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

type GuidebarProps = {
    layoutState: string;
};
  

const Guidebar = ({layoutState}: GuidebarProps) => {

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [groupedEmails, setGroupedEmails] = useState<any>({});
    const { emails, setEmails, selectedGlobalEmail, setSelectedGlobalEmail, nextGlobalEmail, setNextGlobalEmail, isStartScreen, setIsStartScreen, isFinishedScreen, setIsFinishedScreen, isBreakdownMode, setIsBreakdownMode } = useProcessedEmails();
    const emailRefs = useRef(new Map());
    const welcomeBackRef = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const groups: {[key: string]: ProcessedEmail[]} = {
            "MostImportant": [],
            "Important": [],
            "Relevant": [],
            "Newsletter": [],
            "Other": []
        };

        for (const email of emails) {
            console.log('email category is', email.category);
            if (email.category === "1") {
            groups["MostImportant"].push(email);
            } else if (email.category === "2") {
            groups["Important"].push(email);
            } else if (email.category === "3") {
            groups["Relevant"].push(email);
            }
        }

        setGroupedEmails(groups);
    }, [emails]);

    useEffect(() => {
        const scrollIntoEmail = () => {
            if (selectedGlobalEmail === null) {
                welcomeBackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (selectedGlobalEmail) {
                const emailRef = emailRefs.current.get(selectedGlobalEmail._id);
                emailRef && emailRef.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    
        // Defer scroll action until after render
        setTimeout(scrollIntoEmail, 0);
    }, [selectedGlobalEmail, emails]);
    

    function goToEmail(email: ProcessedEmail) {
        if (isStartScreen) {
            setIsStartScreen(false);
        }
        const index = emails.findIndex(item => item._id === email?._id)
        setSelectedGlobalEmail(email);
        setNextGlobalEmail(emails[index+1]);
        // Immediately scroll into view when email is selected
        // const emailRef = emailRefs.current.get(email._id);
        // emailRef && emailRef.scrollIntoView({behavior: "smooth", block: "start"});
    }

    function goToStart() {
        setIsStartScreen(true);
        setSelectedGlobalEmail(null);
        setNextGlobalEmail(emails[0]);
    }

    return (
        <div  className={`flex flex-col ${layoutState === "GUIDE" || layoutState === "FULL" ? 'w-[400px] opacity-100' : 'w-0 opacity-0'} 
            border-r transition-all ease-in-out duration-200 overflow-y-auto overflow-x-hidden h-feed-screen bg-gray-100 py-2 text-gray-600`}
        >
            <div ref={welcomeBackRef} onClick={goToStart} className={`cursor-pointer shadow-md rounded-md  w-full h-fit flex flex-col ${selectedGlobalEmail===null ? 'bg-slate-700 text-white hover:bg-slate-800' : 'hover:text-white hover:bg-slate-600'}   transition-all duration-150 items-start  ml-0 mr-0 py-3 px-4`}>
                <div className="flex w-full items-center">
                    <div className="font-semibold truncate text-sm mr-auto ml-0">Welcome back! <img src={WaveImage} alt="Wave" className="w-4 h-auto mr-4 inline" /></div>
                    <span className={`text-xs truncate font-light ml-auto`}>(top of inbox)</span>
                </div>
            </div>

            <div className={`w-full mt-2 mb-2 ${groupedEmails["MostImportant"] && groupedEmails["MostImportant"].length===0 ? 'hidden' : 'block'} font-medium ml-2 text-xs text-gray-400`}>Most Important</div>

            <div className="w-full">

                {groupedEmails["MostImportant"] && groupedEmails["MostImportant"].length>0 && groupedEmails["MostImportant"].map((email: any, index: any) => {
                    const summary = email?.summary || '';
                    const lines = summary.split("- ").map((line: any, index: any) => index === 0 ? line : '- ' + line);
                    return (
                        <div ref={ref => emailRefs.current.set(email._id, ref)} className="cursor-pointer rounded-md border px-0 py-0 w-full h-fit flex flex-col" onClick={()=>{goToEmail(email)}}>
                            <div className={`flex flex-col h-full items-start w-full rounded-md ml-0 mr-0 py-3 px-4 ${selectedGlobalEmail===email ? 'bg-slate-800 text-white shadow font-semibold' : 'bg-slate-50 hover:bg-slate-100 '}`}>
                                <div className="flex w-full items-center">
                                    <div className="font-semibold truncate text-sm mr-auto ml-0">{email.fromEmail}</div>
                                    <span className={`text-xs truncate font-light ml-auto ${selectedGlobalEmail===email ? 'text-white' : 'text-gray-400'}`}>{formatTimestamp(email.timestamp, timeZone)}</span>
                                </div>
                                <div className="w-full flex items-center mt-1 pr-2">
                                    <div className="text-xs truncate font-light ml-0">{email.subject}</div>
                                    <span className={`text-xs truncate font-light ml-auto ${selectedGlobalEmail===email ? 'text-white' : 'text-gray-400'}`}>{email.emojiSummary.slice(0, 4)}</span>
                                </div>
                                <div className={`rounded-xl w-full mt-2 text-xs text-center px-2 p-1 bg-gray-50 shadow-gray-700 font-semibold `}>
                                    <div className="text-left text-gray-700 truncate my-auto">{parseSummary(lines[1])}</div>
                                </div>
                            </div>
                        </div>
                )})}
            </div>

            <div className={`w-full mt-2 mb-2 font-semibold ml-2 ${groupedEmails["Important"] && groupedEmails["Important"].length===0 && 'hidden'} text-xs text-gray-400`}>Important</div>

            <div className="w-full ">
                {groupedEmails["Important"] && groupedEmails["Important"].length>0 && groupedEmails["Important"].map((email: any, index: any) => {
                    return (
                        <div ref={ref => emailRefs.current.set(email._id, ref)} className="cursor-pointer rounded-md border px-0 py-0 w-full h-fit flex flex-col" onClick={()=>{goToEmail(email)}}>
                            <div className={`flex flex-col h-full items-start w-full rounded-md ml-0 mr-0 py-3 px-4 ${selectedGlobalEmail===email ? 'bg-slate-600 text-white shadow font-semibold' : 'bg-slate-50 hover:bg-slate-100 '}`}>
                                <div className="flex w-full items-center">
                                    {/* <span className={`text-xs truncate font-light ml-auto ${selectedEmail===email ? 'text-white' : 'text-gray-400'}`}>{email.emojiSummary}</span> */}
                                    <div className="font-semibold truncate text-sm mr-auto ml-0">{email.fromEmail}</div>
                                    <span className={`text-xs truncate  font-light ml-auto ${selectedGlobalEmail===email ? 'text-white' : 'text-gray-400'}`}>{formatTimestamp(email.timestamp, timeZone)}</span>
                                </div>
                                <div className="w-full mt-1 pr-2">
                                    <div className="text-xs truncate font-light ml-0">{email.subject}</div>
                                </div>
                            </div>
                        </div>
                )})}
            </div>

            <div className={`w-full mt-2 mb-2 ${groupedEmails["Relevant"] && groupedEmails["Relevant"].length===0 && 'hidden'} pr-4 justify-between items-center w-full flex font-semibold ml-2 text-xs text-gray-400`}>
                <span className="">Relevant</span><ViewModuleIcon onClick={()=>{setIsBreakdownMode(!isBreakdownMode)}} className="cursor-pointer p-1 hover:bg-gray-200 rounded-full" />
            </div>


            <div className="w-full flex flex-wrap ">
                {groupedEmails["Relevant"] && groupedEmails["Relevant"].length>0 && groupedEmails["Relevant"].map((email: any, index: any) => {
                    const groupIndex = Math.floor(index / 4);
                    const isSelectedEmailGroup = Math.floor(groupedEmails["Relevant"].findIndex((e: ProcessedEmail) => e._id === selectedGlobalEmail?._id) / 4) === groupIndex;
                    
                    return (
                        <div 
                            ref={ref => emailRefs.current.set(email._id, ref)} 
                            className={`cursor-pointer rounded-md border px-0 py-0 ${isBreakdownMode ? 'w-1/4' : 'w-full'} h-fit flex flex-col`}
                            onClick={() => {setSelectedGlobalEmail(email); if (isStartScreen) {setIsStartScreen(false)}; }}
                        >
                            <div className={`flex flex-col h-full items-start w-full rounded-md ml-0 mr-0 py-3 px-4 ${isSelectedEmailGroup && isBreakdownMode ? 'bg-slate-600 text-white shadow font-semibold' : selectedGlobalEmail===email && !isBreakdownMode ? 'bg-slate-600 text-white shadow font-semibold' : 'bg-slate-50 hover:bg-slate-100 '}`}>
                                <div className="flex w-full gap-2 items-center">
                                    {/* <span className={`text-xs truncate font-light ml-auto ${selectedEmail===email ? 'text-white' : 'text-gray-400'}`}>{email.emojiSummary}</span> */}
                                    <div className="font-semibold  truncate text-sm mr-auto ml-0">{email.fromEmail}</div>
                                    <span className={`text-xs w-[57px] truncate font-light ml-auto ${isSelectedEmailGroup ? 'text-white' : 'text-gray-400'}`}>{formatTimestamp(email.timestamp, timeZone)}</span>
                                </div>
                                <div className="w-full mt-1 pr-2">
                                    <div className="text-xs truncate font-light ml-0">{email.subject}</div>
                                </div>
                            </div>
                        </div>
                )})}
            </div>

            <div  className={`cursor-pointer shadow-md rounded-md ${isFinishedScreen ? 'bg-gradient-to-r from-red-500 via-orange-500 to-cyan-400' : 'bg-gray-400'} transition-all duration-1000 my-2 text-white  w-full h-fit flex flex-col items-start  ml-0 mr-0 py-3 px-4`}>
                <div className="flex w-full items-center">
                    <div className="font-semibold truncate text-sm mr-auto ml-0">{isFinishedScreen ? 'Congrats' : 'Locked'} <img src={isFinishedScreen ? PartyImage : LockImage} alt="Lock" className="w-4 -mt-1 h-auto ml-1 inline" /></div>
                    <span className={`text-xs text-gray-300 truncate font-light ml-auto`}>{isFinishedScreen ? 'all finished' : '(clear your inbox to unlock)'}</span>
                </div>
            </div>

            <div className={`w-full mt-2 mb-2 ${groupedEmails["Newsletter"] && groupedEmails["Newsletter"].length===0 && 'hidden'} font-semibold ml-2 text-xs text-gray-400`}>Newsletter</div>


            <div className="w-full flex flex-wrap ">
                {groupedEmails["Newsletter"] && groupedEmails["Newsletter"].length>0 && groupedEmails["Newsletter"].map((email: any, index: any) => {
                    return (
                        <div ref={ref => emailRefs.current.set(email._id, ref)} className="cursor-pointer rounded-md border px-0 py-0 w-full h-fit flex flex-col" onClick={()=>{goToEmail(email)}}>
                            <div className={`flex flex-col h-full items-start w-full rounded-md ml-0 mr-0 py-3 px-4 ${selectedGlobalEmail===email ? 'bg-slate-600 text-white shadow font-semibold' : 'bg-slate-50 hover:bg-slate-100 '}`}>
                                <div className="flex w-full gap-2 justify-between items-center">
                                    {/* <span className={`text-xs truncate font-light ml-auto ${selectedEmail===email ? 'text-white' : 'text-gray-400'}`}>{email.emojiSummary}</span> */}
                                    <div className="font-semibold max-w-[200px]  truncate text-sm">{email.fromEmail}</div>
                                    <span className={`text-xs w-14 truncate font-light ${selectedGlobalEmail===email ? 'text-white' : 'text-gray-400'}`}>{formatTimestamp(email.timestamp, timeZone)}</span>
                                </div>
                                <div className="w-full mt-1 pr-2">
                                    <div className="text-xs truncate font-light ml-0">{email.subject}</div>
                                </div>
                            </div>
                        </div>
                )})}
            </div>




        
        </div>
    );
};

export default Guidebar