import Link from "next/link";

export function BrandLogo({
  href = "/",
  suffix,
}: {
  href?: string;
  suffix?: string;
}) {
  return (
    <Link
      href={href}
      className="logo flex items-center gap-2.5 no-underline text-inherit group"
    >
      <svg
        width="38"
        height="38"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="ulab-grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#685CFF" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {/* Outer geometric prism / open book */}
        <path
          d="M20 4L35 12.5V27.5L20 36L5 27.5V12.5L20 4Z"
          fill="url(#ulab-grad)"
          fillOpacity="0.14"
          stroke="url(#ulab-grad)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Inner open book pages */}
        <path
          d="M12 15.5C15 14.5 18 15.2 20 17C22 15.2 25 14.5 28 15.5V26C25 25 22 25.7 20 27.5C18 25.7 15 25 12 26V15.5Z"
          fill="url(#ulab-grad)"
        />
        {/* Knowledge spark */}
        <circle cx="20" cy="11" r="2.2" fill="#F59E0B" />
      </svg>
      <span className="font-bold tracking-tight text-xl">
        Ustaz<span style={{ color: "var(--primary)" }}>Lab</span>
        {suffix && (
          <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
            {suffix}
          </span>
        )}
      </span>
    </Link>
  );
}
