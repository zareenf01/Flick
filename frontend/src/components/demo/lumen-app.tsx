import {
  CalendarDays,
  Check,
  ChevronDown,
  FolderKanban,
  Inbox,
  ListTodo,
  Lock,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { lerp } from "@/lib/timeline";
import { TASK_NAME, type LumenState } from "./lumen-script";

const PEOPLE = {
  JL: { name: "Jordan Lee", color: "#8B7CF6" },
  AR: { name: "Alex Rivera", color: "#3B82F6" },
  MC: { name: "Maya Chen", color: "#14B8A6" },
  SO: { name: "Sam Okafor", color: "#F59E0B" },
} as const;

type Person = keyof typeof PEOPLE;

const PROJECTS = {
  web: { name: "Website relaunch", color: "#14B8A6" },
  mobile: { name: "Mobile app", color: "#4C6FFF" },
  q1: { name: "Q1 planning", color: "#22C55E" },
  hiring: { name: "Hiring", color: "#A855F7" },
} as const;

type Project = keyof typeof PROJECTS;

const ROWS: { title: string; project: Project; person: Person; due: string }[] =
  [
    {
      title: "Review onboarding copy",
      project: "web",
      person: "JL",
      due: "Nov 24",
    },
    {
      title: "Fix login redirect on Safari",
      project: "mobile",
      person: "AR",
      due: "Nov 25",
    },
    { title: "Draft Q1 roadmap", project: "q1", person: "MC", due: "Nov 27" },
    {
      title: "Interview: product designer",
      project: "hiring",
      person: "SO",
      due: "Nov 28",
    },
    {
      title: "Update pricing page",
      project: "web",
      person: "JL",
      due: "Dec 1",
    },
    {
      title: "Write release notes for 2.4",
      project: "mobile",
      person: "MC",
      due: "Dec 2",
    },
    { title: "Plan team offsite", project: "q1", person: "AR", due: "Dec 5" },
  ];

const ROW_HEIGHT = 56;

export const IDLE_STATE: LumenState = {
  newPressed: false,
  modal: 0,
  typed: "",
  titleFocused: false,
  typing: false,
  caretOn: false,
  assigneeFocused: false,
  dropdown: 0,
  mayaHover: false,
  assigned: false,
  createPressed: false,
  newRow: 0,
  highlight: 0,
  check: 0,
  strike: 0,
  done: false,
};

function Avatar({ person, size = 24 }: { person: Person; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: PEOPLE[person].color,
        fontSize: size * 0.4,
      }}
    >
      {person}
    </span>
  );
}

function ProjectTag({ project }: { project: Project }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F4F4F1] px-2 py-1 text-[12px] text-[#55575E]">
      <span
        className="size-1.5 rounded-full"
        style={{ background: PROJECTS[project].color }}
      />
      {PROJECTS[project].name}
    </span>
  );
}

function Row({
  title,
  project,
  person,
  due,
  top,
  opacity = 1,
  highlight = 0,
  check = 0,
  strike = 0,
  done = false,
}: (typeof ROWS)[number] & {
  top: number;
  opacity?: number;
  highlight?: number;
  check?: number;
  strike?: number;
  done?: boolean;
}) {
  return (
    <div
      className="absolute right-0 left-0 flex items-center border-b border-[#EFEFEB] px-3"
      style={{
        top,
        height: ROW_HEIGHT,
        opacity,
        background: `rgba(242,84,45, ${0.06 * highlight})`,
      }}
    >
      <span
        className="relative flex size-4 items-center justify-center rounded-full border-[1.5px]"
        style={{
          borderColor: check > 0 ? "#17181C" : "#C9CAC6",
          background: check > 0 ? "#17181C" : "transparent",
        }}
      >
        <Check
          className="size-2.5 text-white"
          strokeWidth={3.5}
          style={{ transform: `scale(${check})` }}
        />
      </span>
      <span className="relative ml-3.5 text-[14px] text-[#17181C]">
        <span style={{ color: done ? "#8A8C93" : undefined }}>{title}</span>
        <span
          className="absolute top-1/2 left-0 h-px bg-[#8A8C93]"
          style={{ width: `${strike * 100}%` }}
        />
      </span>
      <span className="ml-auto flex items-center gap-4">
        <ProjectTag project={project} />
        <Avatar person={person} />
        <span className="w-14 text-right text-[12.5px] text-[#8A8C93] tabular-nums">
          {due}
        </span>
      </span>
    </div>
  );
}

