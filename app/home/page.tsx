import Hero from "./components/Hero";
import Message from "./components/Message";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Hero/>
      <Message/>
    </div>
  );
}