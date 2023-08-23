import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { verify, getUserEmailAccounts, getUser, updateUser, deleteEmailAccount } from '../actions/auth';
import { Link, useNavigate } from "react-router-dom";
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import GmailLogo from "../assets/Google.png";
import OutlookLogo from "../assets/Outlook.png";
import ZohoLogo from "../assets/Zoho.png";
import GmailLogo2 from "../assets/GmailLogo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress } from '@mui/material';



const Settings = () => {
  const [selected, setSelected] = useState("Billing & Usage");
  const dispatch = useAppDispatch();
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
  const [emailAccounts, setEmailAccounts] = useState<any>(null);
  const [user, setUser] = useState<any>();
  const [plan, setPlan] = useState<string>('');
  const [userResponses, setUserResponses] = useState<number>(-1);
  const [loadingEmailAccounts, setLoadingEmailAccounts] = useState(true);



  const navigate = useNavigate();
  const options = [
    "Billing & Usage",
    "Email Accounts",
    "Workspace",
    "My Account",
    // "Preferences",
  ];

  const handleClick = (option: any) => {
    setSelected(option);
  };

  async function tryVerify() {
    const emailAccountsData = await dispatch(getUserEmailAccounts(userToken));
    const userData = await dispatch(getUser(userToken));

    if (emailAccountsData.valid===true) {
      setEmailAccounts(emailAccountsData.result);
    } 
    setLoadingEmailAccounts(false);

    if (userData.valid===true) {
      // setName(userData.result.name);
      // setEmail(userData.result.email);
      setPlan(userData.result.plan);
      setUserResponses(userData.result.responseCount);
      setUser(userData.result);
    }
  }

  useEffect(() => {
      tryVerify();
  }, [])


  const BillingUsage = () => {
    return (
      <div className="mt-8">
        
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h3 className="text-gray-700 font-bold text-xl">Usage</h3>
          <p className="text-gray-500 mt-4"><span className="font-bold text-xl text-gray-900">{userResponses===-1 ? <CircularProgress className="mr-1" style={{ color: "#000000" }} size={12} /> : userResponses}</span> / {plan==="prod_Nms1Kt2XZSYZ6b" ? "900" : plan==="prod_Nms2kI3uxqHl2R" ? "10,000" : "30"} emails this month</p>
        </div>

        {!plan ? null : plan==="prod_Nms1Kt2XZSYZ6b" ? <div className="mt-10 w-1/4 h-1/4 bg-gradient-to-r shadow-lg from-emerald-600 to-cyan-400 rounded-lg p-8">
          <p className="text-gray-100 text-sm mb-1 font-semibold">Current Plan</p>
          <h3 className="text-white font-bold text-2xl mb-10">Essential</h3>
          <div className="text-xl mt-4 text-gray-50 mb-10">
            <span className="font-bold text-4xl">$17</span> / mo
          </div>
          <Link to="/upgrade"><div className="text-xl cursor-pointer shadow-md hover:shadow-xl text-cyan-500 bg-white rounded-3xl text-center px-2 py-3 mx-10 font-extrabold">
            UPGRADE
          </div></Link>
          <div className="flex items-left space-x-2 ml-2 mt-8">
            <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
            <span className="text-white font-semibold">900 Emails / mo</span>
          </div>
        </div> : plan==="prod_Nms2kI3uxqHl2R" ?
        <div className="mt-10 w-1/4 h-1/4 bg-gradient-to-r shadow-lg from-pink-600 to-pink-400 rounded-lg p-8">
        <p className="text-gray-100 text-sm mb-1 font-semibold">Current Plan</p>
        <h3 className="text-white font-bold text-2xl mb-10">Business</h3>
        <div className="text-xl mt-4 text-gray-50 mb-10">
          <span className="font-bold text-4xl">$59</span> / mo
        </div>
        <div className="flex items-left space-x-2 ml-2 mt-8">
          <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
          <span className="text-white font-semibold">10,000 Emails / mo</span>
        </div>
      </div> :
      <div className="mt-10 lg:w-1/4 lg:h-1/4 md:w-1/3 md:h-1/3 w-1/2 h-1/2  bg-gradient-to-r shadow-lg from-gray-600 to-gray-400 rounded-lg p-8">
      <p className="text-gray-100 text-sm mb-1 font-semibold">Current Plan</p>
      <h3 className="text-white font-bold text-2xl mb-10">Free</h3>
      <div className="text-xl mt-4 text-gray-50 mb-10">
        <span className="font-bold text-4xl">$0</span> / mo
      </div>
      <Link to="/upgrade"><div className="text-xl cursor-pointer shadow-md hover:shadow-xl text-white bg-emerald-500 transition duration-100 hover:bg-emerald-600 rounded-3xl text-center px-4 py-3 2xl:mx-10 mx-4 font-extrabold">
        UPGRADE
      </div></Link>
      <div className="flex items-left space-x-2 ml-2 mt-8">
        <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
        <span className="text-white font-semibold">30 Scans</span>
      </div>
    </div>
      }
      </div>
    );
  };

  const EmailAccounts = () => {

    const [openedDropdownIndex, setOpenedDropdownIndex] = useState(-1);
    
    
    const handleDelete = async (id: string) => {
      setLoadingEmailAccounts(true);
      const resp = await dispatch(deleteEmailAccount(userToken, id));
      if (resp.result==="Outstanding AutoInbounds") {
        setLoadingEmailAccounts(false);
        alert("You must delete all auto-inbounds assosciated with this email account before you can delete it.");
        return;
      }

      const emailAccountsData = await dispatch(getUserEmailAccounts(userToken));

      if (emailAccountsData.valid===true) {
        setEmailAccounts(emailAccountsData.result);
        setLoadingEmailAccounts(false);
      } 

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

    return (
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <div className=" p-6 rounded-lg mb-4">
            <h3 className="text-gray-700 font-bold text-xl">Your Accounts</h3>
            <p className="text-gray-600 mt-2">View and edit your connected email providers</p>
          </div>
          <Link to="/app/connect">
            <button className="border border-gray-500 hover:bg-sunset hover:text-white hover:border-sunset transition duration-300 rounded mx-4 px-4 py-2 font-bold text-gray-600">
              <AddIcon className="-mt-0.5" /> Add New
            </button>
          </Link>
        </div>
        <div className="flex flex-col mt-4">
          <div className="w-full text-sm px-6 py-3 flex text-gray-700">
            <div className="EMAIL font-semibold w-1/4">Account</div>
              {/* <div className="EMAIL font-semibold w-1/4 ml-6">Subject Contains</div> */}
            </div>
            {loadingEmailAccounts ? <div className="justify-center items-center mx-auto mt-20"><CircularProgress style={{ color: '#B24544' }} /></div> : 
            emailAccounts.map((value: any, index: any) => (
              <div
                key={index}
                className="w-full mb-3 bg-white shadow-sm hover:shadow-md cursor-pointer rounded-xl px-6 py-5 mt-1 flex items-center"
              >
                <div>
                  {value.provider==="Google" ? <img src={GmailLogo} className="h-4 w-4 mr-4" alt="o"></img>
                  : value.provider==="Outlook" ? <img src={OutlookLogo} className="h-4 w-4 mr-4" alt="o"></img>
                  : value.provider==="Zoho" ? <img src={ZohoLogo} className="h-4 w-4 mr-4" alt="o"></img>
                  : value.provider==="GoogleAppPassword" ? <img src={GmailLogo2} className="h-4 w-4 mr-4" alt="o"></img>
                  : null
                  }
                </div>
                <div className="EMAIL font-semibold w-1/4 truncate">
                  {value.accountEmail}
                </div>
                <div className="SUBJECT font-semibold text-sm italic text-gray-700 w-1/4 truncate">
                  {/* {value.subjectLine} */}
                </div>
              <div className="ICON-LIST flex font-semibold ml-auto  w-2/8 justify-end">
                  <div className="flex items-center">
                    <FontAwesomeIcon className="" icon={faInbox} style={{ color: "#808080" }} />
                    <div className="ml-2">{value.receivedCount}</div>
                  </div>
                  <div className="ml-8 flex items-center">
                    <FontAwesomeIcon icon={faShare} style={{ color: "#808080" }} />
                    <div className="ml-2">{value.responseCount}</div>
                  </div>
                  <div className="flex items-center">
                  <FontAwesomeIcon
                    className="ml-8 hover:bg-slate-50 rounded-full p-2"
                    icon={faEllipsis}
                    style={{ color: "#808080" }}
                    onClick={() => setOpenedDropdownIndex(index)}
                  />
                  {openedDropdownIndex === index && (
                    <div className="absolute bg-white border border-gray-400 rounded-sm text-black mt-20 text-sm w-20">
                        <button
                          className="w-full p-3 hover:bg-gray-100 hover:bg-opacity-80"
                          data-ignore
                          onClick={() => {
                            handleDelete(value._id);
                            setOpenedDropdownIndex(-1);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                  )}            
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    );
  };

  const Workspace = () => {
    
    const [companyName, setCompanyName] = useState<string>('');
    const [leadValue, setLeadValue] = useState<number>();
    const [isLoadingWorkspace, setIsLoadingWorkspace] = useState<boolean>(false);


    async function onSaveWorkspace() {

      setIsLoadingWorkspace(true);
      await dispatch(updateUser(userToken, {companyName: companyName, leadValue: leadValue}))
      setIsLoadingWorkspace(false);

    }

    async function fetchWorkspace() {

      const userData = await dispatch(getUser(userToken));

      if (userData.valid===true) {
        if (userData.result.companyName) {
          setCompanyName(userData.result.companyName);
        }
        if (userData.result.leadValue) {
          setLeadValue(userData.result.leadValue);
        }

      }
    }
  
    useEffect(() => {
        fetchWorkspace();
    }, [])

    return (
      <div className="mt-8">
        <div className=" p-6 rounded-lg mb-4">
          <h3 className="text-gray-700 font-bold text-xl">Company</h3>
          <p className="text-gray-600 mt-2">View and edit your default organization settings</p>
          <div className="w-1/2 px-2 mt-16">
          <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="text">
            Company Name
          </label>
          <input className=" block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-6 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="company" type="" placeholder="ACME" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          {/* <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="text">
            Est. Lead Value
          </label>
          <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-6 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="value" type="number" placeholder="$800" value={leadValue} onChange={(e) => setLeadValue(parseFloat(e.target.value))} /> */}
          {isLoadingWorkspace ? <CircularProgress style={{ color: '#000000' }} /> : <button className="bg-red-600 hover:bg-red-700 hover:shadow-lg cursor-pointer py-2 px-5 shadow-md rounded-lg mt-4 text-white font-semibold" onClick={onSaveWorkspace}>
            Save
          </button>}
        </div>
        </div>
      </div>
    );
  };

  const MyAccount = () => {

    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [isLoadingAccount, setIsLoadingAccount] = useState<boolean>(false);

    async function fetchCredentials() {

      const userData = await dispatch(getUser(userToken));

      if (userData.valid===true) {
        if (userData.result.name) {
          setName(userData.result.name);
        }
        setEmail(userData.result.email);

      }

    }
  
    useEffect(() => {
        fetchCredentials();
    }, [])


  
    async function handleCredentialsSubmit() {

      setIsLoadingAccount(true);

      await dispatch(updateUser(userToken, {name: name}))

      setIsLoadingAccount(false);


    }

    return (
      <div className="mt-8">
        <div className=" p-6 rounded-lg mb-4">
          <h3 className="text-gray-700 font-bold text-xl">Credentials</h3>
          <p className="text-gray-600 mt-2">View and edit your account details</p>
          <div className="w-1/2 px-2 mt-16">
          <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="text">
            Name
          </label>
          <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-6 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="name" type="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <label className=" block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input disabled className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="myemail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          {isLoadingAccount ? <CircularProgress style={{ color: '#000000' }} /> : <button className="bg-red-600 hover:bg-red-700 hover:shadow-lg cursor-pointer py-2 px-5 shadow-md rounded-lg mt-4 text-white font-semibold" onClick={handleCredentialsSubmit}>
            Save
          </button>}
        </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="">
          <h2 className="text-gray-700 font-bold text-3xl">Settings</h2>
          <div className="mt-10 ml-4 mr-4 flex space-x-8">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleClick(option)}
                className={`cursor-pointer transition duration-200 ${selected === option ? "text-sunset" : "text-gray-500 hover:text-gray-700"} text-lg font-semibold`}
              >
                {option}
                <div
                  className={`h-0.5 mt-6 transition  duration-200 ${selected === option ? "bg-sunset" : "bg-gray-300 hidden"}`}
                />
              </div>
            ))}
                <div
                  className={`h-0.5 mt-6 transition  duration-200 bg-sunset"}`}
                />
          </div>
          <div className="bg-gray-300 h-px mt-0 w-full" />
        </div>
      </div>
      {selected === "Billing & Usage" && <BillingUsage />}
      {selected === "Email Accounts" && <EmailAccounts />}
      {selected === "Workspace" && <Workspace />}
      {selected === "My Account" && <MyAccount />}

    </div>
  );
};

export default Settings;