function Sidebar() {
  const nav = [
    { label: "Inbox", icon: Inbox, badge: "3" },
    { label: "My tasks", icon: ListTodo, active: true },
    { label: "Projects", icon: FolderKanban },
    { label: "Calendar", icon: CalendarDays },
    { label: "Team", icon: Users },
  ];
  return (
    <aside className="absolute top-10 bottom-0 left-0 flex w-[232px] flex-col border-r border-[#EDEDEA] bg-[#FAFAF8] px-3 pt-4">
      <div className="flex items-center gap-2.5 px-2">
        <span className="size-6 rounded-[7px] bg-[linear-gradient(135deg,#6E7BFF,#4C6FFF)]" />
        <span className="text-[14px] font-semibold text-[#17181C]">Lumen</span>
        <ChevronDown className="ml-auto size-3.5 text-[#8A8C93]" />
      </div>
      <div className="mt-4 flex h-8 items-center gap-2 rounded-lg border border-[#EDEDEA] bg-white px-2.5 text-[13px] text-[#8A8C93]">
        <Search className="size-3.5" />
        Search
        <span className="ml-auto text-[11px]">⌘K</span>
      </div>
      <nav className="mt-4 flex flex-col gap-0.5">
        {nav.map(({ label, icon: Icon, badge, active }) => (
          <span
            key={label}
            className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px]"
            style={{
              background: active ? "#FFFFFF" : "transparent",
              boxShadow: active
                ? "0 0 0 1px #EDEDEA, 0 1px 2px rgba(0,0,0,0.04)"
                : "none",
              color: active ? "#17181C" : "#55575E",
              fontWeight: active ? 500 : 400,
            }}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {label}
            {badge && (
              <span className="ml-auto text-[11.5px] text-[#8A8C93]">
                {badge}
              </span>
            )}
          </span>
        ))}
      </nav>
      <p className="mt-6 px-2.5 text-[11.5px] font-medium tracking-wide text-[#8A8C93]">
        Projects
      </p>
      <div className="mt-1.5 flex flex-col gap-0.5">
        {Object.values(PROJECTS).map((project) => (
          <span
            key={project.name}
            className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] text-[#55575E]"
          >
            <span
              className="size-2 rounded-full"
              style={{ background: project.color }}
            />
            {project.name}
          </span>
        ))}
      </div>
      <div className="mt-auto mb-4 flex items-center gap-2.5 px-2.5">
        <Avatar person="JL" size={26} />
        <span className="text-[13px] text-[#17181C]">Jordan Lee</span>
      </div>
    </aside>
  );
}

