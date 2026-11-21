import { DemoHeader } from "@/components/app/demo-header";

export function generateStaticParams() {
  return [{ id: "lumen-create-task" }];
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DemoHeader />
      {children}
    </>
  );
}
