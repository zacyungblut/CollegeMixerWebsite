import React, { useState } from 'react';


type ToggleProps = {
    toggled: boolean;
    setToggled: (toggled: boolean) => void;
  };

export default function Toggle({toggled, setToggled}: ToggleProps) {

    // const [toggled, setToggled] = useState(true);

    const onClick = () => {
        console.log(
            'yo'
        )
        setToggled(!toggled);
    }

    return (
        <div onClick={onClick} className={`h-6 w-12 shadow rounded-full  my-auto ${toggled ? 'bg-gradient-to-t from-slate-600 to-sky-300' : 'bg-gradient-to-r from-gray-400 to-gray-500'} relative cursor-pointer transition-all ease-in-out duration-300`}>
            <div className={`h-5 w-5 shadow-md rounded-full absolute top-0.5 left-0.5 transition-all ease-in-out duration-300 ${toggled ? 'bg-gray-100 transform translate-x-6' : 'bg-gray-100'}`}>
            </div>
            <div>
                {/* <div className={`h-1 rounded-full border absolute top-[4px] left-[15px] transition-all ease-in-out duration-300 ${toggled ? 'w-2 h-2 bg-gray-300 bg-opacity-40 border-white' : 'opacity-0 w-1 h-2.5'}`} /> */}
                {/* <div className={`h-1 rounded-full border-[0.5px] absolute top-[13px] left-[7px] transition-all ease-in-out duration-300 ${toggled ? 'w-1.5 h-1.5 bg-gray-300 bg-opacity-40 border-white' : 'opacity-0 w-1 h-2.5'}`} /> */}
                {/* <img src={CoralImg} alt="coral" className={`h-0.5 w-0.5 absolute bottom-[0px] left-[8px] transition-all ease-in-out duration-300 ${toggled ? 'w-2 h-2' : 'opacity-0'}`} /> */}
                {/* <img src={CoralImg} alt="coral" className={`h-1 w-1 absolute bottom-[0px] left-[15px] transition-all ease-in-out duration-300 ${toggled ? 'w-2 h-2' : 'opacity-0'}`} /> */}
            </div>
        </div>
    )
}
