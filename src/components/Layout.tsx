import Link from "next/link";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
};

export function Layout({ children, title, action }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/students" className="text-lg font-semibold text-stone-950">
            AI Student Notebook
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm">
            <Link className="rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100" href="/students">
              Students
            </Link>
            <Link className="rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100" href="/students/new">
              New student
            </Link>
            <Link className="rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100" href="/class-notes/new">
              Add class note
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {(title || action) && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {title ? <h1 className="text-2xl font-semibold text-stone-950">{title}</h1> : <div />}
            {action}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
