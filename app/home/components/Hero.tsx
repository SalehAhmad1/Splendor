"use client";
import React, {useEffect, useState} from 'react';
import Carousel from '../../../components/ui/Carousel';

export default function Hero() {
    return (
        <div className='w-full p-4'>
            <div className='w-full bg-gradient-to-b-DustyRose-to-MutedGold p-4 rounded-t-md'>
                <h1 className='font-extrabold text-Beige text-4xl sm:text-6xl 
                font-sans text-center my-4 text-shadow-lg'>Introducing V-Fit</h1>
                <h1 className='text-center text-DeepBrown font-bold mb-4 text-lg'>Try Before You Buy - The Future of Fashion is Here!</h1>
            </div>
            <Carousel/>
        </div>
    )
}