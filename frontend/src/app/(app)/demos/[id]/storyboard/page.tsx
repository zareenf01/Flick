import type { Metadata } from "next";
import { Storyboard } from "@/components/app/storyboard";

export const metadata: Metadata = { title: "Storyboard · Flick" };

export default function StoryboardPage() {
  return <Storyboard />;
}
