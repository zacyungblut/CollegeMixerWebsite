import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from "@mui/material/Divider";
import GmailLogo from "../assets/Google.png"; // Import the Gmail logo
import OutlookLogo from "../assets/Outlook.png";
import ZohoLogo from "../assets/Zoho.png";
import GmailLogo2 from "../assets/GmailLogo.png"; // Import the Gmail logo
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { getEmailThread } from '../actions/processedEmails';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';




const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

interface ProcessedEmail {
    _id: string;
    ownerEmail: string;
    subject: string;
    body: string;
    googleId?: string;
    outlookId?: string;
    fromEmail: string;
    toEmail: string;
    responseId?: string;
    timestamp: Date;
    hasResponse: boolean;
    isResponse: boolean;
    emailAccountId: string;
    autoInboundId: string;
    provider: string;
    id?: string;
    threadId?: string;
    parentEmailId?: string | null;
}

const EmailDetail = () => {
    const query = useQuery();
    const emailId = query.get('id');
    const dispatch = useAppDispatch();
    const [emailThread, setEmailThread] = useState<ProcessedEmail[]>([]);
    const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
    const [verifyingUserSession, setVerifyingUserSession] = useState(true);
    const [tryAttempt, setTryAttempt] = useState(0);
    const navigate = useNavigate();
    const isValidated = useAppSelector((state: any) => state.user.isValidated);
    const userTokenFromSlice = useAppSelector((state: any) => state.user.token);



    // Dummy email object
    const email = {
        subject: "Meeting tomorrow",
        from: "John Doe <john@example.com>",
        timestamp: "2023-04-27T12:01:38",
        body: `Hi there,

        Just wanted to remind you about the meeting we have scheduled tomorrow at 10 am. Please make sure to have all the necessary documents ready.

        Best,
        John`
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

    async function tryVerify() {

        // if (isValidated && userTokenFromSlice) {return}

        if (emailId===null) {navigate("/app?page=master-inbox"); return;}
        console.log('email id is', emailId);
    
        // Add the promise to the toast
        toast.promise(
            dispatch(getEmailThread(userToken, emailId)).then(resp => {
                setEmailThread(resp.result);
                if (resp.valid===true) {
                    setVerifyingUserSession(false);
                } else {
                    setTryAttempt(tryAttempt+1);
                    if (tryAttempt > 0) {
                        localStorage.removeItem('profile');
                        navigate('/login');
                    }
                }
    
                // Return the response to fulfill the Promise
                return resp;
            }),
            {
                pending: 'Fetching your email...',
                success: 'Loaded the email!',
                error: 'Error',
            },
            {
                toastId: 'fetchEmail',
                theme: "light",
                position: "bottom-left",
                autoClose: 2000,
            }
        );
    }

      useEffect(() => {
        if (userToken!=='') {
          tryVerify();
      } else {
        navigate("/login")
      }
      }, [])
      

      return (
        <>
            <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-full">
                {emailThread.length === 0 ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <CircularProgress style={{ color: "#B24544" }} />
                    </div>
                    ) : null
                }                
                <div className="relative h-full">
                    <Link to="/app?page=master-inbox">
                        <button className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded shadow">
                            <ChevronLeftIcon className="-mt-0.5" />
                            Back
                        </button>
                    </Link>
                    <div className="-mt-4">
                      {
                      emailThread.map((email, index) => (
                        <div className={`w-full max-w-3xl mx-auto my-4 pt-10`} key={email._id}>
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-center my-4">
                                    {email.provider==="Google" ? <img src={GmailLogo} className="h-6 w-6 mr-2" alt="Gmail logo" /> : null}
                                    {email.provider==="Outlook" ? <img src={OutlookLogo} className="h-6 w-6 mr-2" alt="Outlook logo" /> : null}
                                    {email.provider==="Zoho" ? <img src={ZohoLogo} className="h-6 w-6 mr-2" alt="Zoho logo" /> : null}
                                    {email.provider==="GoogleAppPassword" ? <img src={GmailLogo2} className="h-6 w-6 mr-2" alt="Gmail logo" /> : null}
                                    <h2 className="text-xl font-semibold ml-2">{email.subject}</h2>
                                </div>
                                <Divider className="my-4" />
                                {/* <h3 className="text-lg font-semibold mt-2">{email.subject}</h3> */}
                                <div className="text-gray-600 mt-2">{email.fromEmail}</div>
                                <div className="text-gray-500 mt-1 mb-2">{formatDate(email.timestamp)}</div>
                                <Divider className="my-4" />
                                <p className="whitespace-pre-wrap mt-2">{email.body}</p>
                            </div>
                        </div>
                      ))}
                    </div>
                </div>
            </div>
        </>
    );

};

export default EmailDetail;
