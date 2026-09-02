import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { YogaLogo } from "@/components/YogaLogo";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
};

export function Layout({ children, title, action }: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const currentPath = router.asPath.split("?")[0];
  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    if (href === "/students") return currentPath === "/students" || (/^\/students\/[^/]+$/.test(currentPath) && currentPath !== "/students/new");
    return currentPath === href;
  };
  const navigation = [
    { label: "Overview", items: [{ href: "/", label: "Guidance", description: "Today at a glance", icon: "✦" }] },
    { label: "Students", items: [{ href: "/students", label: "Student directory", description: "Profiles & history", icon: "◌" }, { href: "/students/new", label: "Add student", description: "Create a profile", icon: "+" }, { href: "/class-notes/new", label: "Record class", description: "Post-class notes", icon: "✎" }] },
    { label: "Teaching", items: [{ href: "/teacher", label: "Teacher Studio", description: "Profile & coaching", icon: "◈" }, { href: "/teacher/planner", label: "AI Class Planner", description: "Build a timed sequence", icon: "⌁" }] }
  ];

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => { setIsDesktop(media.matches); setSidebarOpen(media.matches); };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setSidebarOpen(false);
  }, [currentPath]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="sun-orb" />
      <div aria-hidden="true" className="mandala-lines" />
      <header className="relative z-10 border-b border-[#dcd5c8]/80 bg-[#fbf9f4]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button aria-expanded={sidebarOpen} aria-label={sidebarOpen ? "Close navigation" : "Open navigation"} className="sidebar-toggle" onClick={() => setSidebarOpen((open) => !open)} type="button"><span /><span /><span /></button>
            <Link href="/" aria-label="Sattva student sanctuary home">
            <YogaLogo />
            </Link>
          </div>
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400 sm:block">Teacher workspace · Presence over performance</p>
        </div>
      </header>

      <aside className={`app-sidebar ${sidebarOpen ? "app-sidebar-open" : ""}`} aria-label="Main navigation">
        <nav className="sidebar-nav">
          {navigation.map((group) => <div className="sidebar-group" key={group.label}><div className="sidebar-kicker">{group.label}</div><div className="grid gap-1">{group.items.map((item) => {
            const active = isActive(item.href);
            return <Link aria-current={active ? "page" : undefined} className={`sidebar-link ${active ? "sidebar-link-active" : ""}`} href={item.href} key={item.href}><span className="sidebar-icon">{item.icon}</span><span><strong>{item.label}</strong><small>{item.description}</small></span>{active ? <i /> : null}</Link>;
          })}</div></div>)}
        </nav>
        <div className="sidebar-footer"><span>ॐ</span><p>Return to the breath<br /><small>Your notes are a form of care.</small></p></div>
      </aside>
      {sidebarOpen && !isDesktop ? <button aria-label="Close navigation" className="sidebar-overlay" onClick={() => setSidebarOpen(false)} type="button" /> : null}

      <main className={`layout-main relative z-[1] mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 ${sidebarOpen ? "layout-main-sidebar" : ""}`}>
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
