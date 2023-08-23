import React, { useState } from 'react';
import powerImg from '../../assets/power.jpg';
import { Link } from 'react-router-dom';
import fingerImg from '../../assets/finger.png';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { createBlogPost } from '../../actions/blogPost';
import { CircularProgress } from '@mui/material';


const BlogPost = () => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<any>('');
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('stuff is', title, content, image, userToken);
    if (title === '' || content === '' || image === '' || userToken==='') {
      alert("Please complete all fields");
      setIsLoading(false);
      return;
    }

    await dispatch(createBlogPost(title, content, image, userToken));

    // Clear the form fields
    setTitle('');
    setContent('');
    setImage('');
    setIsLoading(false);
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black via-slate-950 via-90% to-slate-900 to-95% relative">
      <div className="flex flex-row items-center justify-between md:mx-10 lg:mx-20 pt-20 pb-8">
        <div className="w-full text-center">
            <h1 className="text-white text-4xl mb-4 md:text-7xl font-semibold">
                Post a New <span className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Blog</span>
            </h1>
            <h3 className="text-gray-100 text-lg lg:px-64 md:text-2xl mt-6 ml-2">This page is for admin use only - you must be signed in under an admin account to post.</h3>
        </div>

      </div>

      <form className="w-full max-w-lg mx-auto p-4" onSubmit={handleSubmit}>
        <div className="flex flex-wrap mb-4">
          <div className="w-1/2 px-2 mt-4">
            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="name">
              Title
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="name" type="text" placeholder="John Doe" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="w-1/2 px-2 mt-4">
            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="email">
              Image
            </label>
            <input
                className="appearance-none block w-full border text-white border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />          
        </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="message">
              Content
            </label>
            <textarea className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-64 resize-none" onChange={(e)=> setContent(e.target.value)} id="message" placeholder="Try asking about how SpeedLead can transform your business" value={content}></textarea>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {!isLoading ? (
            <button
              className="bg-white mx-auto hover:bg-red-900 hover:text-white text-black font-bold mb-3 py-2 px-4 transition duration-200 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Post
            </button>
          ) : (
            <CircularProgress
              className="items-center justify-center"
              size={28}
              style={{ color: '#ffffff' }}
            />
          )}
        </div>
      </form>

      
    </div>
  );
};

export default BlogPost;
