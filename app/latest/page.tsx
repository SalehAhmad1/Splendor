"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClothingItem from '@/model/ClothingItemModel';
import Image from 'next/image';

export default function Page() {
    const router = useRouter();
    const [clothingData, setClothingData] = useState<ClothingItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<ClothingItem | null>(null);

    const handleVfit = () => {
        console.log('Trying Virtually');
        router.push('/vfit?item=' + selectedImage?.image);
    }

    const handleSizeMeasurements = () => {
        console.log('Getting size recommendations');
        router.push(`/heightmodel?image=${selectedImage?.image}&title=${selectedImage?.title}&for=${selectedImage?.for}&category=${selectedImage?.category}`);
    }

    const handleImageClick = (item: ClothingItem) => {
        console.log('Image clicked');
        setSelectedImage(item);
    }

    const closeModal = () => {
        setSelectedImage(null);
    }

    // Fetch clothing data (GET request)
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching clothing data...');
                const response = await fetch('/api/latest-clothes');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Clothing data fetched:', data);
                setClothingData(data);
            } catch (error) {
                console.error('Error fetching clothing data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='min-h-screen w-full p-4'>
            {selectedImage && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
                    <div className="modal flex flex-col sm:flex-row gap-1 md:gap-24 min-h-10 min-w-10 max-w-3xl max-h-dvh md:max-h-[29rem] m-8 sm:m-16 relative border-2 border-DeepGold rounded-lg shadow-xl bg-LimelightLightGreen p-4">
                        <div className="close absolute top-3 right-3">
                            <button type='button' onClick={closeModal} className='rounded-full bg-DeepGold text-white py-1 px-3 hover:px-4 hover:py-2 hover:translate-x-1 hover:-translate-y-1 transition-all font-bold hover:cursor-pointer'>X</button>
                        </div>
                        <div className="img flex justify-center">
                            <Image src={selectedImage.image} alt={selectedImage.title} width={250} height={200} className='rounded-lg h-full md:w-full w-1/3'/>
                        </div>
                        <div className="data flex flex-col justify-center items-start gap-8">
                            <h1 className="text-base sm:text-2xl font-bold">{selectedImage.title}</h1>
                            <p>{selectedImage.description}</p>
                            <p><b>For:</b> {selectedImage.for}</p>
                            <p><b>Category:</b> {selectedImage.category}</p>
                            <p><b>Price:</b> {selectedImage.price}</p>
                            <div className="modalBtns flex gap-4 justify-center items-between w-full">
                                <button type='button' onClick={handleVfit} className='rounded-xl bg-DeepGold text-white py-2 px-4 hover:px-6 hover:py-4 xl:py-4 xl:px-8 font-bold text-xs lg:text-lg hover:cursor-pointer transition-all hover:translate-x-1'>Try Virtually</button>
                                <button type='button' onClick={handleSizeMeasurements} className='rounded-xl bg-MutedOliveGreen text-white py-2 px-3 hover:px-6 hover:py-4 xl:py-4 xl:px-6 font-bold text-xs lg:text-lg hover:cursor-pointer transition-all hover:translate-x-1'>Get your size recommendation</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid sm:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4">
                {clothingData.length > 0 ? (
                    clothingData.map((item, i) => (
                        <div key={i} className="ImageContainer rounded-lg relative">
                            <Image src={item.image} alt={item.title} width={300} height={200} className='mainImage rounded-lg h-full w-full hover:w-11/12 hover:h-5/6 hover:opacity-50 hover:cursor-pointer' onClick={() => handleImageClick(item)}/>
                        </div>
                    ))
                ) : (
                    null
                )}
            </div>
        </div>
    )
};