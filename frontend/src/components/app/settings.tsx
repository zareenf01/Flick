"use client";

import { Laptop, Smartphone } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { Card, Field, Input } from "./controls";
import { PageHeader } from "./page-header";

const SESSIONS = [
  {
    device: "Chrome on macOS",
    place: "This device",
    last: "Active now",
    icon: Laptop,
    current: true,
  },
  {
    device: "Safari on iPhone",
    place: "Signed in Nov 19",
    last: "Last seen 2 days ago",
    icon: Smartphone,
  },
  {
    device: "Firefox on Windows",
    place: "Signed in Nov 2",
    last: "Last seen 3 weeks ago",
    icon: Laptop,
  },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t border-rule py-8 md:grid-cols-[260px_1fr] md:gap-10">
      <div>
        <h2 className="text-[15px] font-medium">{title}</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
          {description}
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function Settings() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader
        title="Settings"
        description="Your account, password and signed-in devices."
      />
      <div className="mt-8">
        <Section
          title="Profile"
          description="Shown on demos you share publicly."
        >
          <Card className="flex flex-col gap-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input defaultValue="Sam Carter" />
              </Field>
              <Field label="Email">
                <Input defaultValue="sam@lumen.so" type="email" />
              </Field>
            </div>
            <div className="flex justify-end">
              <button type="button" className={buttonClass("primary", "sm")}>
                Save changes
              </button>
            </div>
          </Card>
        </Section>

        <Section
          title="Password"
          description="Use at least 12 characters. You'll stay signed in on this device."
        >
          <Card className="flex flex-col gap-4 p-5">
            <Field label="Current password">
              <Input type="password" autoComplete="current-password" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <Input type="password" autoComplete="new-password" />
              </Field>
              <Field label="Confirm new password">
                <Input type="password" autoComplete="new-password" />
              </Field>
            </div>
            <div className="flex justify-end">
              <button type="button" className={buttonClass("primary", "sm")}>
                Update password
              </button>
            </div>
          </Card>
        </Section>

        <Section
          title="Devices"
          description="Everywhere you're signed in. Sign out of any device you don't recognise."
        >
          <Card className="divide-y divide-[#EDEEF1]">
            {SESSIONS.map(({ device, place, last, icon: Icon, current }) => (
              <div key={device} className="flex items-center gap-3 p-4">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#F2F3F5]">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[13.5px] font-medium">
                    {device}
                    {current && (
                      <span className="rounded-full bg-[#E9F7EE] px-2 py-0.5 text-[11px] font-medium text-[#1C7C43]">
                        This device
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[12.5px] text-muted">
                    {current ? last : `${place} · ${last}`}
                  </p>
                </div>
                {!current && (
                  <button
                    type="button"
                    className={buttonClass("secondary", "sm", "ml-auto")}
                  >
                    Sign out
                  </button>
                )}
              </div>
            ))}
            <div className="flex justify-end p-4">
              <button
                type="button"
                className="text-[13px] text-muted transition-colors hover:text-ink"
              >
                Sign out of all other devices
              </button>
            </div>
          </Card>
        </Section>

        <Section
          title="Delete account"
          description="Removes your demos, recordings and exports. This can't be undone."
        >
          <Card className="flex items-center gap-4 p-5">
            <p className="text-[13.5px] text-muted">
              6 demos and 14 exports will be deleted.
            </p>
            <button
              type="button"
              className="ml-auto h-8 shrink-0 rounded-full px-3.5 text-[13px] font-medium text-[#B42318] ring-1 ring-[#F3CFCB] transition-colors hover:bg-[#FBEDEA]"
            >
              Delete account
            </button>
          </Card>
        </Section>
      </div>
    </div>
  );
}
