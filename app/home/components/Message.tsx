"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Message() {
    const router = useRouter();
    const handleGetStarted = () => {
        router.push('/latest');
    }

    return (
        <div className='min-h-40 lg:min-h-28 w-full p-4'>
            <div className='w-full p-4'>
                <h1 className='font-extrabold text-DeepBrown sm:text-6xl text-4xl font-sans my-4 text-shadow'>How it Works</h1>
                <h1 className='text-DustyRose font-extrabold mb-4 text-xl'>✔ <b className='text-DeepBrown'>V-Fit:</b> Instantly see how clothes look on you using AI.</h1>
                <h1 className='text-DustyRose font-extrabold mb-4 text-xl'>✔ <b className='text-DeepBrown'>Body Measurements Estimation:</b> Get an accurate measurements effortlessly.</h1>
                <h1 className='text-DustyRose font-extrabold mb-4 text-xl'>✔ <b className='text-DeepBrown'>A Seamless Shopping Experience:</b> Precision, convenience, and style—all in one place.</h1>
            </div>
            <div className="callToActionBtn flex justify-center">
                <button className='bg-gradient-to-b-DustyRose-to-MutedGold text-DeepBrown hover:text-yellow-200 font-bold md:py-8 px-8 py-4 md:px-20 rounded-full sm:text-4xl hover:md:px-24 hover:md:py-10 hover:px-10 hover:py-6 transition-all mt-8 shadow-md hover:shadow-amber-900' onClick={handleGetStarted}>Get Started</button>
            </div>
        </div>
    )
}