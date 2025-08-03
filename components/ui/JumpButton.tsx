'use client';
export default function JumpButton() {
    return (
        <button className="jump-button absolute bottom-10 right-10 px-4 py-4 rounded-full bg-DeepGold border-2 border-orange-500 hover:px-5 hover:py-5 transition-all -translate-y-20 md:translate-y-0" onClick={() => window.scrollTo(0, 0)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
        </button>
    )
}