import React, { useState } from "react";
import Image from "../assets/content.svg";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { toast } from "react-toastify";
import { subscribeToWaitlist } from "../actions/emailMarketing";
import MixerLogo from "../assets/Mixer-Logo.png";

export const Waitlist: React.FC = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.includes("@") || firstName === "") {
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
      dispatch(subscribeToWaitlist(email, firstName)).then((resp) => {
        if (resp.valid) {
        } else {
        }
        setIsLoading(false);
      }),
      {
        pending: "Joining...",
        success: "Successfuly signed up for the waitlist!",
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

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-white to-gray-50 relative">
      <main className="container mx-auto px-4 flex-grow">
        <div className="w-3/4 mx-auto"></div>
        <img
          className="w-40 h-auto mx-auto mt-10"
          src={MixerLogo}
          alt="Mixer Logo"
        />

        <div className="container max-w-4xl my-20 mx-auto px-8 py-8 mb-12 rounded-2xl bg-white shadow-lg">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy for Mixer</h1>
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to Mixer, the dating app that connects students from
                around the world. We respect the privacy of our users and are
                committed to protecting it through our compliance with this
                policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-medium mb-2">2.1. Personal Data</h3>
              <p>
                When you register with Mixer, we may ask you to provide certain
                personal information including:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Name</li>
                <li>Age</li>
                <li>Gender</li>
                <li>School Email Address</li>
                <li>Location</li>
                <li>Profile Pictures</li>
                <li>Bio/Description</li>
              </ul>

              <h3 className="text-xl font-medium mt-4 mb-2">2.2. Usage Data</h3>
              <p>
                We may also collect information on how the app is accessed and
                used. This may include:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Your IP address</li>
                <li>Device information</li>
                <li>Browser type and version</li>
                <li>Usage statistics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our app</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>For analysis and improvement of the app</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Security</h2>
              <p>
                We take precautions to protect your information. When you submit
                sensitive information via the app, your information is protected
                both online and offline.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Contact Information
              </h2>
              <p>
                For questions or comments about this privacy policy and our
                privacy practices, contact us at:
              </p>
              <p className="mt-2 font-medium">support@mixerapp.com</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Waitlist;
