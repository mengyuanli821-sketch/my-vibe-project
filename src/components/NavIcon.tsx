type NavIconProps = { kind: "overview" | "students" | "teacher" | "directory" | "add" | "note" | "studio" | "planner" | "toolkit" };

export function NavIcon({ kind }: NavIconProps) {
  if (kind === "overview") return <svg aria-hidden="true" className="nav-motion-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path className="nav-icon-accent" d="m12 7 2 4-2 6-2-6 2-4Z" /><circle cx="12" cy="12" r="1.2" /></svg>;
  if (kind === "students" || kind === "directory") return <svg aria-hidden="true" className="nav-motion-icon" viewBox="0 0 24 24"><circle cx="9" cy="9" r="3" /><path d="M3.8 19c.5-3.2 2.2-5 5.2-5s4.7 1.8 5.2 5" /><path className="nav-icon-accent" d="M15 7.3a3 3 0 0 1 0 5.4M16 14.2c2.4.3 3.7 1.9 4.1 4.3" /></svg>;
  if (kind === "teacher" || kind === "studio") return <svg aria-hidden="true" className="nav-motion-icon" viewBox="0 0 24 24"><path d="M12 20c-4-2.4-6.3-6-6.3-10.7 3.2.1 5.4 1.5 6.3 4.2.9-2.7 3.1-4.1 6.3-4.2 0 4.7-2.3 8.3-6.3 10.7Z" /><path className="nav-icon-accent" d="M12 13.5V5.2m-2.2 2.2L12 5.2l2.2 2.2" /></svg>;
  if (kind === "add") return <svg aria-hidden="true" className="nav-motion-icon" viewBox="0 0 24 24"><circle cx="10" cy="8" r="3" /><path d="M4.5 18c.6-3.2 2.4-5 5.5-5 1.7 0 3 .5 3.9 1.4" /><path className="nav-icon-accent" d="M18 13v7m-3.5-3.5h7" /></svg>;
  if (kind === "note") return <svg aria-hidden="true" className="nav-motion-icon" viewBox="0 0 24 24"><path d="M5 4.5h10l4 4V20H5Z" /><path d="M15 4.5v4h4M8 12h8M8 15.5h6" /><path className="nav-icon-accent" d="m8 8 1 1 2-2" /></svg>;
  if (kind === "planner") return <svg aria-hidden="true" className="nav-motion-icon" viewBox="0 0 24 24"><path d="M5 5.5h14v13H5Z" /><path d="M8 3.5v4m8-4v4M5 9h14" /><path className="nav-icon-accent" d="m8 14 2 2 5-5" /></svg>;
  if (kind === "toolkit") return <svg aria-hidden="true" className="nav-motion-icon" viewBox="0 0 24 24"><path d="M4.5 7.5h15v12h-15Z" /><path d="M8.5 7.5V5h7v2.5M4.5 12h15" /><path className="nav-icon-accent" d="M10 12v2h4v-2" /></svg>;
  return null;
}
