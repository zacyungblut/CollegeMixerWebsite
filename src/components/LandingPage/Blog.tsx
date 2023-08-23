import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogImg1 from '../../assets/Lost.svg';
import blogImg2 from '../../assets/Lost.svg';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { getBlogPosts } from '../../actions/blogPost';
import BlogImg1 from '../../assets/Blog1.png';
import BlogImg2 from '../../assets/Blog2.png';
import BlogImg3 from '../../assets/Blog3.png';
import BlogImg4 from '../../assets/Blog4.png';
import BlogImg5 from '../../assets/Blog5.png';
import BlogImg6 from '../../assets/Blog6.png';
import BlogImg7 from '../../assets/Blog7.png';







interface BlogPost {
    title: string;
    image: any;
    linkText: string;
}


const Blog = () => {

    useEffect(() => {
        document.title = 'SpeedLead Blog';
      }, []);

    const BlogsList = [
        {
            title: "How Speed to Lead Time Can Make or Break Your Business",
            image: BlogImg5,
            linkText: 'how-speed-to-lead-can-make-or-break-your-business',
        },
        {
            title: "SpeedLead: The Best Alternative to Calendly and Chatbots",
            image: BlogImg4,
            linkText: 'alternative-to-calendly-and-chatbots',
        },
        {
            title: "3 Ways to Improve Speed to Lead",
            image: BlogImg7,
            linkText: '3-ways-to-improve-speed-to-lead',
        },
        {
            title: "The Human Touch: How Speed Lead Balances Automation with Empathy in Sales",
            image: BlogImg6,
            linkText: 'how-speed-lead-balances-automation-with-empathy',
        },
        {
            title: "6 Powerful Ways SpeedLead Skyrockets Your Company's Revenue",
            image: BlogImg2,
            linkText: '6-ways-speedlead-grows-your-revenue',
        },
        {
            title: 'Mastering Inbound Inquiries: How SpeedLead Helps Companies Get More Sales',
            image: BlogImg1,
            linkText: 'mastering-inbound-inquiries',
        },
        {
            title: "3 Reasons Inbound Sales Are More Effective than Outbound Sales",
            image: BlogImg3,
            linkText: '3-reasons-inbound-sales-are-effective',
        },

    ]

    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BlogsList);




    return (
        <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-white via-gray-50 via-90% to-gray-100 to-95% relative">
        <div className="flex flex-col items-center justify-center md:mx-10 lg:mx-20 pt-12 pb-6">
            <h1 className="text-black text-4xl md:text-7xl font-semibold">
            Read Our <span className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">Blog Posts</span>
            </h1>
            <h3 className="text-gray-800 text-xl md:text-2xl mt-6 ml-2">Learn how to grow your business using the power of <span className="underline">automatic inbound responses.</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-20">
            {blogPosts && blogPosts.map((blog, index) => (
            <Link to={`/blog/${blog.linkText}`}><div key={index} className="flex flex-col items-center mb-8">
                <img
                    className="w-80 h-auto md:w-80 md:h-auto rounded-xl hover:opacity-95"
                    src={blog.image}
                    alt={`Blog post ${index + 1}`}
                />
                <h2 className="text-black text-center text-xl md:text-2xl font-semibold mt-4 xl:mx-28">
                {blog.title}
                </h2>
                {/* <h3 className="text-gray-400 mt-1 text-center font-semibold">
                            Last Updated: [May 10, 2023]
                </h3> */}
            </div></Link>
            ))}
        </div>

        {/* <div className="text-center bg-gray-700 bg-opacity-20 shadow-2xl rounded-3xl mx-2 px-4 md:mx-20 lg:mx-64 xl:mx-80 py-12 mb-10 mt-10">
            <div className="text-white mb-4 text-2xl md:text-4xl font-semibold">
            Don't Miss Out
            </div>
            <div className="mb-10 text-sm text-white">
            Subscribe to our blog and stay updated on the latest insights
            </div>
            <Link to="/subscribe" className="bg-pink-900 hover:bg-orange-600 text-white text-lg font-semibold py-4 px-8 mb-10  rounded-2xl mx-auto mt-8 transition duration-200 ease-in-out transform hover:scale-105">
            Subscribe
            </Link>
        </div> */}
        </div>
    );
};

export default Blog;
