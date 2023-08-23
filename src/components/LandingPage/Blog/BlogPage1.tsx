import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import BlogImg from '../../../assets/Blog1.png';
import Divider from "@mui/material/Divider";
import { Helmet } from 'react-helmet';


interface BlogPost {
    title: string;
    content: string;
    image: string;
    _id: string;
    headline: string;
}

const BlogPostPage = () => {


    return (
        <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-white via-gray-50 via-90% to-gray-100 to-95% relative">
            <Helmet>
                <title>Mastering Inbound: How SpeedLead Helps Companies Get More Sales</title>
                <meta name="description" content="Learn how SpeedLead, our ChatGPT AI-powered tool, helps businesses improve their response times and close more sales." />
            </Helmet>
            <div className="flex flex-col items-center justify-center md:mx-10 lg:mx-20 py-20">

                {(
                    <>
                        <h1 className="text-black mx-10 text-4xl md:text-6xl text-center font-semibold">
                            Mastering Inbound: 
                            How SpeedLead Helps Companies Get More Sales
                        </h1>
                        <h3 className="text-gray-400 mt-4 text-center font-semibold">
                            Last Updated: [May 5, 2023]
                        </h3>
                        <img
                            className="w-40 items-center justify-center mx-auto -4 h-auto md:w-80 md:h-auto rounded-lg mt-8"
                            src={BlogImg}
                            alt="SpeedLead AI-powered sales tool"
                        />

                        <main className="text-black text-lg mt-8 mx-8 md:mx-20 lg:mx-64 xl:mx-80">
                            <p className="my-4">
                                In today's fast-paced business environment, customers expect quick and personalized responses from the companies they reach out to. They want to feel valued and understood, and failing to deliver on this expectation can mean losing valuable sales opportunities. That's where an AI-powered tool like SpeedLead comes in.
                            </p>
                            {/* <img
                                className="w-20 items-center justify-center mx-auto -4 h-auto md:w-80 md:h-auto rounded-lg mt-8"
                                src={BlogImg}
                                alt={`GrowYourCompanyWithSpeedLead`}
                            /> */}
                            <p className="my-4">
                                SpeedLead is a powerful asset that helps companies respond faster and more effectively to inbound sales inquiries. With SpeedLead, companies can respond to clients within 90 seconds to 10 minutes after they reach out through a form on their website, with a personalized response tailored to their specific needs. 
                            </p>
                            <p className="my-4">
                                Studies have shown that customers who receive a response from a company in the first 5 minutes are 900% more likely to gain a connection. And if a client is contacted in under a minute they are 4x more likely to buy. When a potential client sends an email request, it's important to keep their attention and reach back to them while their focus is still on the service your business provides. A quick response time can give your business a competitive edge in its industry, as it can help you close deals faster than your competitors.
                            </p>
                            <p className="my-4">
                                But it's not just about closing more sales. SpeedLead also helps companies improve their response times, which is crucial for maintaining a positive reputation and building customer loyalty. With SpeedLead, companies can respond to inquiries faster and more consistently, which leads to higher customer satisfaction and better reviews. These positive reviews can lead to more sales opportunities and help your business stand out from the competition.
                            </p>
                            <p className="my-4">
                                In today's highly competitive business landscape, companies can't afford to miss out on valuable sales opportunities. With SpeedLead, companies can respond faster, more effectively, and more personalized than ever before, giving them a significant advantage over their competitors. This tool can help your business stay ahead of the curve in your industry, which is crucial for growth and success.
                            </p>
                            <p className="my-4">
                                In conclusion, a quick personalized response to email requests using an AI-powered tool like SpeedLead can make all the difference in closing sales, building customer loyalty, and gaining a competitive edge in your industry. If you want to take your business to the next level, consider giving SpeedLead a try and see the results for yourself.
                            </p>
                            <Divider />
                            <h1 className="text-black mx-10 mt-10 mb-2 text-2xl md:text-4xl text-center font-semibold">
                                SpeedLead
                            </h1>
                            <p className="my-6">
                                Want to learn more about SpeedLead? Check out our article detailing 6 ways SpeedLead will grow your company's revenue.
                            </p>
                            <div className="text-center items-center justify-center mx-auto mt-14"><a href="https://speedlead.xyz/blog/6-ways-speedlead-grows-your-revenue" className="text-center py-4 px-8 bg-red-600 cursor-pointer shadow-md hover:shadow-lg hover:bg-red-800  transition duration-100 text-white font-semibold rounded-2xl text-md">Grow Revenue</a></div>
                        </main>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogPostPage;