function Field({
  focused,
  className,
  children,
}: {
  focused: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute flex h-11 items-center rounded-[10px] border bg-white px-3.5 text-[14px] ${className ?? ""}`}
      style={{
        borderColor: focused ? "#4C6FFF" : "#E4E4E0",
        boxShadow: focused ? "0 0 0 3px rgba(76,111,255,0.16)" : "none",
      }}
    >
      {children}
    </div>
  );
}

function Modal({ state }: { state: LumenState }) {
  if (state.modal <= 0.001) return null;
  const caret = state.titleFocused && (state.typing || state.caretOn);
  const options: Person[] = ["AR", "MC", "SO"];
  return (
    <>
      <div
        className="absolute inset-0 bg-[#17181C]"
        style={{ opacity: 0.16 * state.modal }}
      />
      <div
        className="absolute rounded-[18px] bg-white"
        style={{
          left: 380,
          top: 230,
          width: 520,
          height: 340,
          opacity: state.modal,
          transform: `translateY(${lerp(10, 0, state.modal)}px) scale(${lerp(0.97, 1, state.modal)})`,
          boxShadow:
            "0 24px 60px -12px rgba(23,24,28,0.28), 0 0 0 1px rgba(23,24,28,0.06)",
        }}
      >
        <div className="absolute top-6 right-6 left-6 flex h-6 items-center">
          <span className="text-[17px] font-semibold text-[#17181C]">
            New task
          </span>
          <X className="ml-auto size-4 text-[#8A8C93]" />
        </div>
        <span className="absolute top-[68px] left-6 text-[12.5px] font-medium text-[#55575E]">
          Task name
        </span>
        <Field
          focused={state.titleFocused}
          className="top-[88px] right-6 left-6"
        >
          {state.typed ? (
            <span className="text-[#17181C]">{state.typed}</span>
          ) : (
            !state.titleFocused && (
              <span className="text-[#A8AAAF]">What needs to be done?</span>
            )
          )}
          {caret && (
            <span className="ml-px inline-block h-[18px] w-[1.5px] bg-[#4C6FFF]" />
          )}
        </Field>
        <span className="absolute top-[150px] left-6 text-[12.5px] font-medium text-[#55575E]">
          Assignee
        </span>
        <span className="absolute top-[150px] left-[268px] text-[12.5px] font-medium text-[#55575E]">
          Due date
        </span>
        <Field
          focused={state.assigneeFocused}
          className="top-[170px] left-6 w-[228px]"
        >
          {state.assigned ? (
            <span className="flex items-center gap-2 text-[#17181C]">
              <Avatar person="MC" size={20} />
              Maya Chen
            </span>
          ) : (
            <span className="text-[#A8AAAF]">Unassigned</span>
          )}
          <ChevronDown className="ml-auto size-4 text-[#8A8C93]" />
        </Field>
        <Field focused={false} className="top-[170px] right-6 w-[228px]">
          <CalendarDays
            className="mr-2 size-4 text-[#8A8C93]"
            strokeWidth={1.75}
          />
          <span className="text-[#17181C]">Today</span>
          <ChevronDown className="ml-auto size-4 text-[#8A8C93]" />
        </Field>
        <div className="absolute right-6 bottom-6 flex gap-2">
          <span className="flex h-10 w-20 items-center justify-center rounded-[10px] text-[14px] text-[#55575E]">
            Cancel
          </span>
          <span
            className="flex h-10 w-28 items-center justify-center rounded-[10px] bg-[#17181C] text-[14px] font-medium text-white"
            style={{ transform: `scale(${state.createPressed ? 0.95 : 1})` }}
          >
            Create task
          </span>
        </div>
        {state.dropdown > 0.001 && (
          <div
            className="absolute rounded-xl bg-white p-1.5"
            style={{
              left: 24,
              top: 220,
              width: 228,
              opacity: state.dropdown,
              transform: `translateY(${lerp(-6, 0, state.dropdown)}px)`,
              boxShadow:
                "0 16px 40px -8px rgba(23,24,28,0.22), 0 0 0 1px rgba(23,24,28,0.07)",
            }}
          >
            {options.map((person) => (
              <div
                key={person}
                className="flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-[14px] text-[#17181C]"
                style={{
                  background:
                    person === "MC" && state.mayaHover
                      ? "#F2F2EF"
                      : "transparent",
                }}
              >
                <Avatar person={person} size={22} />
                {PEOPLE[person].name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function LumenApp({ state }: { state: LumenState }) {
  const shift = ROW_HEIGHT * state.newRow;
  return (
    <div className="relative h-[800px] w-[1280px] overflow-hidden rounded-[14px] bg-white font-sans antialiased">
      <div className="absolute inset-x-0 top-0 flex h-10 items-center border-b border-[#EDEDEA] bg-[#F5F5F3] px-4">
        <span className="flex gap-2">
          <span className="size-3 rounded-full bg-[#FF5F57]" />
          <span className="size-3 rounded-full bg-[#FEBC2E]" />
          <span className="size-3 rounded-full bg-[#28C840]" />
        </span>
        <span className="absolute left-1/2 flex h-6 w-[320px] -translate-x-1/2 items-center justify-center gap-1.5 rounded-md bg-white text-[12px] text-[#6B6E76] ring-1 ring-[#EDEDEA]">
          <Lock className="size-3" />
          app.lumen.so/tasks
        </span>
      </div>
      <Sidebar />
      <main className="absolute top-10 right-0 bottom-0 left-[232px]">
        <div className="absolute top-8 left-8 flex h-10 items-center gap-2.5">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-[#17181C]">
            My tasks
          </h2>
          <span className="rounded-md bg-[#F4F4F1] px-1.5 py-0.5 text-[12px] text-[#6B6E76] tabular-nums">
            {state.newRow > 0.5 ? 8 : 7}
          </span>
        </div>
        <span
          className="absolute top-9 right-8 flex h-9 w-[120px] items-center justify-center gap-1.5 rounded-[10px] bg-[#17181C] text-[13.5px] font-medium text-white"
          style={{ transform: `scale(${state.newPressed ? 0.94 : 1})` }}
        >
          <Plus className="size-4" strokeWidth={2.25} />
          New task
        </span>
        <div className="absolute top-[88px] left-8 flex gap-1.5">
          {["All", "Today", "Upcoming", "Done"].map((label, i) => (
            <span
              key={label}
              className="rounded-full px-3 py-1 text-[12.5px]"
              style={{
                background: i === 0 ? "#17181C" : "#F4F4F1",
                color: i === 0 ? "#FFFFFF" : "#55575E",
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="absolute top-[128px] right-8 bottom-0 left-8 border-t border-[#EFEFEB]">
          <Row
            title={TASK_NAME}
            project="web"
            person="MC"
            due="Today"
            top={lerp(-ROW_HEIGHT * 0.4, 0, state.newRow)}
            opacity={state.newRow}
            highlight={state.highlight}
            check={state.check}
            strike={state.strike}
            done={state.done}
          />
          {ROWS.map((row, i) => (
            <Row key={row.title} {...row} top={i * ROW_HEIGHT + shift} />
          ))}
        </div>
      </main>
      <Modal state={state} />
    </div>
  );
}
