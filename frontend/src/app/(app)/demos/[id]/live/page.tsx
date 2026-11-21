import type { Metadata } from "next";
import { LiveRecording } from "@/components/app/live-recording";

export const metadata: Metadata = { title: "Live · Flick" };

export default function LiveRecordingPage() {
  return <LiveRecording />;
}
