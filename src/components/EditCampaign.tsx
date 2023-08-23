import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import ZohoLogo from "../assets/Zoho.png";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { editAutoInbound, outlookActivateAutoInbound, googleActivateAutoInbound, getAutoInbound } from '../actions/autoInbound';
import { verify, getUserEmailAccounts } from '../actions/auth';
import { ChevronLeft } from "@mui/icons-material";
import { signin } from '../actions/auth';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { CircularProgress } from '@mui/material';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';


const EditCampaign = ({ autoInbound, handleEditSent }: { autoInbound: any, handleEditSent: any }) => {

    
    const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
    const [verifyingUserSession, setVerifyingUserSession] = useState(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(autoInbound.subject || '');
    const [companyName, setCompanyName] = useState(autoInbound.comapnyName || '');
    const [industry, setIndustry] = useState('');
    const [calendarLink, setCalendarLink] = useState(autoInbound.calendarLink || '');
    const [isLoading, setIsLoading] = useState(false);
    const [emailAccounts, setEmailAccounts] = useState<any>(null);
    const [emailAccountId, setEmailAccountId] = useState<string>("0");
    const [emailProvider, setEmailProvider] = useState<string>(autoInbound.provider || "");
    const [tone, setTone] = useState(autoInbound.tone || '');
    const [intent, setIntent] = useState(autoInbound.intent || '');
    const [services, setServices] = useState(autoInbound.services || '');
    const [autoInboundId, setAutoInboundId] = useState(autoInbound.services || '');
    const [name, setName] = useState<string>(autoInbound.userName || '');
    const [responseTime, setResponseTime] = useState<any>(autoInbound.responseTime || 330);

    // const [autoInbound, setAutoInbound] = useState<any>(null);

    const isValidated = useAppSelector((state: any) => state.user.isValidated);
    const userTokenFromSlice = useAppSelector((state: any) => state.user.token);


 
    async function retrieveInbound() {

        const data = await dispatch(getUserEmailAccounts(userToken));
        if (data.valid!==false) {
            setEmailAccounts(data.result);
        } else {
        
        }

    }

    useEffect(() => {
        retrieveInbound();
    
        setEmailAccountId(autoInbound.emailAccountId);
        setSubject(autoInbound.subjectLine);
        setCompanyName(autoInbound.companyName);
        setIndustry(autoInbound.industry);
        setCalendarLink(autoInbound.calendarLink);
        setEmailProvider(autoInbound.provider);
        setTone(autoInbound.tone);
        setIntent(autoInbound.intent);
        setServices(autoInbound.services);
        setResponseTime(autoInbound.responseTime);
        setAutoInboundId(autoInbound._id);
        setName(autoInbound.userName);
    }, [])
    


    async function submitEdit(){

        setIsLoading(true);

        if (industry==='' || industry==="Select your company's industry" || emailAccountId===undefined || tone==="Select the tone" || intent==="Select the intent" || services==="" ) {
            alert("Please don't leave any fields empty");
            setIsLoading(false);
            return;
        }
        
        const resp = await dispatch(editAutoInbound(userToken, autoInboundId, subject, calendarLink, industry, companyName, tone, intent, services, responseTime, name));
        if (resp.valid===true) {
            console.log('resp is', resp);
            setIsLoading(false);
            // navigate("/app");
        } else {
            setIsLoading(false);
        }
        handleEditSent();
    }

    const secondsToTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds} sec`;
    };


    return (
        <> 
            <div className="bg-gray-50 font-sans leading-normal tracking-normal pr-8 h-fit">
                {autoInbound===null ? <CircularProgress className="mx-20 my-20" style={{ color: '#000000' }} /> : 
                <div className="">
                    <div className="rounded px-12 pt-16 pb-10 mb-6">
                        <h2 className="text-black font-semibold text-4xl mb-4">
                            Let's edit your campaign
                        </h2>
                        <div className="text-gray-500 font-base text-md mb-2">
                            Automatically send hyper-personalized responses to inbound clients
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="">
                                {/* <label htmlFor="email-provider" className="text-lg block font-base font-medium text-gray-700">
                                    Email Account
                                </label>
                                <select
                                    id="email-provider"
                                    className="mt-2 block w-full py-3 px-4 border text-gray-600 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                    value={emailAccountId}
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        if (e.target.value !== undefined) {
                                            setEmailAccountId(e.target.value);
                                            const selectedEmail = emailAccounts.find((email: any) => email._id === e.target.value);
                                            if (selectedEmail) {
                                                setEmailAccount(selectedEmail.accountEmail);
                                                setEmailProvider(selectedEmail.provider);
                                                console.log('account email is', emailAccount);
                                            }
                                        }
                                    }}
                                >
                                    <option value={0}>Select your connected email account</option>
                                    {emailAccounts!==null ? emailAccounts.map((email: any, index: any) => (
                                        <option key={email._id} value={email._id}>
                                        {email.accountEmail}
                                        </option> 
                                    )) : null}

                                </select> */}
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-base font-medium text-gray-700">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="mt-2 p-3 block w-full border  shadow-sm text-base border-gray-300 rounded-lg"
                                    placeholder="e.g. Apple"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="text-lg block font-base font-medium text-gray-700 mt-2">
                                    Subject Line To Detect Contains
                                </label>
                                <label htmlFor="subject" className="text-xs block font-base font-medium text-gray-500">
                                    'Auto' makes ChatGPT scan your incoming emails and only respond to those that are new customers - used for emails not sent from a form on your website
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="mt-2 p-3 block w-4/5 border  shadow-sm text-base border-gray-300 text-gray-700 rounded-lg"
                                        placeholder="e.g. New Customer"
                                    />
                                    <button className={`w-1/5 mt-2 group border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-200 font-semibold rounded-xl border ${subject==="**Auto Detect Inbound**" ? "bg-green-500 text-white hover:bg-green-400" : "bg-gray-100"}`} onClick={()=>{ if (subject==="**Auto Detect Inbound**") {setSubject('')} else { setSubject('**Auto Detect Inbound**')} }}>
                                        Auto
                                    {/* <span className="hidden z-40 group-hover:block transition duration-150 absolute -mt-[69px] -right-32 bg-gray-900 px-2 py-1 text-gray-100 rounded-xl">If there's</span> */}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email-provider" className="block text-base font-medium text-gray-700 mt-6">
                                    Industry
                                </label>
                                <select
                                    id="email-provider"
                                    className="mt-2 block w-full py-3 px-4 border text-gray-600 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                >
                                    <option>Select your company's industry</option>
                                    <>
                                    <option>Marketing</option>
                                    <option>Design</option>
                                    <option>Software</option>
                                    <option>Real Estate</option>
                                    <option>Law Firm</option>
                                    </>
                                </select>
                                <div>
                                    <label htmlFor="tone" className="block text-base mt-6 font-medium text-gray-700">
                                        Tone
                                    </label>
                                    <select
                                        id="tone"
                                        className="mt-2 block w-full py-3 px-4 border text-gray-600 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                    >
                                        <option>Select the tone</option>
                                        <option>Friendly</option>
                                        <option>Professional</option>
                                        <option>Personal</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="intent" className="block text-base mt-6 font-medium text-gray-700">
                                        Intent
                                    </label>
                                    <select
                                        id="intent"
                                        className="mt-2 block w-full py-3 px-4 border text-gray-600 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                        value={intent}
                                        onChange={(e) => setIntent(e.target.value)}
                                    >
                                        <option>Select the intent</option>
                                        <option>To answer any questions</option>
                                        <option>To get a response from the client</option>
                                        <option>To book a call with the client</option>
                                        <option>Dynamic</option>
                                    </select>
                                </div>
                                {intent==="To book a call with the client" && <>
                                    <label htmlFor="subject" className="block text-base font-medium text-gray-700 mt-6">
                                        Link to Book a Call
                                    </label>
                                    <input
                                        type="text"
                                        id="calendar"
                                        name="calendarLink"
                                        value={calendarLink}
                                        onChange={(e) => setCalendarLink(e.target.value)}
                                        className="mt-2 p-3 block w-full border  shadow-sm text-base border-gray-300 rounded-lg"
                                        placeholder="e.g. https://calendly.com/zacyungblut"
                                    />
                                </>}
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full">

                                        <label htmlFor="subject" className="block text-base font-medium text-gray-700 mt-6">
                                            Services you offer
                                        </label>
                                        <textarea className="appearance-none block w-full bg-white mt-2 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-32 resize-none" onChange={(e) => setServices(e.target.value)} id="message" placeholder="e.g: We offer SEO, CPC, and digital marketing services to our clients" value={services}></textarea>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-base font-medium text-gray-700 mt-6">
                                        Sign off as
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`mt-2 p-3 block w-full border shadow-sm text-base border-gray-300 rounded-lg ${(name==='' || !name) ? '' : 'font-semibold'}`}
                                        placeholder="John"
                                    />
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="response-time" className="block text-base font-medium text-gray-700">
                                        Response Time
                                    </label>
                                    <div className="mt-4">
                                        <Slider
                                            id="response-time"
                                            min={60}
                                            max={600}
                                            step={30}
                                            value={responseTime}
                                            onChange={(e, value) => setResponseTime(value)}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => secondsToTime(value)}
                                            className="w-full"
                                        />
                                        <Typography className="text-gray-400 text-base mt-1">
                                            {secondsToTime(responseTime)}
                                        </Typography>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="flex gap-4 mt-12">
                                <Link to="/app" className="py-3 px-2 w-1/4 mt-4 rounded-xl text-gray-600 hover:text-gray-800 text-center font-semibold">
                                    <div onClick={() => {}}>
                                        Cancel
                                    </div>
                                </Link>
                                {isLoading ? <CircularProgress className="mx-auto my-auto" style={{ color: '#000000' }} /> : <div className="py-3 px-2 w-3/4 bg-red-600 cursor-pointer hover:shadow-md hover:bg-red-700 mt-4 rounded-xl text-white text-center font-semibold" onClick={submitEdit}>
                                    Save
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    </>
    )

};

export default EditCampaign;
