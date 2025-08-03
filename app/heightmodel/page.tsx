"use client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { useSearchParams } from 'next/navigation';

export default function HeightModel() {
    const searchParams = useSearchParams();
    const image = searchParams.get('image');
    const title = searchParams.get('title');
    const gender = searchParams.get('for');
    const category = searchParams.get('category');
    
    return (
        <App image={image} title={title} gender={gender} category={category}/>
    );
};

// Command to install the separate Application in the main Application
// npm install git+ssh://git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
// npm install git+ssh://git@github.com:vectoraico/BodySizing.git
// npm install https://github.com/vectoraico/BodySizing.git