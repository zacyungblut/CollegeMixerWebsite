import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CalendlyLogo from "../assets/Calendly.png";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { createAutoInbound, outlookActivateAutoInbound, googleActivateAutoInbound } from '../actions/autoInbound';
import { verify, getUserEmailAccounts, getUser, updateUser } from '../actions/auth';
import { ChevronLeft } from "@mui/icons-material";
import { signin } from '../actions/auth';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { CircularProgress } from '@mui/material';
import Slider from '@mui/material/Slider';
import { toast } from 'react-toastify';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IntentImg from "../assets/Intent.svg";
import MatrixImg from "../assets/Matrix.png";
import HelperPopup from "./HelperPopup";
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import ZohoLogo from "../assets/Zoho.png";
import GmailLogo2 from "../assets/GmailLogo.png";
import SpeedIcon from '@mui/icons-material/Speed';
import Rocket from "../assets/Rocket.png";
import Notepad from "../assets/Notepad.png";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';



const CreateCampaign = () => {

    const [step, setStep] = useState(1);
    const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
    const [verifyingUserSession, setVerifyingUserSession] = useState(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [ name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [calendarLink, setCalendarLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailAccount, setEmailAccount] = useState<any>('');
    const [emailAccounts, setEmailAccounts] = useState<any>(null);
    const [emailAccountId, setEmailAccountId] = useState<string>("0");
    const [emailProvider, setEmailProvider] = useState<string>("");
    const [tone, setTone] = useState('Friendly');
    const [intent, setIntent] = useState('');
    const [responseTime, setResponseTime] = useState<any>(330);
    const [questions, setQuestions] = useState([{'question': '', 'answer': ''}]);
    const [displayedQuestion, setDisplayedQuestion] = useState(0);
    const isValidated = useAppSelector((state: any) => state.user.isValidated);
    const userTokenFromSlice = useAppSelector((state: any) => state.user.token);
    const [isOpen, setIsOpen] = useState(true);
    const [farewell, setFarewell] = useState('');
    const [packages, setPackages] = useState<any>([{name: '', price: ''}, {name: '', price: ''}, {name: '', price: ''}]);
    const [services, setServices] = useState([
        {name: 'SEO', enabled: false, industry: 'Marketing', desc: 'Do you offer Search Engine Optimization services to your clients?'}, 
        {name: 'PPC', enabled: false, industry: 'Marketing', desc: 'Do you offer Pay Per Click services to your clients?'}, 
        {name: 'Content Marketing', enabled: false, industry: 'Marketing', desc: 'Do you offer Content Marketing services to your clients?'}, 
        {name: 'Social Media Marketing', enabled: false, industry: 'Marketing', desc: 'Do you offer Social Media Marketing services to your clients?'}, 
        {name: 'Email Marketing', enabled: false, industry: 'Marketing', desc: 'Do you offer Email Marketing services to your clients?'}, 
        {name: 'Web Design', enabled: false, industry: 'Marketing', desc: 'Do you offer Web Design services to your clients?'},
        {name: 'Logo Design', enabled: false, idustryt: 'Design', desc: 'Do you offer Logo Design services to your clients?'}, 
        {name: 'Website Design', enabled: false, industry: 'Design', desc: 'Do you offer Website Design services to your clients?'}, 
        {name: 'Branding and Identity', enabled: false, industry: 'Design', desc: 'Do you offer Branding and Identity services to your clients?'}, 
        {name: 'Product Design', enabled: false, industry: 'Design', desc: 'Do you offer Product Design services to your clients?'}, 
        {name: 'Graphic Design', enabled: false, industry: 'Design', desc: 'Do you offer Graphic Design services to your clients?'}, 
        {name: 'UI/UX Design', enabled: false, industry: 'Design', desc: 'Do you offer UI/UX Design services to your clients?'},
        {name: 'Residential Sales', enabled: false, industry: 'Real Estate', desc: 'Do you offer Residential Sales services to your clients?'}, 
        {name: 'Commercial Sales', enabled: false, industry: 'Real Estate', desc: 'Do you offer Commercial Sales services to your clients?'}, 
        {name: 'Property Management', enabled: false, industry: 'Real Estate', desc: 'Do you offer Property Management services to your clients?'}, 
        {name: 'Real Estate Appraisal', enabled: false, industry: 'Real Estate', desc: 'Do you offer Real Estate Appraisal services to your clients?'}, 
        {name: 'Real Estate Consultation', enabled: false, industry: 'Real Estate', desc: 'Do you offer Real Estate Consultation services to your clients?'}, 
        {name: 'Leasing Services', enabled: false, industry: 'Real Estate', desc: 'Do you offer Leasing Services to your clients?'},
        {name: 'Contract Law', enabled: false, intent: 'Legal Services', desc: 'Do you offer Contract Law services to your clients?'}, 
        {name: 'Family Law', enabled: false, intent: 'Legal Services', desc: 'Do you offer Family Law services to your clients?'}, 
        {name: 'Corporate Law', enabled: false, intent: 'Legal Services', desc: 'Do you offer Corporate Law services to your clients?'}, 
        {name: 'Litigation', enabled: false, intent: 'Legal Services', desc: 'Do you offer Litigation services to your clients?'}, 
        {name: 'Intellectual Property Law', enabled: false, intent: 'Legal Services', desc: 'Do you offer Intellectual Property Law services to your clients?'}, 
        {name: 'Estate Planning', enabled: false, intent: 'Legal Services', desc: 'Do you offer Estate Planning services to your clients?'},
        {name: 'Event Photography', enabled: false, intent: 'Photography', desc: 'Do you offer Event Photography services to your clients?'}, 
        {name: 'Portrait Photography', enabled: false, intent: 'Photography', desc: 'Do you offer Portrait Photography services to your clients?'}, 
        {name: 'Product Photography', enabled: false, intent: 'Photography', desc: 'Do you offer Product Photography services to your clients?'}, 
        {name: 'Wedding Photography', enabled: false, intent: 'Photography', desc: 'Do you offer Wedding Photography services to your clients?'}, 
        {name: 'Fashion Photography', enabled: false, intent: 'Photography', desc: 'Do you offer Fashion Photography services to your clients?'}, 
        {name: 'Real Estate Photography', enabled: false, intent: 'Photography', desc: 'Do you offer Real Estate Photography services to your clients?'},
        {name: 'Custom Software Development', enabled: false, intent: 'Software', desc: 'Do you offer Custom Software Development services to your clients?'}, 
        {name: 'Mobile App Development', enabled: false, intent: 'Software', desc: 'Do you offer Mobile App Development services to your clients?'}, 
        {name: 'Software Testing', enabled: false, intent: 'Software', desc: 'Do you offer Software Testing services to your clients?'}, 
        {name: 'Software Integration', enabled: false, intent: 'Software', desc: 'Do you offer Software Integration services to your clients?'}, 
        {name: 'Cloud Services', enabled: false, intent: 'Software', desc: 'Do you offer Cloud Services to your clients?'}, 
        {name: 'IT Consulting', enabled: false, intent: 'Software', desc: 'Do you offer IT Consulting services to your clients?'},

    ]);


 
    async function tryVerify() {

        if (isValidated && userTokenFromSlice) {return}


        const resp = await dispatch(verify(userToken));
        if (resp.valid===true) {
          setVerifyingUserSession(false);
        } else {
          localStorage.removeItem('profile');
          navigate('/login');
        }

        toast.promise(
            dispatch(getUserEmailAccounts(userToken)).then(data => {
        if (data.valid===true) {
            if (data.result.length===0) {navigate("/app/connect"); return;}
            setEmailAccounts(data.result);
            console.log('settings email accounts');
        } else {
            alert("Couldn't fetch your email accounts...");
            navigate("/app");
        }
        }), {
            pending: 'Fetching your email accounts...',
            success: 'Found your email accounts!',
            error: 'Error',
          },
          {
            toastId: 'fetchEmail',
            theme: "light",
            position: "bottom-left",
            autoClose: 2000,
          }
        );

        const resp2 = await dispatch(getUser(userToken));
        if (resp2.valid===true) {
            setName(resp2.result.name);
        }

    }

    useEffect(() => {
    if (userToken!=='') {
        tryVerify();
    } else {
    navigate("/login")
    }
    }, [])

    function nextPage() {
    if (subject==='' || emailAccountId==='0' || companyName==='') {
        alert("Please complete all fields");
        return;
    } else {
        setIsOpen(false);
        setStep(2);
    }
    }

    async function submitCreate(){
        setIsLoading(true);
        
        if (industry==='' || industry==="Select your company's industry" || emailAccountId===undefined || tone==="Select the tone" || intent==="Select the intent" || name==="" || farewell==="" ) {
            alert("Please complete all fields");
            setIsLoading(false);
            return;
        }

        if (packages.some((item: any) => {item.name === '' || item.price === ''})) {
            alert("Please complete all fields in your packages");
            setIsLoading(false);
            return;
        }


        var servicesLocal = services.filter(service => service.enabled).map(service => service.name).join(', ');

        var questionsLocal = '';

        if (questions.length > 0) {
            questionsLocal = `Whats your company name? ${companyName}`;
        } else {
            questionsLocal = questions.map((question: any, index: any) => `Question ${index + 1}: ${question.question}, Answer: ${question.answer}`).join(' | '); 
        }

        var packagesLocal = '';

        if (packages.length===0) {
            packagesLocal = `Case-by-Case Basis`;
        } else {
            packagesLocal = packages.map((pkg: any, index: any) => `Name ${index + 1}: ${pkg.name}, Price: ${pkg.price}`).join(' | '); 
        }

        toast.promise(
            dispatch(createAutoInbound(userToken, emailAccountId, subject, calendarLink, industry, companyName, emailAccount, tone, intent, servicesLocal, responseTime, name, questionsLocal, farewell, packagesLocal)).then(resp => {
                if (resp.valid===true && resp.id) {
                    console.log('resp is', resp);
                    navigate(`/app/campaign/test?id=${resp.id}`);
                } else {
                    setIsLoading(false);
                    return;
                }
                const resp2 = dispatch(updateUser(userToken, {name: name}));
        
            }),
            {
                pending: 'Creating...',
                success: 'Successfuly created your Auto-Inbound!',
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

    useEffect(() => {

    }, [])
    


    const CreateHelperPopup = () => {

        return (
            <div className={`fixed bottom-14 right-4 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-y-10' : 'translate-y-full'}`}>
            {!isOpen && (
                <button
                onClick={()=>setIsOpen(!isOpen)}
                className={`bg-white text-black px-4 py-2 rounded hover:bg-gray-100 font-semibold focus:outline-none shadow shadow-green-600 border-green-600 border-[1px] `}
                >
                <img
                    src={Notepad}
                    className="w-6 -mt-3 h-auto inline mr-4 justify-center items-center"
                ></img>
                {isOpen ? 'Close' : 'Creation Checklist'}
                </button>
            )}
            {isOpen && (
                <div className="bg-white opacity-100 mt-2 p-6 rounded w-64 relative shadow shadow-green-600 border-green border-[1px]">
                <button
                    onClick={()=>setIsOpen(!isOpen)}
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-600 focus:outline-none py-0.5 px-2 rounded-full bg-gray-50 hover:bg-gray-100 "
                >
                    &times;
                </button>
                <div className="flex"><SpeedIcon className="mr-2 -mt-0.5" fontSize="large" /><h2 className="text-2xl mb-2 mx-2 font-semibold">Steps</h2></div>
                {/* <h3 className="text-sm text-gray-700">Complete these steps to get started skyrocketing your conversion rate! <img className="inline ml-1 -mt-0.5 h-5 w-auto" src={Rocket} /></h3> */}
                <ol className="list-decimal list-inside mt-2 text-sm text-gray-600 mb-4">
                    <div className="underline cursor-pointer flex justify-between font-semibold text-md py-2 text-gray-800 hover:text-gray-600">
                    <div>1. Select campaign email</div><div className="flex">
                    {emailAccount==='' ? <CheckBoxOutlineBlankIcon fontSize="medium" /> : <CheckBoxIcon fontSize="medium" style={{ color: '#4ade80' }} />}</div>
                    </div>
                    <div className="py-2 underline cursor-pointer flex justify-between font-semibold text-md text-gray-800 hover:text-gray-600">
                    <div>2. Set company name</div><div className="flex">
                    {companyName==='' ? <CheckBoxOutlineBlankIcon fontSize="medium" /> : <CheckBoxIcon fontSize="medium" style={{ color: '#4ade80' }} />}</div>
                    </div>         
                    <div className="underline cursor-pointer flex justify-between font-semibold text-md py-2 text-gray-800 hover:text-gray-600">
                    <div>3. Choose subject line</div><div className="flex">
                    {subject==='' ? <CheckBoxOutlineBlankIcon fontSize="medium" /> : <CheckBoxIcon fontSize="medium" style={{ color: '#4ade80' }} />}</div>
                    </div>
                    <div className="underline cursor-pointer flex justify-between font-semibold text-md py-2 text-gray-800 hover:text-gray-600">
                    <div>4. Select industry</div><div className="flex">
                    {industry==='' ? <CheckBoxOutlineBlankIcon fontSize="medium" /> : <CheckBoxIcon fontSize="medium" style={{ color: '#4ade80' }} />}</div>
                    </div>
                    <div className="underline cursor-pointer flex justify-between font-semibold text-md py-2 text-gray-800 hover:text-gray-600">
                    <div>5. Choose intent(s)</div><div className="flex">
                    {intent==='' ? <CheckBoxOutlineBlankIcon fontSize="medium" /> : <CheckBoxIcon fontSize="medium" style={{ color: '#4ade80' }} />}</div>
                    </div>
                    <div className="underline cursor-pointer flex justify-between font-semibold text-md py-2 text-gray-800 hover:text-gray-600">
                    <div>6. Add services</div><div className="flex">
                    {services[0].enabled===false ? <CheckBoxOutlineBlankIcon fontSize="medium" /> : <CheckBoxIcon fontSize="medium" style={{ color: '#4ade80' }} />}</div>
                    </div>
                </ol>
                <Divider className="" />
                <div className="text-center mt-4 font-medium text-gray-600">Got questions? We've got answers.</div>
                <Link className="" to="/contact"><div className="p-2 mt-4 font-medium mb-1 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-150 text-center text">Reach Out</div></Link>
                </div>
                )}
            </div>
        );
    }



    if (step===1) return (
        <>

        <div className="bg-gray-50 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-fit">
        {<CreateHelperPopup />}
            <div className="relative h-full">
            <Link to="/app">
                <button className="hidden md:block absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded shadow">
                <ChevronLeftIcon className="-mt-0.5" />
                Back
                </button>
            </Link>
            <div className="w-7/12 mx-auto">
                <div className="rounded px-12 pt-8 pb-10 mb-6">
                    <h2 className="text-black text-center font-semibold text-5xl mt-10 mb-4">
                        Let's create a new response
                    </h2>
                    <div className="text-gray-500 text-center font-base text-md">
                        Automatically send hyper-personalized responses to inbound clients
                    </div>
                    {/* <img className="mx-auto h-24 w-auto my-6" src={CreateCar} /> */}
                    <div className="grid grid-cols-1 gap-4 mt-8">
                        <div className="flex justify-between gap-4">
                            <div className="w-1/2 bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-150">
                                <div className="flex justify-between">

                                    <label htmlFor="email-provider" className="text-2xl block font-semibold text-gray-700">
                                        Email Account
                                    </label>
                                </div>

                                <div className="flex flex-col gap-3 mt-10">
                                    {emailAccounts!==null ? emailAccounts.map((email: any, index: any) => (
                                        <div key={email._id} className={`p-2 w-full flex justify-between font-medium rounded-lg px-4 ${emailAccountId===email._id ? 'bg-gray-600 text-white shadow-md shadow-gray-300' : 'bg-gray-100 text-gray-800 bg-opacity-30 hover:bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`} onClick={()=>{
                                            setEmailAccountId(email._id);
                                            const selectedEmail = emailAccounts.find((mail: any) => mail._id === email._id);
                                            if (selectedEmail) {
                                                setEmailAccount(selectedEmail.accountEmail);
                                                setEmailProvider(selectedEmail.provider);
                                                console.log('account email is', emailAccount);
                                            }
                                        }}>
                                            <div className="flex flex-row">
                                                <div className="my-auto">
                                                    {email.provider==="Google" ? <img src={GmailLogo} className=" h-4 w-4 mr-4" alt="Gmail"></img>
                                                    : email.provider==="Outlook" ? <img src={OutlookLogo} className="h-4 w-4 mr-4" alt="Outlook"></img>
                                                    : email.provider==="Zoho" ? <img src={ZohoLogo} className="h-4 w-4 mr-4" alt="Zoho"></img>
                                                    : email.provider==="GoogleAppPassword" ? <img src={GmailLogo2} className="h-4 w-4 mr-4" alt="Zoho"></img>
                                                    : null
                                                    }
                                                </div>
                                                <span className="font-semibold">{email.accountEmail}</span>
                                            </div>
                                            {emailAccountId===email._id ? <CheckCircleIcon style={{ color: '#ffffff' }} /> :<RadioButtonUncheckedIcon className="" />}
                                        </div>
                                    )) : 
                                    <div>
                                        <div className={`p-2 w-full flex justify-between animate-pulse h-5 font-medium rounded-lg px-4bg-gray-100 text-gray-800 bg-opacity-30 bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>

                                        </div>
                                        <div className={`p-2 w-full my-3 flex justify-between animate-pulse h-5 font-medium rounded-lg px-4bg-gray-100 text-gray-800 bg-opacity-30 bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>
                                
                                        </div>
                                        <div className={`p-2 w-full flex justify-between animate-pulse h-5 font-medium rounded-lg px-4bg-gray-100 text-gray-800 bg-opacity-30 bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>
                                
                                        </div>
                                    </div>
                                    }

                                </div>

                            </div>
                            <div className="w-1/2 bg-white rounded-xl p-8 shadow-lg  hover:shadow-xl transition duration-150">
                                <div className="flex justify-between">
                                    <label htmlFor="subject" className="text-2xl block font-semibold text-gray-700">
                                        Company Name
                                    </label>
                                    {/* <StoreIcon fontSize="large" /> */}
                                </div>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="mt-10 p-3 block shadow-md leading-tight w-full border  text-base border-gray-300 rounded-lg"
                                    placeholder="e.g. Apple"
                                />
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-white rounded-xl p-8 shadow-lg  hover:shadow-xl transition duration-150">
                            <label htmlFor="subject" className="text-2xl mt-2 mb-2 block font-semibold text-gray-700">
                                Subject Line To Detect Contains
                            </label>
                            <label htmlFor="subject" className="mb-1 text-xs block font-base font-medium text-gray-400">
                                'Auto' makes ChatGPT scan your incoming emails and only respond to those that are new customers - scan emails coming to (hello@yourwebsite.com)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="mt-10 p-3 block w-4/5 border shadow-md text-base border-gray-300 text-gray-700 rounded-lg"
                                    placeholder="e.g. New Customer"
                                />
                                <button className={`w-1/5 mt-10 group border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-200 font-semibold rounded-xl border ${subject==="**Auto Detect Inbound**" ? "bg-green-500 text-white hover:bg-green-400" : "bg-gray-100"}`} onClick={()=>{ if (subject==="**Auto Detect Inbound**") {setSubject('')} else { setSubject('**Auto Detect Inbound**')} }}>
                                    Auto
                                {/* <span className="hidden z-40 group-hover:block transition duration-150 absolute -mt-[69px] -right-32 bg-gray-900 px-2 py-1 text-gray-100 rounded-xl">If there's</span> */}
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-12">
                            <Link to="/app" className="py-3 px-2 w-1/4 mt-4 rounded-xl text-gray-600 hover:text-gray-800 text-center font-semibold">
                                <div onClick={() => {}}>
                                    Cancel
                                </div>
                            </Link>
                            <div className="shadow-md shadow-gray-300 py-3 px-2 w-3/4 bg-gray-600 cursor-pointer hover:shadow-2xl transition duration-150 hover:bg-gray-700 mt-4 rounded-xl text-white text-center font-semibold" onClick={nextPage}>
                                Next
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    </>

    )

    const setIntentFunc = (intentLocal: string) => {
        console.log('setting', intentLocal, intent);
        if (intentLocal==="Book a Call" && intent==="Answer Questions") {
            setIntent("Both")
            return;
        } else if (intentLocal==="Answer Questions" && intent==="Book a Call") {
            setIntent("Both")
            return;
        } else if (intentLocal==="Answer Questions" && intent==="Answer Questions") {
            setIntent("")
            return;
        } else if (intentLocal==="Book a Call" && intent==="Book a Call") {
            setIntent("")
            return;
        } else if (intentLocal==="Answer Questions" && intent==="") {
            setIntent("Answer Questions")
            return;
        } else if (intentLocal==="Book a Call" && intent==="") {
            setIntent("Book a Call")
            return;
        } else if (intentLocal==="Book a Call" && intent==="Both") {
            setIntent("Answer Questions")
            return;
        } else if (intentLocal==="Answer Questions" && intent==="Both") {
            setIntent("Book a Call")
            return;
        } else {
            setIntent(intentLocal);
            return;
        }
    }

    const deleteQuestion = () => {
        if (questions.length > 1) {
            const newQuestions = [...questions];
            newQuestions.splice(displayedQuestion, 1);
            setQuestions(newQuestions);
            if (displayedQuestion >= newQuestions.length) {
            setDisplayedQuestion(newQuestions.length - 1);
            }
        } else {
            setQuestions([{'question': '', 'answer': ''}]);
        }
    }
        

    const addQuestion = () => {
        if (questions.length > 4) {
            alert("You can only have 5 questions on your current plan");
            return;
        }
        setQuestions([...questions, { 'question': '', 'answer': '' }]);
        setDisplayedQuestion(questions.length);
    }
        

    const backQuestion = () => {
        if (displayedQuestion > 0) {
            setDisplayedQuestion(displayedQuestion - 1);
        }
    }

    const toggleService = (index: any) => {
        const newServices = [...services];
        newServices[index].enabled = !newServices[index].enabled;
        setServices(newServices);
    };



    const resetServices = () => {
        setServices([
            {name: 'SEO', enabled: false, industry: 'Marketing', desc: 'Do you offer Search Engine Optimization services to your clients?'}, 
            {name: 'PPC', enabled: false, industry: 'Marketing', desc: 'Do you offer Pay Per Click services to your clients?'}, 
            {name: 'Content Marketing', enabled: false, industry: 'Marketing', desc: 'Do you offer Content Marketing services to your clients?'}, 
            {name: 'Social Media Marketing', enabled: false, industry: 'Marketing', desc: 'Do you offer Social Media Marketing services to your clients?'}, 
            {name: 'Email Marketing', enabled: false, industry: 'Marketing', desc: 'Do you offer Email Marketing services to your clients?'}, 
            {name: 'Brand Strategy', enabled: false, industry: 'Marketing', desc: 'Do you offer Brand Strategy services to your clients?'},
            {name: 'Logo Design', enabled: false, idustryt: 'Design', desc: 'Do you offer Logo Design services to your clients?'}, 
            {name: 'Website Design', enabled: false, industry: 'Design', desc: 'Do you offer Website Design services to your clients?'}, 
            {name: 'Branding and Identity', enabled: false, industry: 'Design', desc: 'Do you offer Branding and Identity services to your clients?'}, 
            {name: 'Product Design', enabled: false, industry: 'Design', desc: 'Do you offer Product Design services to your clients?'}, 
            {name: 'Graphic Design', enabled: false, industry: 'Design', desc: 'Do you offer Graphic Design services to your clients?'}, 
            {name: 'UI/UX Design', enabled: false, industry: 'Design', desc: 'Do you offer UI/UX Design services to your clients?'},
            {name: 'Residential Sales', enabled: false, industry: 'Real Estate', desc: 'Do you offer Residential Sales services to your clients?'}, 
            {name: 'Commercial Sales', enabled: false, industry: 'Real Estate', desc: 'Do you offer Commercial Sales services to your clients?'}, 
            {name: 'Property Management', enabled: false, industry: 'Real Estate', desc: 'Do you offer Property Management services to your clients?'}, 
            {name: 'Real Estate Appraisal', enabled: false, industry: 'Real Estate', desc: 'Do you offer Real Estate Appraisal services to your clients?'}, 
            {name: 'Real Estate Consultation', enabled: false, industry: 'Real Estate', desc: 'Do you offer Real Estate Consultation services to your clients?'}, 
            {name: 'Leasing Services', enabled: false, industry: 'Real Estate', desc: 'Do you offer Leasing Services to your clients?'},
            {name: 'Contract Law', enabled: false, industry: 'Legal Services', desc: 'Do you offer Contract Law services to your clients?'}, 
            {name: 'Family Law', enabled: false, industry: 'Legal Services', desc: 'Do you offer Family Law services to your clients?'}, 
            {name: 'Corporate Law', enabled: false, industry: 'Legal Services', desc: 'Do you offer Corporate Law services to your clients?'}, 
            {name: 'Litigation', enabled: false, industry: 'Legal Services', desc: 'Do you offer Litigation services to your clients?'}, 
            {name: 'Intellectual Property Law', enabled: false, industry: 'Legal Services', desc: 'Do you offer Intellectual Property Law services to your clients?'}, 
            {name: 'Estate Planning', enabled: false, industry: 'Legal Services', desc: 'Do you offer Estate Planning services to your clients?'},
            {name: 'Event Photography', enabled: false, industry: 'Photography', desc: 'Do you offer Event Photography services to your clients?'}, 
            {name: 'Portrait Photography', enabled: false, industry: 'Photography', desc: 'Do you offer Portrait Photography services to your clients?'}, 
            {name: 'Product Photography', enabled: false, industry: 'Photography', desc: 'Do you offer Product Photography services to your clients?'}, 
            {name: 'Wedding Photography', enabled: false, industry: 'Photography', desc: 'Do you offer Wedding Photography services to your clients?'}, 
            {name: 'Fashion Photography', enabled: false, industry: 'Photography', desc: 'Do you offer Fashion Photography services to your clients?'}, 
            {name: 'Real Estate Photography', enabled: false, industry: 'Photography', desc: 'Do you offer Real Estate Photography services to your clients?'},
            {name: 'Custom Software Development', enabled: false, industry: 'Software', desc: 'Do you offer Custom Software Development services to your clients?'}, 
            {name: 'Mobile App Development', enabled: false, industry: 'Software', desc: 'Do you offer Mobile App Development services to your clients?'}, 
            {name: 'Software Testing', enabled: false, industry: 'Software', desc: 'Do you offer Software Testing services to your clients?'}, 
            {name: 'No-Code App Development', enabled: false, industry: 'Software', desc: 'Do you offer No-Code App Development services to your clients?'}, 
            {name: 'Cloud Services', enabled: false, industry: 'Software', desc: 'Do you offer Cloud Services to your clients?'}, 
            {name: 'IT Consulting', enabled: false, industry: 'Software', desc: 'Do you offer IT Consulting services to your clients?'},
        ]);
    }

    const addPackage = () => {
        if (packages.length >= 9) {
            alert("You've reached the maximum number of packages allowed.");
            return;
        }
        setPackages([...packages, { name: '', price: '' }]);
    }
    
    const deletePackage = (index: any) => {
        const newPackages = [...packages];
        newPackages.splice(index, 1);
        setPackages(newPackages);
    }

    const secondsToTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds} sec`;
    };

    if (step===2) return (
        <>
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 font-sans leading-normal tracking-normal min-h-screen max-w-screen h-fit">
            {<CreateHelperPopup />}
                <div className="relative h-full">
                    <button onClick={()=>setStep(1)} className="hidden md:block mt-4 ml-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 pr-4 pl-2 border border-gray-400 rounded shadow">
                    <ChevronLeftIcon className="-mt-0.5" />
                    Back
                    </button>
                    <div className="">
                        <div className="rounded px-12 pb-10 mb-6 pt-20">
                            <h2 className="text-black text-center font-semibold text-5xl mb-4">
                                Personalize your response
                            </h2>
                            <div className="text-gray-500 text-center font-base text-md">
                                Ensure ChatGPT responds in a way that reflects your business
                            </div>
                            
                            <div className="md:flex md:flex-row gap-2 justify-between md:w-3/4 mx-auto mt-10">
                                <div className="rounded-lg md:w-1/2 p-8 shadow-md hover:shadow-lg transition duration-150 bg-white flex-grow flex-shrink mr-2">
                                    <h1 className="font-semibold text-xl mb-5">Industry</h1>
                                    <div className="flex flex-col gap-3">
                                        <div onClick={()=>{setIndustry("Marketing"); resetServices();}} className={`p-2 w-full flex justify-between font-medium rounded-lg px-4 ${industry==="Marketing" ? 'bg-green-400 text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-800 bg-opacity-30 hover:bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>
                                            <span className="font-semibold">Marketing</span>
                                            {industry==="Marketing" ? <CheckCircleIcon style={{ color: '#ffffff' }} /> :<RadioButtonUncheckedIcon className="" />}
                                        </div>
                                        <div onClick={()=>{setIndustry("Design"); resetServices();}} className={`p-2 w-full flex justify-between font-medium rounded-lg px-4 ${industry==="Design" ? 'bg-green-400 text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-800 bg-opacity-30 hover:bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>
                                            <span className="font-semibold">Design</span>
                                            {industry==="Design" ? <CheckCircleIcon style={{ color: '#ffffff' }} /> :<RadioButtonUncheckedIcon className="" />}
                                        </div>
                                        <div onClick={()=>{setIndustry("Real Estate"); resetServices();}} className={`p-2 w-full flex justify-between font-medium rounded-lg px-4 ${industry==="Real Estate" ? 'bg-green-400 text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-800 bg-opacity-30 hover:bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>
                                            <span className="font-semibold">Real Estate</span>
                                            {industry==="Real Estate" ? <CheckCircleIcon style={{ color: '#ffffff' }} /> :<RadioButtonUncheckedIcon className="" />}
                                        </div>
                                        <div onClick={()=>{setIndustry("Legal Services"); resetServices();}} className={`p-2 w-full flex justify-between font-medium rounded-lg px-4 ${industry==="Legal Services" ? 'bg-green-400 text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-800 bg-opacity-30 hover:bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>
                                            <span className="font-semibold">Legal Services</span>
                                            {industry==="Legal Services" ? <CheckCircleIcon style={{ color: '#ffffff' }} /> :<RadioButtonUncheckedIcon className="" />}
                                        </div>
                                        <div onClick={()=>{setIndustry("Photography"); resetServices();}} className={`p-2 w-full flex justify-between font-medium rounded-lg px-4 ${industry==="Photography" ? 'bg-green-400 text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-800 bg-opacity-30 hover:bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>
                                            <span className="font-semibold">Photography</span>
                                            {industry==="Photography" ? <CheckCircleIcon style={{ color: '#ffffff' }} /> :<RadioButtonUncheckedIcon className="" />}
                                        </div>
                                        <div onClick={()=>{setIndustry("Software"); resetServices();}} className={`p-2 w-full flex justify-between font-medium rounded-lg px-4 ${industry==="Software" ? 'bg-green-400 text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-800 bg-opacity-30 hover:bg-gray-200 hover:bg-opacity-100 border'} hover:border-1 hover:shadow transition duration-150 cursor-pointer`}>
                                            <span className="font-semibold">Software</span>
                                            {industry==="Software" ? <CheckCircleIcon style={{ color: '#ffffff' }} /> :<RadioButtonUncheckedIcon className="" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg mt-8 md:mt-0 md:w-1/2 p-8 shadow-md hover:shadow-lg transition duration-150 bg-white flex-grow flex-shrink mr-2">
                                    <h1 className="font-semibold text-xl mb-5">Intent</h1>
                                    {/* <h3 className=" text-sm text-gray-400 mb-4">Select as many as needed.</h3> */}
                                    <div className="flex flex-row gap-3 mx-auto items-center justify-center pb-6">
                                        <div onClick={()=>{setIntentFunc("Book a Call")}} className={`w-1/2 text-center px-5 py-2 ${intent==="Book a Call" || intent==="Both" ? 'bg-green-400 shadow-xl shadow-green-100 text-white' : 'bg-gray-100 hover:bg-gray-200'} rounded-3xl font-semibold cursor-pointer transition duration-150`}>Book a Call</div>
                                        <div onClick={()=>{setIntentFunc("Answer Questions")}} className={`w-1/2 text-center px-5 py-2 ${intent==="Answer Questions" || intent==="Both" ? 'bg-green-400 shadow-xl shadow-green-100 text-white' : 'bg-gray-100 hover:bg-gray-200'} rounded-3xl font-semibold cursor-pointer transition duration-150`}>Answer Questions</div>
                                    </div>

                                    <img className={`px-28 py-10 bg-gray-100 hover:bg-gray-200 opacity-30 border rounded-xl mx-auto ${intent==="" ? '' : 'hidden'} `} src={IntentImg} />

                                    <div className={`mt-8 mb-2 text-md font-semibold text-gray-400 ${intent==="Book a Call" || intent==="Both" ? '' : 'hidden'}`}>Link to book a call</div>
                                    <div className={`flex flex-row ${intent==="Book a Call" || intent==="Both" ? '' : 'hidden'}`}>
                                        <img className="w-auto h-8 my-auto mr-4" src={CalendlyLogo} />
                                        <input
                                            type="text"
                                            id="calendarLink"
                                            name="calendarLink"
                                            value={calendarLink}
                                            onChange={(e) => setCalendarLink(e.target.value)}
                                            className="mt-2 mb-2 p-3 block w-full border  shadow-sm text-base border-gray-300 rounded-lg"
                                            placeholder="e.g. https://calendly.com/zacyungblut"
                                        />
                                    </div>
                                    <div className={`${intent==="Answer Questions" || intent==="Both" ? '' : 'hidden'}`}>  
                                        <div className="mt-4"></div>
                                        <Divider className={`${intent==="Both" ? '' : 'hidden'}`} />
                                        <div className={`mt-4 text-md font-semibold text-gray-400`}>Common questions</div>

                                        <div className="justify-center items-center border bg-gray-50 rounded-xl p-4 mt-6">
                                            <div className="flex justify-between"><h3 className="text-lg font-semibold">Question {displayedQuestion + 1}</h3><span className="font-semibold tracking-widest"><DeleteIcon onClick={deleteQuestion} fontSize="large" className="-mt-1 cursor-pointer p-1.5 hover:bg-gray-100 rounded-full" /> {displayedQuestion+1}/{questions.length}</span></div>
                                            <input
                                                type="text"
                                                id={`question${displayedQuestion}`}
                                                name={`question${displayedQuestion}`}
                                                value={questions[displayedQuestion].question}
                                                onChange={(e) => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[displayedQuestion].question = e.target.value;
                                                    setQuestions(newQuestions);
                                                }}
                                                className="mt-4 p-3 block w-full border  shadow-sm text-base border-gray-300 rounded-lg"
                                                placeholder="e.g Question"
                                            />
                                            <input
                                            type="text"
                                            id={`answer${displayedQuestion}`}
                                            name={`answer${displayedQuestion}`}
                                            value={questions[displayedQuestion].answer}
                                            onChange={(e) => {
                                                const newQuestions = [...questions];
                                                newQuestions[displayedQuestion].answer = e.target.value;
                                                setQuestions(newQuestions);
                                            }}                                                
                                            className="mt-2 p-3 block w-full border  shadow-sm text-base border-gray-300 rounded-lg"
                                            placeholder="e.g Answer"
                                            />
                                        </div>
                                        <div className="flex justify-between mx-2 mt-4">
                                            <ChevronLeftIcon onClick={backQuestion} fontSize="large" className="cursor-pointer p-1 hover:bg-gray-100 rounded-full" />
                                            {displayedQuestion+1!==questions.length ? <ChevronRightIcon onClick={()=> setDisplayedQuestion(displayedQuestion+1)} fontSize="large" className="cursor-pointer p-1 hover:bg-gray-100 rounded-full" /> : <AddIcon onClick={addQuestion} fontSize="large" className="text-gray-800 cursor-pointer p-1.5 hover:bg-gray-100 rounded-full" />}
                                        </div>
                                    </div>


                                </div>
                            </div>

                            <div className={`flex flex-row gap-2 justify-between md:w-3/4 mx-auto mt-10 ${industry==="" ? 'hidden' : ''}`}>
                                <div className="rounded-lg w-full p-10 shadow-md hover:shadow-lg transition duration-150 bg-white flex-grow flex-shrink mr-2">
                                    <h1 className="font-semibold text-xl mb-2">Services</h1>
                                    <h3 className="text-gray-400 mb-8 text-sm">Help ChatGPT deeply understand what services you offer</h3>
                                    
                                    <div>
                                        {services.map((service, index) => (
                                            <div key={index} className={`hover:shadow transition-all duration-200 cursor-pointer flex mb-4 justify-between items-center p-8 border h-20 md:h-14  rounded-xl font-medium ${service.enabled ? ' bg-gradient-to-r from-green-500 to-green-400 hover:opacity-90' : 'bg-gray-50 opacity-90 hover:opacity-100 hover:bg-gray-100'} ${service.industry===industry ? ''  : 'hidden'}`} onClick={() => toggleService(index)}>
                                                <div><ul className={`${service.enabled ? 'text-white' : 'text-black'} font-semibold pr-8 text-sm md:text-lg`}>{service.name}</ul><ul className={`hidden md:block ${!service.enabled ? 'text-gray-500' : 'text-gray-100'} text-xs`}>{service.desc}</ul></div>

                                                <div className={`group cursor-pointer text-center px-6 w-20 py-2 hover:shadow-md font-semibold shadow-md rounded-xl ${service.enabled ? "bg-white border text-black hover:bg-gray-100" : "text-white bg-gray-900 hover:bg-gray-800"}`}>
                                                    {service.enabled === false ? 'No' : 'Yes'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <h4 className="mt-10 text-sm text-gray-400">Need additional services? <Link className="underline font-semibold hover:text-gray-500" to="/contact">Contact us</Link> to have them added</h4>

                                </div>
                            </div>

                            <div className={`justify-between md:w-3/4 mx-auto mt-10 ${industry==="" ? 'hidden' : ''}`}>
                                <div className="rounded-lg p-10 shadow-md hover:shadow-lg transition duration-150 bg-white mr-2">
                                <div className="flex flex-row justify-between"><div><h1 className="font-semibold text-xl mb-2">Packages</h1>
                                    <h3 className="text-gray-400 mb-8 text-sm mr-10">Let ChatGPT know what packages you offer, or if it's on case-by-case basis</h3></div><div><button onClick={()=>{setPackages([])}} className="py-3 px-4 border w-24 h-14 top-0 mr-4 font-semibold rounded-xl mb-4 bg-gray-50 hover:shadow hover:bg-gray-100">N/A</button><button onClick={addPackage} className="py-3 px-4 border w-24 h-14 top-0 font-semibold rounded-xl bg-gray-50 hover:shadow hover:bg-gray-100">+ More</button></div></div>
                                    
                                    {packages.length===0 ? <p className="text-xl mx-auto my-auto mt-10 text-gray-400 p-10 border rounded-3xl bg-gray-50 text-center tracking-wide">Case-By-Case Pricing Structure / Contact For Quote</p> : <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {packages.map((pkg: any, index: any) => (
                                            <div className={`justify-center row-span-1 items-center border ${pkg.name!=="" && pkg.price!=="" ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'} transition duration-300 rounded-xl p-8 mt-6`} key={index}>
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-semibold">{pkg.name==="" ? `Package ${index + 1}` : `${pkg.name}`}</h3>
                                                    <span className="font-semibold tracking-widest">
                                                        <DeleteIcon onClick={() => deletePackage(index)} fontSize="large" className="-mt-1 cursor-pointer p-1.5 hover:bg-gray-100 rounded-full" /> 
                                                        {/* {index+1}/{packages.length} */}
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    id={`packageName${index}`}
                                                    name={`packageName${index}`}
                                                    value={pkg.name}
                                                    onChange={(e) => {
                                                        const newPackages = [...packages];
                                                        newPackages[index].name = e.target.value;
                                                        setPackages(newPackages);
                                                    }}
                                                    className="text-black font-medium mt-4 p-3 block w-full border  shadow-sm text-base border-gray-300 rounded-lg"
                                                    placeholder="e.g Package Name"
                                                />
                                                <input
                                                    type="number"
                                                    id={`packagePrice${index}`}
                                                    name={`packagePrice${index}`}
                                                    value={pkg.price}
                                                    onChange={(e) => {
                                                        const newPackages = [...packages];
                                                        newPackages[index].price = e.target.value;
                                                        setPackages(newPackages);
                                                    }}                                                
                                                    className="text-black font-medium mt-4 p-3 block w-full border  shadow-sm text-base border-gray-300 rounded-lg"
                                                    placeholder="$ (price)"
                                                />
                                            </div>
                                        ))}
                                    </div>}
                                </div>
                            </div>


                            {industry==="" ? null : <div className={`md:flex md:flex-row gap-2 justify-between md:w-3/4 mx-auto mt-10`}>
                                <div className="rounded-lg md:w-1/2 p-8 shadow-md hover:shadow-lg transition duration-150 bg-white flex-grow flex-shrink mr-2">
                                    <h1 className="font-semibold text-xl mb-2">Response time</h1>
                                    <h3 className="text-gray-400 mb-8 text-sm">Choose how long to wait before sending your response</h3>
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
                                            className="w-10/12"
                                            sx={{color: "red"}}
                                        />
                                        <div className="text-gray-700 font-medium px-4 py-2 rounded-2xl border bg-gray-50 text-center text-lg mt-8">
                                            {secondsToTime(responseTime)}
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg md:w-1/2 mt-8 md:mt-0 p-8 shadow-md hover:shadow-lg transition duration-150 bg-white flex-grow flex-shrink mr-2">
                                    <h1 className="font-semibold text-xl mb-2">Sign off</h1>
                                    <h3 className="text-gray-400 mb-8 text-sm">Make sure to end off with a bang</h3>
                                    
                                    <div className="flex flex-row gap-4 mt-[70px]">
                                      <h3 className="w-1/2 font-semibold text-sm">Farewell</h3>  
                                      <h3 className="w-1/2 font-semibold text-sm">Name</h3> 
                                    </div>

                                    <div className="flex flex-row gap-4">
                                        <input
                                            type="text"
                                            id="farewell"
                                            name="farewell"
                                            value={farewell}
                                            onChange={(e) => setFarewell(e.target.value)}
                                            className={`mt-2 p-3 block w-full border shadow-sm text-base border-gray-300 rounded-lg ${name!=='' ? '' : ''}`}
                                            placeholder="Sincerely"
                                        />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`mt-2 p-3 block w-full border shadow-sm text-base border-gray-300 rounded-lg ${name!=='' ? '' : ''}`}
                                            placeholder="John"
                                        />
                                    </div>

                                </div>
                            </div>}

            
                            <div className={`flex gap-20 mt-12 md:w-1/2 mx-auto`}>
                                <div className="py-3 px-2 w-1/4 mt-4 rounded-xl text-gray-600 cursor-pointer hover:underline hover:text-gray-800 text-center font-semibold">
                                    <div className="flex" onClick={() => {setStep(1)}}>
                                       <ChevronLeftIcon /> Previous
                                    </div>
                                </div>
                                {isLoading ? <div className="justify-center items-center mx-auto my-auto pt-6"><CircularProgress className="justify-center items-center" style={{ 'color': '#000000' }} size={32} /></div> : 
                                <div className="shadow-red-200 shadow-xl py-3 px-2 w-3/4 bg-red-600 cursor-pointer hover:shadow-md hover:bg-red-700 mt-4 rounded-xl text-white text-center font-semibold" onClick={submitCreate}>
                                    Create & Test
                                </div>
                                }
                            </div>
                        <Divider className="pt-6" />
                    </div>
                </div>
            </div>
        </div>
    </>
    )

    return (
        <div></div>
    )

};

export default CreateCampaign;
