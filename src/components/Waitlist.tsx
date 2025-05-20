import React, { useState } from "react";
import Image from "../assets/content.svg";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { toast } from "react-toastify";
import { subscribeToWaitlist } from "../actions/emailMarketing";
import GuelphMixerLogo from "../assets/GuelphMixer.png";
import MixerLogo from "../assets/mixer_logo.png";
import Confetti from "react-confetti";

export const Waitlist: React.FC = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useAppDispatch();

  const handleKeypadPress = (number: any) => {
    setPhoneNumber(phoneNumber + number);
  };

  const handleLinkClick = (link: string) => {
    window.open(link, "_blank");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (firstName === "") {
      alert("Please fill in the fields correctly");
      setIsLoading(false);
      return;
    }

    if (email.endsWith("@uwo.ca")) {
      alert(
        "You'll need your school email for when you make your account, but for now please enter your personal email"
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    toast.promise(
      dispatch(subscribeToWaitlist(phoneNumber, firstName)).then((resp) => {
        if (resp.valid) {
        } else {
        }
        setIsLoading(false);
        setIsSubmitted(true);
      }),
      {
        pending: "Joining...",
        success: "Got you contact fam",
        error: "Error",
      },
      {
        toastId: "subToWaitlist",
        theme: "light",
        position: "bottom-left",
        autoClose: 5000,
      }
    );
  };

  const Keypad = ({ onKeyPress }: any) => {
    // Updated buttons array with placeholders (null) for empty spaces
    const buttons = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "placeholder",
      0,
      "placeholder",
    ];

    return (
      <div className="grid grid-cols-3 gap-4 p-3">
        {buttons.map((item, index) =>
          item === "placeholder" ? (
            <div key={`placeholder-${index}`} className="p-3"></div> // Empty placeholder
          ) : (
            <button
              key={item}
              onClick={() => onKeyPress(item)}
              className={`p-4 rounded-lg bg-gray-100 text-2xl shadow-lg border  transition duration-200 hover:scale-95 hover:shadow-lg`}>
              {item}
            </button>
          )
        )}
      </div>
    );
  };

  if (isSubmitted === true) {
    return (
      <>
        {/* <Confetti colors={["#ddefc3", "#c2e2ec", "#f4bec7", "#fbeab9"]} /> */}
        <div className="flex flex-col min-h-screen font-sans -mt-10 bg-gradient-to-b shadow from-white to-gray-50 relative">
          <main className="container mx-auto px-4 flex-grow">
            <div className="w-3/4 mx-auto"></div>

            {/* https://apps.apple.com/ca/app/mixer-dating/id1671245143 */}

            <div className="container max-w-4xl my-20 mx-auto px-4 py-8 mb-12 shadow-lg bg-[#f8f8f8] rounded-2xl">
              <img
                src={MixerLogo}
                className="w-[200px] rounded-md h-auto mx-auto"
              />

              <h1 className="text-center text-2xl font-semibold mt-8">
                Dating's Better Together
              </h1>
              {/* <h1 className='text-center text-sm mb-8 text-gray-700 font-semibold mt-2'>Sign up with your student email to get access</h1> */}

              <div className="items-center justify-center flex flex-col gap-4 mt-16 mb-4">
                <button
                  onClick={() => {
                    handleLinkClick(
                      "https://apps.apple.com/us/app/mixer-dating-with-friends/id1671245143"
                    );
                  }}
                  className="bg-slate-700 rounded-lg p-3 text-white font-semibold transition-all duration-200 hover:bg-pink-600 hover:scale-95">
                  Get the app
                </button>

                <span className="text-xs text-center text-gray-700 mt-4">
                  Mixer is not assosciated with any university or college
                </span>
              </div>

              {/* <img src={TiresImg} alt="Tires" className=" absolute invisible -mr-4 lg:visible bottom-44 z-5 left-0 lg:w-40  xl:w-64 h-auto " /> */}
              <div className="flex justify-center items-center pt-6 pb-2 "></div>
              <div className="flex justify-center items-center pt-2 pb-2 ">
                {/* <span className="mr-3 text-sm text-gray-700 ">We'll send you updates periodically with reminders and more information</span> */}
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen font-sans -mt-10 bg-gradient-to-b shadow from-white to-gray-50 relative">
        <main className="container mx-auto px-4 flex-grow">
          <div className="w-3/4 mx-auto"></div>

          <div className="container max-w-4xl my-20 mx-auto px-4 py-8 mb-12 shadow-lg bg-[#f8f8f8] rounded-2xl">
            <img
              src={MixerLogo}
              className="w-[100px] rounded-md h-auto mx-auto"
            />

            <h1 className="text-3xl font-semibold text-center text-gray-900 my-6">
              We're launching January 19
            </h1>
            <h1 className="text-xl font-semibold text-center text-gray-600 my-6">
              Pre-register for the app everyone's talking about 👇
            </h1>

            <form className="w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
              <div className="flex flex-wrap">
                <div className="flex w-full flex-wrap mb-4">
                  <div className="w-full mx-auto px-2 mt-4">
                    <label
                      className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                      htmlFor="name">
                      First Name
                    </label>
                    <input
                      className="appearance-none shadow-md block w-full truncate bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="name"
                      type="text"
                      placeholder="Ashleigh"
                      value={firstName}
                      onChange={(n) => setFirstName(n.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full px-2 ">
                  <label
                    className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                    htmlFor="name">
                    Phone number
                  </label>
                  <input
                    className="appearance-none shadow-md block w-full bg-white text-gray-700 border rounded-lg py-3 px-4 mb-3 leading-tight"
                    id="phone-number"
                    type="tel"
                    placeholder="519-583-1850"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="mx-auto">
                  <Keypad onKeyPress={handleKeypadPress} />
                </div>
              </div>
              <div className="flex items-center justify-center">
                {!isLoading ? (
                  <button
                    className="bg-black mx-auto mt-6 text-2xl hover:-translate-y-px hover:bg-gray-900 text-white font-bold mb-3 py-3 px-10 transition duration-200 rounded-lg focus:outline-none focus:shadow-outline"
                    type="submit">
                    Submit
                  </button>
                ) : (
                  <CircularProgress
                    className="items-center justify-center"
                    size={28}
                    style={{ color: "#000000" }}
                  />
                )}
              </div>
            </form>
            {/* <img src={TiresImg} alt="Tires" className=" absolute invisible -mr-4 lg:visible bottom-44 z-5 left-0 lg:w-40  xl:w-64 h-auto " /> */}
            <div className="flex justify-center items-center pt-6 pb-2 ">
              <span className="mr-3 text-sm text-gray-700 ">
                Guelph Mixer is not affiliated with Guelph University
              </span>
            </div>
            <div className="flex justify-center items-center pt-2 pb-2 ">
              {/* <span className="mr-3 text-sm text-gray-700 ">We'll send you updates periodically with reminders and more information</span> */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Waitlist;
