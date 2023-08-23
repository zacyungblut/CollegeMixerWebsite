import React from "react";
import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import OutlookLogo from "../assets/Outlook.png";
import GoogleLogo from "../assets/Google.png";
import GmailLogo from "../assets/GmailLogo.png";
import { faChevronUp, faChevronDown, faMagnifyingGlass, faPlay, faMap, faAddressBook, faChartSimple, faCircleInfo, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputBase, IconButton, Checkbox, Tabs, Tab, Box, ButtonBase } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Toggle from './Widgets/Toggle';


type TacticalSidebarProps = {
  layoutState: string;
};



const TacticalSidebar = ({ layoutState }: TacticalSidebarProps) => {

    
  return (
      <div className={`bg-white p-2 ${layoutState === "TACTICAL" || layoutState === "FULL" ? 'w-80 opacity-100' : 'w-0 opacity-0'}
      transition-all ease-in-out duration-200 flex flex-col h-feed-screen  border-gray-300 border-l z-10`}>


      </div>
  );

}

export default TacticalSidebar