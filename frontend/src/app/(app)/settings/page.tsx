import type { Metadata } from "next";
import { Settings } from "@/components/app/settings";

export const metadata: Metadata = { title: "Settings · Flick" };

export default function SettingsPage() {
  return <Settings />;
}
