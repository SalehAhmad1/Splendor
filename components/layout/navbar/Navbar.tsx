"use client";
import React from 'react'
import {useEffect, useState, useRef} from 'react'
import Image from 'next/image'
import ShoppingBag from '../../../public/shoppingBag.png'
import AnimatedBag from '../../../public/icons8-shopping-bag.gif'
import Search from '../../../public/search.svg'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const router = useRouter();
    const handleLogoOnClick = () => {
        router.push('/');
    }

    const searchOverlayRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchOverlayRef.current && !searchOverlayRef.current.contains(event.target as Node)) {
                searchOverlayRef.current.classList.replace('block', 'hidden');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    const [onHoverBag, setOnHoverBag] = useState(false);

    useEffect(() => {
        const shopItems = document.getElementById('shopItems');
        const screenSize = document.documentElement.clientWidth;
        if(screenSize < 768){
            setOnHoverBag(true);
        }
        else{
            shopItems?.addEventListener('mouseenter', () => {
                setOnHoverBag(true);
            });
            shopItems?.addEventListener('mouseleave', () => {
                setOnHoverBag(false);
            });
        }
    },[onHoverBag]);


    const handleSearch = () => {
        const searchOverlay = searchOverlayRef.current;
        searchOverlay?.classList.replace('hidden', 'block');
    }


  return (
    <div className="nav">
        <div ref={searchOverlayRef} id='searchOverlay' className="hidden w-full bg-white h-auto min-h-40 rounded-md absolute z-10 shadow-2xl transition-all">
            <input type="text" id='SearchInput' name="search" className='w-full rounded-md pl-10 placeholder-slate-600 bg-transparent border-none' placeholder='Search'/>
        </div>
        <div className='min-h-20 p-4 flex  justify-between sticky bg-MutedGold'>
            <h1 className='text-3xl cursor-pointer transition-all font-extrabold font-SantaMonicaSans h-10 mt-2' onClick={handleLogoOnClick}>Splendor</h1>
            <form id='searchBar' className='md:w-2/4 md:shadow-xl md:h-10 hover:md:w-3/5 mt-1 transition-all' onSubmit={()=>{}}>
                <Image src={Search} alt='searchIcon' className='absolute mt-2 md:ml-2 ml-12 sm:ml-52' onClick={handleSearch}/>
                <input type="text" id='SearchInput' name="search" className='w-full rounded-md pl-10 placeholder-slate-600 bg-transparent border-none md:border-2 md:border-black md:bg-white md:block hidden' placeholder='Search'/>
            </form>
            <div id='shopItems' className="mt-2">
                <Image src={onHoverBag ? AnimatedBag : ShoppingBag} alt='logo' width={30} height={30} className='hover:cursor-pointer hover:size-8 transition-all'/>
            </div>
        </div>
        
        <div className="bg-SlateGray pt-1">
            <div className="filterItems flex md:gap-8 gap-4 justify-center text-MutedGold font-extrabold min-h-7">
                <Link href='/home' className='hover:text-DeepGold hover:text-xl hover:-mt-1 transition-all'>Home</Link>
                <Link href='/latest' className='hover:text-Beige hover:text-xl hover:-mt-1 transition-all'>Latest</Link>
                <Link href='/men-wear' className='hover:text-MutedOliveGreen hover:text-xl hover:-mt-1 transition-all'>Men</Link>
                <Link href='/women-wear' className='hover:text-DustyRose hover:text-xl hover:-mt-1 transition-all'>Women</Link>
                
            </div>
        </div>
    </div>
  )
}

export default Navbar