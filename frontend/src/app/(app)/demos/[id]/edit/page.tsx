import type { Metadata } from "next";
import { Editor } from "@/components/app/editor";

export const metadata: Metadata = { title: "Editor · Flick" };

export default function EditorPage() {
  return <Editor />;
}
