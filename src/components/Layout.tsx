import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavIcon } from "@/components/NavIcon";
import { YogaLogo } from "@/components/YogaLogo";
import { useI18n, type Locale } from "@/lib/i18n";

type LayoutProps = { children: ReactNode; title?: string; action?: ReactNode };

const NAVIGATION = [
  { label: "Overview", icon: "overview", items: [{ href: "/", label: "Guidance", description: "Today at a glance", icon: "overview" }] },
  { label: "Students", icon: "students", items: [
    { href: "/students", label: "Student directory", description: "Profiles & history", icon: "directory" },
    { href: "/students/new", label: "Add student", description: "Create a profile", icon: "add" },
    { href: "/class-notes/new", label: "Record class", description: "Post-class notes", icon: "note" }
  ] },
  { label: "Teaching", icon: "teacher", items: [
    { href: "/teacher", label: "Teacher Studio", description: "Profile & coaching", icon: "studio" },
    { href: "/teacher/planner", label: "Class Planner", description: "Build a timed sequence", icon: "planner" },
    { href: "/teacher/toolkit", label: "Teaching Toolkit", description: "Pose finder, checklists & cues", icon: "toolkit" },
    { href: "/teacher/sequences", label: "Sequence Library", description: "Saved plans & notes", icon: "note" }
  ] }
] as const;

export function Layout({ children, title, action }: LayoutProps) {
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const topbarRef = useRef<HTMLElement>(null);
  const currentPath = router.asPath.split("?")[0];
  const isActive = (href: string) => href === "/" ? currentPath === "/" : href === "/students" ? currentPath === "/students" || (/^\/students\/[^/]+$/.test(currentPath) && currentPath !== "/students/new") : currentPath === href;

  useEffect(() => { setMenuOpen(false); setOpenGroup(null); }, [currentPath]);
  useEffect(() => {
    function close(event: PointerEvent) { if (!topbarRef.current?.contains(event.target as Node)) setOpenGroup(null); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") { setOpenGroup(null); setMenuOpen(false); } }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="sun-orb" />
      <div aria-hidden="true" className="mandala-lines" />
      <header className="app-topbar" ref={topbarRef}>
        <div className="topbar-primary">
          <Link aria-label={t("Sattva student sanctuary home")} data-i18n-explicit href="/"><YogaLogo /></Link>
          <div className="topbar-tools">
            <label className="language-select" data-i18n-explicit><span>{locale === "zh-TW" ? "語言" : locale === "zh-CN" ? "语言" : "Language"}</span><select aria-label="Language" onChange={(event) => setLocale(event.target.value as Locale)} value={locale}><option value="zh-TW">繁體中文</option><option value="zh-CN">简体中文</option><option value="en">English</option></select></label>
            <button aria-expanded={menuOpen} aria-label={t(menuOpen ? "Close navigation" : "Open navigation")} className="topnav-toggle" data-i18n-explicit onClick={() => setMenuOpen((open) => !open)} type="button"><span /><span /><span /></button>
          </div>
        </div>
        <nav aria-label={t("Main navigation")} className={`top-navigation top-navigation-categories ${menuOpen ? "top-navigation-open" : ""}`} data-i18n-explicit>
          {NAVIGATION.map((group) => {
            const expanded = openGroup === group.label;
            const active = group.items.some((item) => isActive(item.href));
            return <div className={`topnav-category ${expanded ? "topnav-category-open" : ""}`} key={group.label}>
              <button aria-expanded={expanded} className={`topnav-category-trigger ${active ? "topnav-category-active" : ""}`} onClick={() => setOpenGroup((current) => current === group.label ? null : group.label)} type="button"><NavIcon kind={group.icon} /><span>{t(group.label)}</span><i aria-hidden="true">⌄</i></button>
              <div className="topnav-dropdown">
                {group.items.map((item) => { const itemActive = isActive(item.href); return <Link aria-current={itemActive ? "page" : undefined} className={`topnav-dropdown-link ${itemActive ? "topnav-dropdown-link-active" : ""}`} href={item.href} key={item.href}><NavIcon kind={item.icon} /><span><strong>{t(item.label)}</strong><small>{t(item.description)}</small></span><i aria-hidden="true">→</i></Link>; })}
              </div>
            </div>;
          })}
        </nav>
      </header>

      <main className="layout-main relative z-[1] mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {(title || action) && <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">{title ? <div data-i18n-explicit><p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9b6845]">{t("Practice with presence")}</p><h1 className="font-serif text-3xl text-[#294a3c] sm:text-4xl">{t(title)}</h1></div> : <div />}{action ? <div className="layout-page-action">{action}</div> : null}</div>}
        {children}
      </main>
    </div>
  );
}
