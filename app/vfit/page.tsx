"use client";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import VfitLogo from "@/public/vFit_nobg.png";
import Loading from '@/app/vfit/loading';

export default function VFit() {
  const searchParams = useSearchParams();
  const image = searchParams.get('item');
  // const url = 'https://5249-182-183-104-247.ngrok-free.app/try_dual';
  // const url = 'http://13.234.44.185:5000/try_dual';
  // const url = 'https://13.234.44.185/try_dual';
  const url = 'https://splendor.13.234.44.185.nip.io/try_dual';
  const [modelImageFile, setModelImageFile] = useState<File | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setModelImageFile(file);
    }
  };

  const fetchClothImageAsBlob = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch cloth image');
    }
    return await response.blob();
  };

  async function handleVfitFunctionality(action: string) {
    if (action === 'again') {
      setOutputImage(null);
      setModelImageFile(null);
      return;
    }

    console.log('Trying Virtually');
    if (!modelImageFile || !image) {
      console.error('Model image or cloth image is missing');
      alert('Please select a model to try-on');
      return;
    }
    setLoading(true);
    try {
      const clothImageBlob = await fetchClothImageAsBlob(image);

      const formData = new FormData();
      formData.append('personImage', modelImageFile);
      formData.append('clothImage', clothImageBlob, 'cloth.jpg');

      // Set up a 15-minute timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 900000); // 15 minutes in milliseconds

      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          // This meta header tells modern browsers to try allowing mixed content
          // headers: {
          //   'Access-Control-Allow-Origin': '*',
          // },
          // Force non-secure requests 
          mode: 'cors',
          signal: controller.signal
        });

        clearTimeout(timeoutId); // Clear timeout on successful fetch

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resultBlob = await response.blob();
        const imageUrl = URL.createObjectURL(resultBlob);
        setOutputImage(imageUrl);

        console.log('Successfully fetched and displayed the try-on image.');
      } catch (fetchError) {
        clearTimeout(timeoutId); // Clear timeout on fetch error
        if ((fetchError as Error).name === 'AbortError') {
          console.error('Request timed out after 15 minutes');
          alert('Request timed out. Please try again.');
        } else {
          throw fetchError; // Re-throw other errors to be caught by the outer catch
        }
      }
    } catch (error) {
      console.error('Error fetching try-on data:', error);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    !loading ? (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-around m-4">
      <div className="logo">
        <Image src={VfitLogo} alt="logo" width={200} height={200} />
      </div>
      <div>
        <p className="text-2xl text-center font-bold font-TheGlorious max-w-screen-sm whitespace-pre-line">Choose your picture to try on.</p>
        <p className="text-2xl text-center font-bold font-TheGlorious max-w-screen-sm whitespace-pre-line">(Recommended to have full body size and front facing)</p>
      </div>
      <div className="imagesData flex md:flex-row flex-col gap-8 items-center">
        <Image src={image!} alt="Selected Image" width={200} height={200} className='rounded-lg'/>
        {!modelImageFile && <input type="file" name="model" id="model" onChange={handleFileChange} />}
        {modelImageFile && <img src={URL.createObjectURL(modelImageFile)} alt="Model Image" width={200} height={200} className='rounded-lg' />}   
      </div>
      <div className="btnAndOutput flex flex-col gap-8 items-center pb-8">
        {!outputImage && <button type="button" onClick={() => handleVfitFunctionality('')} className='bg-red-600 rounded-lg px-5 py-2 hover:px-7 hover:py-4 text-2xl hover:text-3xl hover:text-white font-extrabold transition-all mb-8 font-serif'>Try Vfit Now</button>}
        {outputImage && <p className='text-4xl font-serif font-extrabold animate-color-change-and-bounce transition-all'>See the Magic</p>}
        {outputImage && <img src={outputImage} alt="Output Image" width={400} height={400} className='rounded-lg' />}
        <div className={`btns gap-8 ${outputImage ? 'flex' : 'hidden'} md:flex-row flex-col mx-4`}>  
          {outputImage && <button type="button" onClick={() => handleVfitFunctionality('again')} className='bg-red-600 rounded-lg px-4 md:py-2 py-3 hover:px-5 hover:py-3 md:text-2xl text-base hover:text-xl hover:text-white font-extrabold transition-all max-w-60 font-serif'>Try with another Image</button>}
          {outputImage && <button type="button" onClick={() => router.back()} className='bg-red-600 rounded-lg px-4 md:py-2 py-3 hover:px-5 hover:py-3 md:text-2xl text-base hover:text-xl hover:text-white font-extrabold transition-all max-w-60 font-serif'>Try another Cloth</button>}
        </div>
        
      </div>
    </div>
    ) : (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 relative">
        <h1 className="absolute top-56 z-30 text-5xl text-center font-bold font-TheGlorious max-w-screen-sm whitespace-pre-line transition-all animate-color-change-and-pulse text-nowrap">Bringing Magic to your World!</h1>
        <Loading />
      </div>
    )
  );
}

