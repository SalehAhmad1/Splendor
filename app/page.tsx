import { redirect } from 'next/navigation';
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Index() {
  redirect('/home');
}
