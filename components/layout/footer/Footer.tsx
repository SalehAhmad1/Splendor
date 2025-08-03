"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Logo from '../../../public/logo.png'
import { useRouter } from 'next/navigation'
import Phone from '../../../public/phone.png'
import Email from '../../../public/email.png'
import myLocation from '../../../public/location.png'
import whatsapp from '../../../public/whatsapp.png'
import Link from 'next/link'

const Footer = () => {
    const router = useRouter();
    const handleLogoOnClick = () => {
        router.push('/');
    }
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 750);
    };

    useEffect(() => {
        handleResize(); // Check initial screen size
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

  return (
    <div className="footer bg-LimelightLightGreen">
        <hr className='border-lightGrayDivider'/>
        <div className="min-h-96 h-auto grid md:grid-cols-5 gap-4 p-4 auto-rows-min md:auto-cols-min">
            <div id="brandInfo" className='flex flex-col gap-4 md:col-span-2 md:row-span-2 items-center text-justify'>
                <Image src={Logo} alt='Logo' width={200} height={150} onClick={handleLogoOnClick} className='rounded-xl cursor-pointer'/>
                <p className='text-xl font-extrabold font-SantaMonicaSans cursor-pointer' onClick={handleLogoOnClick}>Be You Boldly</p>
                <p>Splendor is a cutting-edge eCommerce platform designed for both men and women, redefining the online shopping experience. Our standout feature, <b>V-Fit</b>, uses advanced AI-powered computer vision to let you virtually try on clothes, ensuring a perfect fit before you buy. Additionally, our innovative <b>body measurements estimation tool</b> allows users to accurately measure their body measurements simply by standing in front of the camera—no manual measurements needed!</p>
            </div>
            {isMobile && <hr className='border-t border-slate-300'/>}
            <div id="informationSection" className='flex flex-col gap-4 text-DeepBrown md:row-span-2'>
                <h1 className='text-2xl font-extrabold font-SantaMonicaSans'>Information</h1>
                <Link href='' className='hover:text-MutedOliveGreen hover:text-lg transition-all'>About Us</Link>
                <Link href='' className='hover:text-MutedOliveGreen hover:text-lg transition-all'>Privacy Policy</Link>
                <Link href='' className='hover:text-MutedOliveGreen hover:text-lg transition-all'>Terms and Conditions</Link>
            </div>
            {isMobile && <hr className='border-t border-slate-300'/>}
            <div id="CustomerService" className='flex flex-col gap-4 text-DeepBrown md:row-span-2'>
                <h1 className='text-2xl font-extrabold font-SantaMonicaSans'>Customer Service</h1>
                <Link href='' className='hover:text-MutedOliveGreen hover:text-lg transition-all'>FAQ</Link>
                <Link href='' className='hover:text-MutedOliveGreen hover:text-lg transition-all'>Shipping</Link>
                <Link href='' className='hover:text-MutedOliveGreen hover:text-lg transition-all'>Return Policy</Link>
            </div>
            {isMobile && <hr className='border-t border-slate-300'/>}
            <div id="Contact" className='flex flex-col gap-4 text-DeepBrown md:row-span-2'>
                <h1 className='text-2xl font-extrabold font-SantaMonicaSans'>Contact</h1>
                <div className="phone flex items-center">
                    <Image src={Phone} alt='phone' width={20} height={20} /> &nbsp;
                    <Link href='tel:+923410073067' className='hover:text-MutedOliveGreen hover:text-lg transition-all'>+92-341-0073067</Link>
                </div>
                <div className="whatsapp flex items-start">
                    <Image src={whatsapp} alt='phone' width={20} height={20} /> &nbsp;
                    <Link href='https://wa.me/03410073067' target="_blank" className='hover:text-MutedOliveGreen hover:text-lg transition-all'>+92-341-0073067</Link>
                </div>
                <div className="email flex items-start">
                    <Image src={Email} alt='email' width={20} height={20} /> &nbsp;
                    <Link href='mailto:SplendorFit143@gmail.com' className='hover:text-MutedOliveGreen hover:text-lg transition-all' style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>SplendorFit143@gmail.com</Link>
                </div>
                <div className="location flex items-start">
                    <Image src={myLocation} alt='location' width={20} height={20} /> &nbsp;
                    <p>1234 Splendor Lane, Splendor City, Splendor State, 12345</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer