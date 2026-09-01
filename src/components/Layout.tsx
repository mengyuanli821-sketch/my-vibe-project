import Link from "next/link";
import type { ReactNode } from "react";
import { YogaLogo } from "@/components/YogaLogo";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
};

export function Layout({ children, title, action }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="sun-orb" />
      <div aria-hidden="true" className="mandala-lines" />
      <header className="relative z-10 border-b border-[#dcd5c8]/80 bg-[#fbf9f4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="Sattva student sanctuary home">
            <YogaLogo />
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm">
            <Link className="nav-link" href="/">Guidance</Link>
            <Link className="nav-link" href="/students">
              Students
            </Link>
            <Link className="nav-link" href="/students/new">
              New student
            </Link>
            <Link className="nav-link" href="/teacher">Teacher Studio</Link>
            <Link className="nav-link nav-link-accent" href="/class-notes/new">
              Add class note
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-[1] mx-auto max-w-6xl px-4 py-8 sm:py-10">
        {(title || action) && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {title ? (
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9b6845]">Practice with presence</p>
                <h1 className="font-serif text-3xl text-[#294a3c] sm:text-4xl">{title}</h1>
              </div>
            ) : <div />}
            {action}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
