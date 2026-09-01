type YogaLogoProps = {
  compact?: boolean;
};

export function YogaLogo({ compact = false }: YogaLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg aria-hidden="true" className="h-11 w-11 shrink-0" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="lotus-gradient" x1="8" x2="56" y1="8" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d49a68" />
            <stop offset="1" stopColor="#557a68" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" fill="#f7efe4" r="30" />
        <path d="M32 42C23 34 22 24 32 13c10 11 9 21 0 29Z" fill="none" stroke="url(#lotus-gradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <path d="M31 45C20 44 12 38 11 27c12 0 19 6 20 18Zm2 0c11-1 19-7 20-18-12 0-19 6-20 18Z" fill="none" stroke="url(#lotus-gradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <path d="M18 48c8 4 20 4 28 0" fill="none" stroke="#557a68" strokeLinecap="round" strokeWidth="3" />
        <circle cx="32" cy="31" fill="#d49a68" r="2.5" />
      </svg>
      {!compact ? (
        <span className="grid leading-none">
          <span className="font-serif text-lg font-semibold tracking-wide text-[#294a3c]">Sattva</span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.24em] text-stone-500">Student sanctuary</span>
        </span>
      ) : null}
    </div>
  );
}
