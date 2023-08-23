import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import BlogImg from '../../../assets/Blog6.png';
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
                <title>The Human Touch: How Speed Lead Balances Automation with Empathy in Sales</title>
                <meta name="description" content="Learn why cookie-cutter bland responses just won't cut it in 2023, and how your company can not only thrive, but also survive using super personalized responses" />
            </Helmet>
            <div className="flex flex-col items-center justify-center md:mx-10 lg:mx-20 py-20">
                {(
                    <>
                        <h1 className="text-black mx-10 text-4xl md:text-6xl text-center font-bold">
                            The Human Touch: How Speed Lead Balances Automation with Empathy in Sales
                        </h1>
                        <h2 className="text-gray-500 mt-10 text-xl md:text-2xl text-center font-semibold">
                            Why Adding a Personalized Touch Will Catapult Your Business To New Heights
                        </h2>
                        <h3 className="text-gray-400 mt-4 text-center font-semibold">
                            Last Updated: [May 6, 2023]
                        </h3>
                        <img
                            className="w-40 items-center justify-center mx-auto -4 h-auto md:w-80 md:h-auto rounded-lg mt-8"
                            src={BlogImg}
                            alt="EmpathyInSales"
                        />
                        <main className="text-black text-lg mt-8 mx-8 md:mx-20 lg:mx-64 xl:mx-80">
                            <p className="my-4">
                                Technology is advancing at an unprecedented pace, and businesses are increasingly relying on automation to improve their efficiency and reduce costs. However, in the rush to automate, many companies forget the importance of the human touch in sales and customer service. Research shows that customers are more likely to buy from companies that provide a warm and personalized response. In this blog post, we will discuss the importance of adding the human touch to sales, and how at SpeedLead, we use a ChatGPT AI automated response process to strike a balance between automation and empathy, providing a personalized and effective customer experience.
                            </p>
                            <h3 className="text-black mt-10 text-xl md:text-2xl text-center font-semibold">
                                The Importance of Personalization
                            </h3>
                            <p className="my-4">
                                Firstly, let's talk about the importance of the human touch in sales and customer service. Customers like to know that they are being thought of and cared for. According to Salesforce, <a href="https://www.forbes.com/sites/blakemorgan/2020/02/18/50-stats-showing-the-power-of-personalization/?sh=408678172a94" target="_blank" className="underline text-blue-500 hover:text-blue-600">84% of consumers</a> say being treated like a person, not a number, is very important to winning their business. Customers who receive a personalized response are more likely to buy from the company. The study found that customers perceive the warmth of the response as an indication of the company's willingness to help. Therefore, a personalized response can make a customer feel valued and cared for, leading to increased customer satisfaction and loyalty.
                            </p>
                            <p className="my-4">
                                At SpeedLead, we understand the importance of the human touch. While we are an automation platform, we put a huge emphasis on ensuring that every response is personalized exactly to your needs. Our platform allows you to choose the <span className="italic">tone, intent, and even the personality</span> of the response, ensuring that your customers feel that a real person is attending to their needs.
                            </p>
                            <h3 className="text-black mt-10 text-xl md:text-2xl text-center font-semibold">
                                Mixing Personalization with Speed
                            </h3>
                            <p className="my-4">
                                We believe that the speed of the response is also crucial to making the customer feel valued. Customers appreciate a quick response to their inquiries, as it shows that the company is proactive and attentive to their needs. A quick response can also <span className="font-semibold">increase the likelihood of closing a sale</span> and reduce the chance of the customer going to a competitor.
                            </p>
                            <p className="my-4">
                                SpeedLead's automation features help ensure that a quick response is provided to every inquiry. With our platform, you can choose the time it takes to respond, with options ranging from 90 seconds to 10 minutes. At SpeedLead, we use ChatGPT artificial intelligence to craft hyper-personalized responses that work for your business and meet your customer's needs.
                            </p>
                            <p className="my-4">
                                It is essential to strike a balance between automation and empathy to provide a personalized and effective customer experience. The human touch is crucial to making customers feel valued and cared for, leading to increased customer satisfaction and loyalty. At SpeedLead, we have developed an automation platform that not only provides a quick response but also ensures that every response is personalized exactly to the needs of the customer. We believe that by using speed and personalization together, we can maximize the output for the customer, making their experience the best possible.
                            </p>
                            <Divider />
                            <h1 className="text-black mx-10 mt-10 mb-2 text-2xl md:text-4xl text-center font-semibold">
                                SpeedLead
                            </h1>
                            <p className="my-4">
                                If you want to learn more about SpeedLead here is an article on the <a href="https://www.google.com/url?q=https://speedlead.xyz/blog/6-ways-speedlead-grows-your-revenue" target="_blank" className="underline text-blue-500 hover:text-blue-600">6 ways that SpeedLead can increase your companies revenue</a>
                            </p>
                            <p className="my-4">
                                To learn more about the process of speed to lead that inspired the creation SpeedLead and how it can make or break your business check out <a href="https://speedlead.xyz/blog/how-speed-to-lead-can-make-or-break-your-business" target="_blank" className="underline text-blue-500 hover:text-blue-600">this article</a>.
                            </p>

                            <p className="my-6">
                                To get started sparking <span className="font-bold">massive</span> growth for your business, check out our flexible pricing options to find a plan that suites your needs today!
                            </p>

                            <div className="text-center items-center justify-center mx-auto mt-10"><a href="https://speedlead.xyz/pricing" className="text-center py-4 px-8 bg-red-600 cursor-pointer shadow-md hover:shadow-lg hover:bg-red-800 transition duration-100 text-white font-semibold rounded-2xl text-2xl">Pricing</a></div>
                        </main>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogPostPage;
