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

          <p className="text-lg font-medium mb-6 underline">
            Mixer does not share any mobile information with third parties or
            affiliates for marketing or promotional purposes.
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to Mixer, the dating app that connects friend groups and
                helps people meet through mutual connections. We respect the
                privacy of our users and are committed to protecting it through
                our compliance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-medium mb-2">2.1. Personal Data</h3>
              <p>
                We collect and process the following types of personal
                information:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Name</li>
                <li>Age and Birthday</li>
                <li>Gender and Gender Preferences</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Profile Pictures</li>
                <li>Bio/Description</li>
                <li>Friend connections and group affiliations</li>
              </ul>

              <h3 className="text-xl font-medium mt-4 mb-2">2.2. Usage Data</h3>
              <p>
                We automatically collect certain information about your device
                and how you interact with Mixer:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Device information (type, model, operating system)</li>
                <li>IP address</li>
                <li>App usage statistics</li>
                <li>Chat interactions (timestamps, frequency)</li>
                <li>Feature usage patterns</li>
                <li>App performance data</li>
                <li>Notification interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use your information for the following purposes:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Creating and managing your account</li>
                <li>
                  Providing matching services between individuals and friend
                  groups
                </li>
                <li>Enabling communication between users</li>
                <li>Sending important notifications</li>
                <li>Improving our services through analytics</li>
                <li>Ensuring platform safety and security</li>
                <li>Preventing fraud and misuse</li>
                <li>Complying with legal obligations</li>
              </ul>
              <p className="mt-3 font-medium">
                We do not share your mobile information with any third parties
                or affiliates for marketing or promotional purposes. Information
                sharing to subcontractors in support services, such as customer
                service, is permitted, but all other use cases exclude text
                messaging originator opt-in data and consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. SMS and Text Message Communications
              </h2>
              <p>
                Mixer uses SMS and text messages for various purposes,
                including:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Account verification and authentication</li>
                <li>Security alerts and notifications</li>
                <li>Important updates about your account or matches</li>
                <li>Information about new features or services</li>
                <li>Promotional messages (with your consent)</li>
              </ul>
              <p className="mt-3">
                By providing your phone number and using our service, you
                consent to receive text messages from Mixer. Message and data
                rates may apply. The frequency of messages varies based on your
                activity and preferences.
              </p>
              <p className="mt-3">
                You can opt out of receiving SMS messages at any time by texting
                "STOP" in response to any message you receive from us. You can
                also contact our support team to manage your messaging
                preferences.
              </p>
              <p className="mt-3">
                When you opt in to receive text messages from us, you will
                receive an immediate confirmation message containing:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Program description (Mixer)</li>
                <li>Customer care contact information</li>
                <li>Opt-out instructions</li>
                <li>Message frequency disclosure</li>
                <li>"Message and data rates may apply" disclosure</li>
              </ul>
              <p className="mt-3">
                Example opt-in confirmation: "You are successfully opted in for
                messages from Mixer for account notifications. Message and data
                rates may apply. Reply HELP for additional support. Reply STOP
                to unsubscribe."
              </p>
              <p className="mt-3">
                Example opt-out confirmation: "You have successfully been
                unsubscribed from Mixer. You will not receive any more messages
                from this number."
              </p>
              <p className="mt-3">
                Example help response: "Mixer: Please visit www.mixer.dating or
                email hey@mixer.dating for support. To opt-out, reply STOP."
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Consent to Receive Messages
              </h2>
              <p>
                We obtain your consent to receive text messages in the following
                ways:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  <strong>Website Opt-in:</strong> When you provide your phone
                  number on our website, you'll see clear language stating: "By
                  providing your phone number, you agree to receive text
                  messages from Mixer. Message and data rates may apply. Message
                  frequency varies."
                </li>
                <li>
                  <strong>In-App Opt-in:</strong> When you enable notifications
                  in our app, we clearly disclose that you'll receive text
                  messages.
                </li>
                <li>
                  <strong>Text Message Opt-in:</strong> You can opt in by
                  texting specific keywords like "START", "OPTIN", "IN" to our
                  designated number.
                </li>
              </ul>
              <p className="mt-3">
                Your consent is specific to our messaging program and is not
                transferable. We maintain records of your consent in compliance
                with industry regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Analytics and Tracking
              </h2>
              <p>
                We use analytics services (including PostHog) to understand how
                users interact with our app. This helps us improve our services
                and user experience. We track:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Feature usage and interactions</li>
                <li>User preferences and settings changes</li>
                <li>App performance metrics</li>
                <li>User engagement patterns</li>
                <li>Message interaction statistics</li>
                <li>Group creation and interaction data</li>
                <li>Notification response rates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. Data Storage and Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information. Your data is stored
                securely and we regularly review our security practices.
              </p>
              <p className="mt-2">
                While we use commercially reasonable measures to protect your
                data, no method of transmission or storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. Your Rights and Choices
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of certain data collection</li>
                <li>Hide your profile from other users</li>
                <li>Control your notification preferences</li>
                <li>Opt out of SMS messages by texting "STOP"</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                policy. You can request deletion of your account and associated
                data at any time through the app settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. Updates to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any significant changes through the app or via
                email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                10. Contact Information
              </h2>
              <p>
                If you have questions about this privacy policy or our privacy
                practices, please contact us at:
              </p>
              <p className="mt-2 font-medium">hey@mixer.dating</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                11. California Privacy Rights
              </h2>
              <p>
                If you are a California resident, you have additional rights
                under the California Consumer Privacy Act (CCPA), including the
                right to:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Know what personal data is being collected</li>
                <li>Know whether your personal data is sold or disclosed</li>
                <li>Say no to the sale of personal data</li>
                <li>Access your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>
                  Not be discriminated against for exercising your privacy
                  rights
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Waitlist;
