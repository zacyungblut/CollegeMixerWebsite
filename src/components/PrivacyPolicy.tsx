import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black to-slate-900 relative">
        <main className="container mx-auto px-4 flex-grow">
          <div className="text-4xl md:text-5xl pt-8 text-center text-white font-bold mb-12 mt-8">Privacy Policy</div>
          <div className="w-3/4 md:w-1/2 mx-auto text-sm md:text-base text-gray-200 leading-relaxed">
            <p className="mb-4">
            Last updated: [April 21, 2023] <br></br><br></br>
            At SpeedLead, we value the privacy of our users and are committed to protecting their personal information. This Privacy Policy outlines how we access, use, store, and share Google user data when you connect your Gmail, Google Workspace, or Outlook email accounts to our platform.
            Please read this Privacy Policy carefully before using our services. By using SpeedLead, you agree to the collection and use of your information in accordance with this Privacy Policy.
            </p>
            <p className="mb-4">
            SpeedLead is the application requesting access to your Google user data. 
            We are a software company that helps users automate their email responses to potential clients. We maintain the confidentiality of our authorized client credentials to access Google API Services.
            </p>
            <p className="mb-4">
            We request access to the following types of data:
            <br></br><br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;Email metadata: subject, sender, recipient, and timestamp
            <br></br><br></br>
              &nbsp;&nbsp;&nbsp;&nbsp;Email content: body text
            <br></br><br></br>
            We request access to your email data to provide you with our email automation services. Our artificial intelligence algorithms analyze your inbound emails to identify potential clients and generate appropriate responses. 
            By providing access to your email data, you enable us to offer our services effectively.
            </p>
            <p className="mb-4">
            Our Privacy Policy and in-product privacy notifications are accurate, comprehensive, and easily accessible. We thoroughly disclose how our application interacts with your data in this Privacy Policy. We will only use your Google user data according to the practices disclosed in this Privacy Policy.
            If we change the way we use your data, we will notify you and prompt you to consent to an updated Privacy Policy before we use your data in a new way or for a different purpose than originally disclosed.
            </p>
            <p className="mb-4">
            We access your Google user data through Google API Services, which provide secure access to your email data.
            We store your data on secure servers protected by encryption and other security measures. We do not share your data with any third parties, except as necessary to provide our services or as required by law.
            We only request access to the data necessary to implement our application's features and services. We do not request access to information we do not need.
            </p>
            <p className="mb-4">
            We strictly adhere to Google API Services' policies and do not engage in any activity that may deceive users or Google about our use of their services.
            We accurately represent our application and do not misrepresent the data we collect or the actions we take on your behalf.
            </p>
            <p className="mb-4">
            SpeedLead is not directed at children under the age of 13, and we do not knowingly collect personal information from children under the age of 13.
            </p>
            <p className="mb-4">
            We take reasonable and appropriate steps to protect our applications, systems, and any data derived from Google API Services against unauthorized or unlawful access, use, destruction, loss, alteration, or disclosure.
            </p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.          </div>
          <div className="flex justify-center">
            <Link to="/" className="bg-rose-800 hover:bg-orange-600 mb-14 text-white text-xl font-semibold py-2 px-8 rounded-full mx-auto mt-14 transition duration-200 ease-in-out transform hover:scale-105">
              Home
            </Link>
          </div>
        </main>
        {/* <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-pink-600 to-orange-400 clip-path-u-shape"></div> */}
      </div>
      {/* <div className="flex flex-col h-1/4 font-sans bg-orange-400 relative"></div> */}
    </>
  );
};

export default PrivacyPage;
