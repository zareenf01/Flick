import type { Metadata } from "next";
import { Share } from "@/components/app/share";

export const metadata: Metadata = { title: "Share · Flick" };

export default function SharePage() {
  return <Share />;
}
