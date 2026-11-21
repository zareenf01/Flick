import type { Metadata } from "next";
import { NewDemo } from "@/components/app/new-demo";

export const metadata: Metadata = { title: "New demo · Flick" };

export default function NewDemoPage() {
  return <NewDemo />;
}
