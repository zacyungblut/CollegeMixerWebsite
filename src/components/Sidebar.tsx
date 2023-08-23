import React from "react";
import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import OutlookLogo from "../assets/Outlook.png";
import GoogleLogo from "../assets/Google.png";
import GmailLogo from "../assets/GmailLogo.png";
import { getUserProcessedEmails, readEmail } from '../actions/processedEmails';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { faChevronUp, faChevronDown, faMagnifyingGlass, faPlay, faMap, faAddressBook, faChartSimple, faCircleInfo, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputBase, IconButton, Checkbox, Tabs, Tab, Box, ButtonBase } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Toggle from '../components/Widgets/Toggle';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import { LMODE, layoutModesArray } from './Widgets/constants';
import { useProcessedEmails } from '../hooks/hooks';


type SidebarProps = {
  activePage: string;
  setActivePage: (page: string) => void;
  classicMode: boolean;
  setClassicMode: (newState: boolean) => void;
  layoutState: string;
  setLayoutState: (newState: string) => void;
};



const Sidebar = ({activePage, setActivePage, classicMode, setClassicMode, layoutState, setLayoutState}: SidebarProps) => {

  //power box
  const [isRActive, setIsRActive] = useState(false);
  const [isEActive, setIsEActive] = useState(false);
  const [isAActive, setIsAActive] = useState(false);
  const [isLActive, setIsLActive] = useState(false);
  const [isSPACEActive, setIsSPACEActive] = useState(false);

  const [respondMenuState, setRespondMenuState] = useState<any>({isActive: false, options: [], activeSub: -1}); 
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedSubOption, setSelectedSubOption] = useState(0);
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
  const { emails, setEmails, selectedGlobalEmail, setSelectedGlobalEmail, nextGlobalEmail, setNextGlobalEmail, isStartScreen, setIsStartScreen, isFinishedScreen, setIsFinishedScreen } = useProcessedEmails();
  const dispatch = useAppDispatch();


  function openRespondMenu() {
      if (respondMenuState.isActive===true) {
        setRespondMenuState({isActive: false, options: [], activeSub: -1})
        setIsRActive(false)
        return;
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

    useEffect(() => {
      const handleKeyDown = async (event: any) => {
        if (event.key === 'r' || event.key === 'R') {
          setIsRActive(true);  // Make the R button "active" (cosmetic not utility)
        }
        if (event.key === 'e' || event.key === 'E') {
          setIsEActive(true);  // Make the R button "active" (cosmetic not utility)
        }
        if (event.key === 'l' || event.key === 'L') {
          setIsLActive(true); // Make the L button "active" (cosmetic not utility)
        }
        if (event.key === 'a' || event.key === 'A') {
          setIsAActive(true);
        }
        if (event.key === ' ') {
          event.preventDefault();
          setIsSPACEActive(true);
        }
        if ((event.key === 'j' || event.key === 'J') && event.shiftKey) {
          goToEmail(emails.length-1);
        } else if (event.key === 'j' || event.key === 'J') {
          let currentIndex = emails.findIndex(email => email._id === selectedGlobalEmail?._id);
          if (!isStartScreen || selectedGlobalEmail!==null) {
            let nextIndex = findNextBlockStart(currentIndex, emails);
            goToEmail(selectedGlobalEmail?.category === "3" ? nextIndex : emails.findIndex(email => email._id === selectedGlobalEmail?._id)+1);
          } else if (isStartScreen) {
            goToEmail(currentIndex+1);
          }
        }
        if ((event.key === 'k' || event.key === 'K') && event.shiftKey) {
          // If shift + k, go to bottom email
          goToEmail(0);
        } else if (event.key === 'k' || event.key === 'K') {
          if (selectedGlobalEmail === null && !isStartScreen && emails.length > 0) {
            goToEmail(emails.length)
          }
          if (selectedGlobalEmail!==null) {
            let currentIndex = emails.findIndex(email => email._id === selectedGlobalEmail?._id);
            let prevIndex = findPrevBlockStart(currentIndex, emails);
            goToEmail(selectedGlobalEmail?.category === "3" ? prevIndex : emails.findIndex(email => email._id === selectedGlobalEmail?._id)-1);
          }
        }

        if (event.key === 'ArrowDown' && respondMenuState.activeSub === -1) {
          event.preventDefault();
          if (respondMenuState.activeSub === -1) {
            if (selectedOption+1 < respondMenuState.options.length) setSelectedOption(selectedOption+1);
          } else {
            if (selectedSubOption+1 < respondMenuState.options[selectedOption].subOptions.length) setSelectedSubOption(selectedSubOption+1);

          }
        } else if (event.key === 'ArrowDown' && respondMenuState.activeSub !== -1) {

        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
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
        if (event.key === 'e' || event.key === 'E') {
          setIsEActive(false);
          // event logic
        }
        if (event.key === 'a' || event.key === 'A') {
          openEmailGoToNext();
          setIsAActive(false);
        }
        if (event.key === 'l' || event.key === 'L') {
          layoutClick();
          setIsLActive(false);
        }
        if (event.key === ' ') {
          setIsSPACEActive(false);
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

    }, [respondMenuState.isActive, respondMenuState.activeSub, selectedOption, selectedSubOption, layoutState, selectedGlobalEmail, isStartScreen]);

    function layoutClick() {
      const currentIndex = layoutModesArray.indexOf(layoutState);
      const nextIndex = (currentIndex + 1) % layoutModesArray.length;
      setLayoutState(layoutModesArray[nextIndex]);
    }

    async function openEmailGoToNext() {
      let emailIndex = emails.findIndex(email => email._id === selectedGlobalEmail?._id);
    
      if (isStartScreen===true) {
        setIsStartScreen(false);
        setSelectedGlobalEmail(emails[0]);
        setNextGlobalEmail(emails[1]);
      } else {
        // Saving old state
        const oldSelectedEmail = selectedGlobalEmail;
        const oldNextEmail = nextGlobalEmail;
        const oldEmails = [...emails];
        
        // Identify if current email category is 3
        const isCategoryThree = selectedGlobalEmail?.category === '3';
        let emailIndicesToRead = [emailIndex];
        if (isCategoryThree) {
          // Get indices of next 0 to 3 emails with category 3 (maximum 4 emails including current)
          for(let i = 1; i < 4; i++) {
            if(emails[emailIndex + i] && emails[emailIndex + i].category === '3') {
              emailIndicesToRead.push(emailIndex + i);
            } else {
              break;
            }
          }
        }
        // Remove the emails that will be read
        let newEmails = emails.filter((_, index) => !emailIndicesToRead.includes(index));
        
        if(isCategoryThree) {
          emailIndex = findNextBlockStart(emailIndex, newEmails);
        }
    
        // Find the next email
        const nextEmail = newEmails.length > emailIndex + 1 ? newEmails[emailIndex+1] : null;
        const selectedEmail = newEmails[emailIndex];
    
        // Set the new state
        setSelectedGlobalEmail(selectedEmail);
        setNextGlobalEmail(nextEmail);
        setEmails(newEmails);
    
        // Loop through the emails to be read and read them
        for(let i = 0; i < emailIndicesToRead.length; i++) {
          const resp = await dispatch(readEmail(userToken, oldEmails[emailIndicesToRead[i]]._id));
          if (resp.valid===false) {
            // If API call is not valid, revert to old state
            setSelectedGlobalEmail(oldSelectedEmail);
            setNextGlobalEmail(oldNextEmail);
            setEmails(oldEmails);
            return;
          }
        }
    
        // If there are no more emails left, set isFinishedScreen to true
        if (newEmails.length === 0) {
          setIsFinishedScreen(true);
        } else {
          goToEmail(newEmails.length-1);
        }
      }
    }
    
    

    async function goToEmail(index: number) {
      console.log('email is', selectedGlobalEmail);
      if (isStartScreen) {
        setIsStartScreen(false);
        setSelectedGlobalEmail(emails[0]);
        setNextGlobalEmail(emails[1]);
      } else if (index<0) {
          setIsStartScreen(true);
          setSelectedGlobalEmail(null);
          setNextGlobalEmail(emails[0]);
      } else {
        setSelectedGlobalEmail(emails[index]);
        setNextGlobalEmail(emails[index+1]);
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
    
    const findPrevBlockStart = (currentIndex: number, emails: any[]) => {
      let blockCount = 0; // count of emails in the current block
    
      // Skip through current block
      while (currentIndex >= 0 && emails[currentIndex].category === '3' && blockCount < 4) {
        currentIndex--;
        blockCount++;
      }
    
      // If we've not reached the start of the emails and haven't found a new block
      if (currentIndex >= 0 && emails[currentIndex].category !== '3') {
        // Find the start of the previous block
        while (currentIndex >= 0 && emails[currentIndex].category !== '3') {
          currentIndex--;
        }
      }
    
      // If we've reached the start of the emails or found a new block, currentIndex is correct
      // If we've not found a new block but haven't reached the start, there are less than 4 emails in the last block
    
      // If there are no blocks with an email.category of "3" behind this one
      if (currentIndex < 0) {
        // Go back to the previous email (one less in index than the current one)
        return (emails.findIndex(email => email._id === selectedGlobalEmail?._id)-1); // assuming prevSelectedGlobalEmailIndex is a state that tracks the index of previous selectedGlobalEmail
      } else {
        return currentIndex;
      }
    };
        
    
    

    const PowerBox = () => {
      return (
      <div className="p-1">
        <div className={`text-gray-500 truncate flex justify-between items-center text-lg font-semibold ${layoutState!==LMODE.DEFAULT ? 'hidden' : 'mt-1'}`}><div>Power Box</div><div><FontAwesomeIcon className="cursor-pointer" scale="small" icon={faCircleInfo} style={{ color: "#808080", fontSize: "14px" }} /></div></div>

        <div className="BUTTONS flex flex-col mt-2 gap-2">

            <div onClick={()=> {openRespondMenu(); setIsRActive(!isRActive);}} className={`flex flex-row RESPOND-BUTTON cursor-pointer ${isRActive && 'bg-gray-200'} ${layoutState!==LMODE.DEFAULT ? 'w-fit' : 'w-full'} hover:bg-gray-200 transition duration-100 group border rounded-lg p-2`}>
                <div><button className={`text-white ${isRActive ? 'translate-y-[2.5px]' : 'group-hover:translate-y-[1px]'}  group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-red-600 from-40% via-orange-500 via-80% to-orange-300`}>R</button>
                <div className="bg-red-800 rounded-xl -mt-[9px] w-[27px] pb-[9px] pt-[5px] px-2"></div></div>
                <div className={`flex flex-col ml-3 ${layoutState!==LMODE.DEFAULT ? 'hidden w-0' : 'w-full'}`}>
                  <div className="text-gray-500 font-medium -mt-0.5 text-sm">Respond</div>
                  <div className="text-gray-400 text-xs w-fit truncate">Craft a perfect response</div>
                </div>
            </div>

            <div className={`flex flex-row EVENT-BUTTON ${layoutState!==LMODE.DEFAULT ? 'w-fit' : 'w-full'} cursor-pointer ${isEActive && 'bg-gray-200'} hover:bg-gray-200 transition duration-100 group border rounded-lg p-2`}>
                <div><button className={`text-white ${isEActive ? 'translate-y-[2.5px]' : 'group-hover:translate-y-[1px]'} group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-orange-500 from-40% via-orange-300 via-80% to-orange-200`}>E</button>
                <div className="bg-orange-800 rounded-xl -mt-[9px] w-[26px] pb-[9px] pt-[5px] px-2"></div></div>
                <div className={`flex flex-col ml-3 ${layoutState!==LMODE.DEFAULT ? 'hidden w-0' : 'w-full'}`}>
                  <div className="text-gray-500 font-medium -mt-0.5 text-sm">Event</div>
                  <div className="text-gray-400 text-xs w-fit truncate">Create new meeting/event</div>
                </div>
            </div>

            <div onClick={openEmailGoToNext} className={`flex flex-row ACKNOWLEDGE-BUTTON ${layoutState!==LMODE.DEFAULT ? 'w-fit' : 'w-full'} cursor-pointer ${isAActive && 'bg-gray-200'} hover:bg-gray-200 transition duration-100 group border rounded-lg p-2`}>
                <div><button className={`text-white ${isAActive ? 'translate-y-[2.5px]' : 'group-hover:translate-y-[1px]'} group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-2 rounded-md bg-gradient-to-tr from-yellow-500 from-40% via-yellow-300 via-80% to-yellow-50`}>A</button>
                <div className="bg-yellow-900 rounded-xl -mt-[9px] w-[26.5px] pb-[9px] pt-[5px] px-2"></div></div>
                <div className={`flex flex-col ml-3 ${layoutState!==LMODE.DEFAULT ? 'hidden w-0' : 'w-full'}`}>
                  <div className="text-gray-500 font-medium -mt-0.5 text-sm">Acknowledge</div>
                  <div className="text-gray-400 truncate w-fit text-xs">On to the next email</div>
                </div>
            </div>

            <div onClick={layoutClick} className={`flex flex-row LAYOUT-BUTTON ${layoutState!==LMODE.DEFAULT ? 'w-fit' : 'w-full'} cursor-pointer ${isLActive && 'bg-gray-200'} hover:bg-gray-200 transition duration-100 group border rounded-lg p-2`}>
                <div><button className={`text-white ${isLActive ? 'translate-y-[2.5px]' : 'group-hover:translate-y-[1px]'} group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 px-[9px] rounded-md bg-gradient-to-tr from-green-500 from-40% via-lime-400 via-80% to-green-200`}>L</button>
                <div className="bg-green-900 rounded-xl -mt-[9px] w-[27.5px] pb-[9px] pt-[5px] px-2"></div></div>
                <div className={`flex flex-col ml-3 ${layoutState!==LMODE.DEFAULT ? 'hidden w-0' : 'w-full'}`}>
                  <div className="text-gray-500 font-medium -mt-0.5 text-sm">Layout</div>
                  <div className="text-gray-400 truncate w-fit text-xs">Get a birds-eye view</div>
                </div>
            </div>

            <div className={`flex flex-row COMPOSE-BUTTON cursor-pointer ${isSPACEActive && 'bg-gray-200'} hover:bg-gray-200 ${layoutState!==LMODE.DEFAULT ? 'w-fit' : 'w-full'} transition duration-100 group border rounded-lg p-2`}>
                <div><button className={`text-white ${isSPACEActive ? 'translate-y-[2.5px]' : 'group-hover:translate-y-[1px]'} group-active:translate-y-[2.5px] transition duration-100 font-bold py-0.5 ${layoutState!==LMODE.DEFAULT ? 'px-1' : 'px-2'} rounded-md bg-gradient-to-tr from-blue-400 from-40% via-cyan-400 via-80% to-cyan-200`}>{layoutState!==LMODE.DEFAULT ? <SpaceBarIcon fontSize="small" /> : 'SPACE'}</button>
                <div className={`bg-blue-900 rounded-xl -mt-[9px] ${layoutState!==LMODE.DEFAULT ? 'w-[28px] px-1' : 'w-[69.5px] px-2'} pb-[9px] pt-[5px]`}></div></div>
                <div className={`flex flex-col ml-3 ${layoutState!==LMODE.DEFAULT ? 'hidden w-0' : 'w-full'}`}>
                  <div className="text-gray-500 font-medium -mt-0.5 text-sm">Compose</div>
                  <div className="text-gray-400 truncate w-fit text-xs">Write a new email</div>
                </div>
            </div>

            <div className={`flex flex-row justify-between mx-2 pr-10 gap-4 w-full ${layoutState!==LMODE.DEFAULT ? 'hidden' : ''} arrow-buttons`}>
              <div className="group">
                <button className={`text-white group-hover:translate-y-[1px] group-active:translate-y-[2.5px] transition duration-100 font-bold py-0 px-0.5 rounded-md bg-gradient-to-tr from-gray-600 from-40% via-gray-500 via-80% to-gray-300`}>
                  <PlayArrowIcon className="-rotate-90" fontSize="small" />
                </button>
                  <div className="bg-gray-800 rounded-xl -mt-[9px] w-[24px] pb-[9px] pt-[5px] px-2"></div>
              </div>
              <div className="group">
                <button className={`text-white group-hover:translate-y-[1px] group-active:translate-y-[2.5px] transition duration-100 font-bold py-0 px-0.5 rounded-md bg-gradient-to-tr from-gray-600 from-40% via-gray-500 via-80% to-gray-300`}>
                  <PlayArrowIcon className="rotate-90" fontSize="small" />
                </button>
                  <div className="bg-gray-800 rounded-xl -mt-[9px] w-[24px] pb-[9px] pt-[5px] px-2"></div>
              </div>
              <div className="group">
                <button className={`text-white group-hover:translate-y-[1px] group-active:translate-y-[2.5px] transition duration-100 font-bold py-0 px-0.5 rounded-md bg-gradient-to-tr from-gray-600 from-40% via-gray-500 via-80% to-gray-300`}>
                  <PlayArrowIcon className="rotate-180" fontSize="small" />
                </button>
                  <div className="bg-gray-800 rounded-xl -mt-[9px] w-[24px] pb-[9px] pt-[5px] px-2"></div>
              </div>
              <div className="group">
                <button className={`text-white group-hover:translate-y-[1px] group-active:translate-y-[2.5px] transition duration-100 font-bold py-0 px-0.5 rounded-md bg-gradient-to-tr from-gray-600 from-40% via-gray-500 via-80% to-gray-300`}>
                  <PlayArrowIcon className="" fontSize="small" />
                </button>
                  <div className="bg-gray-800 rounded-xl -mt-[9px] w-[24px] pb-[9px] pt-[5px] px-2"></div>
              </div>
            </div>

          </div>
      </div>
      );
    }

    const OverviewOptions = () => {
      return (
        <div className="p-1">
          <div className={`text-gray-500 text-lg ${layoutState!==LMODE.DEFAULT ? 'hidden' : ''} font-semibold mt-3`}>Choose your view</div>
          <div className="h-full my-auto mt-3 rounded-2xl"><Toggle toggled={classicMode} setToggled={setClassicMode} /></div>
        </div>
      );
    }
      

    return (
        <div className={`bg-white p-2 px-5 flex flex-col h-full ${layoutState!==LMODE.DEFAULT ? 'w-24' : 'w-64'} transition-all ease-in-out duration-200 min-h-screen-4rem  border-gray-300 border-r z-10`}>

            <div onClick={()=>{}} className={`p-3 ${layoutState!==LMODE.DEFAULT ? 'hidden w-0' : 'w-full'} mt-0 focus:border-2 transition-all ease-in-out duration-200 focus:border-gray-100 flex flex-row justify-start cursor-pointer hover:bg-gray-100 rounded-lg`}>
                <img src={GmailLogo} alt="Outlook Logo" className="items-center my-auto w-10 h-10 border rounded-full mr-3" />
                <div className={`flex flex-col ${layoutState!==LMODE.DEFAULT ? 'hidden' : ''}`}>
                    <div className="font-bold text-gray-800 w-32 truncate">
                        Zac Yungblut
                    </div>
                    <div className="text-gray-400 w-32 truncate">
                        zacyungblut@gmail.com
                    </div>  
                </div>
                <div className="flex flex-col ml-auto my-auto">
                    <FontAwesomeIcon className="" scale="small" icon={faChevronUp} style={{ color: "#808080", fontSize: "10px" }} />
                    <FontAwesomeIcon className="" icon={faChevronDown} style={{ color: "#808080", fontSize: "10px" }} />
                </div>
            </div>
            <div onClick={()=>{}} className={`px-2 h-10 ${layoutState!==LMODE.DEFAULT ? 'hidden' : ''} mt-2 mb-1 border-2 border-gray-200 flex flex-row justify-start cursor-pointer bg-gray-100 rounded-lg`}>
                <FontAwesomeIcon className="my-auto mr-4" icon={faMagnifyingGlass} style={{ color: "#808080", fontSize: "16px" }} />
                <input type="text" className="w-full text-sm bg-transparent" placeholder="Search mail" />
            </div>

            <div onClick={()=>{setActivePage("feed")}} className={`flex group p-1.5 px-4 mt-2 cursor-pointer rounded-lg ${activePage==="feed" ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
                <FontAwesomeIcon className="my-auto mr-4 transition duration-150 group-hover:translate-x-0.5" icon={faPlay} style={{ color: activePage==="feed" ? "#FFFFFF" : "#808080", fontSize: "14px" }} />
                <span className={`text-base tracking-wide transition duration-150 ${layoutState!==LMODE.DEFAULT ? 'opacity-0 truncate' : ''} group-hover:translate-x-1`}>Feed</span>
            </div>
            <div onClick={()=>{setActivePage("overview")}} className={`flex group p-1.5 px-4 mt-2 cursor-pointer rounded-lg ${activePage==="overview" ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
                <FontAwesomeIcon className="my-auto mr-4 transition duration-150 group-hover:translate-x-0.5" icon={faMap} style={{ color: activePage==="overview" ? "#FFFFFF" : "#808080", fontSize: "14px" }} />
                <span className={`text-base truncate tracking-wide transition duration-150 ${layoutState!==LMODE.DEFAULT ? 'opacity-0 truncate' : ''} group-hover:translate-x-1`}>View all</span>
            </div>
            <div onClick={()=>{setActivePage("contacts")}} className={`flex group p-1.5 px-4 mt-2 cursor-pointer rounded-lg ${activePage==="contacts" ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
                <FontAwesomeIcon className="my-auto mr-4 transition duration-150 group-hover:translate-x-0.5" icon={faAddressBook} style={{ color: activePage==="contacts" ? "#FFFFFF" : "#808080", fontSize: "14px" }} />
                <span className={`text-base tracking-wide transition duration-150 ${layoutState!==LMODE.DEFAULT ? 'opacity-0 truncate' : ''} group-hover:translate-x-1`}>Contacts</span>
            </div>
            <div onClick={()=>{setActivePage("analytics")}} className={`flex group p-1.5 px-4 mt-2 cursor-pointer rounded-lg ${activePage==="analytics" ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
                <FontAwesomeIcon className="my-auto mr-4 transition duration-150 group-hover:translate-x-0.5" icon={faChartSimple} style={{ color: activePage==="analytics" ? "#FFFFFF" : "#808080", fontSize: "14px" }} />
                <span className={`text-base tracking-wide transition duration-150 ${layoutState!==LMODE.DEFAULT ? 'opacity-0 truncate' : ''} group-hover:translate-x-1`}>Analytics</span>
            </div>

            <div className="border-t w-full mt-4"></div>

            {activePage==="feed" && <PowerBox />}
            {activePage==="overview" && <OverviewOptions />}


            <div className="relative MENUS-CONTAINER">
              {respondMenuState.isActive &&
              <div className="absolute z-40 flex flex-col bottom-[84px] justify-start text-left -ml-0.5 left-full h-fit w-80 rounded-lg  bg-gray-600  text-white items-center">
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
              <div className="absolute z-40 flex flex-col top-[100x] justify-start text-left -mr-[100px] left-80 h-fit w-[400px] rounded-lg  bg-gray-600  text-white items-center">
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


        </div>
    );

}

export default Sidebar