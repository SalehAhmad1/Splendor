"use client";

import { HashLoader } from "react-spinners";


export default function Loading() {

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <HashLoader color="#D4A373" size={50} />
    </div>
  );
}