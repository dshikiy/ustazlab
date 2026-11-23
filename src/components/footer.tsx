import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getMessages } from "@/lib/i18n/server";

export async function Footer() {
  const m = await getMessages();

  return (
    <footer className="footer">
      <div className="container">
        <div
          className="grid gap-8 pb-8 border-b border-[var(--border)]"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
        >
          <div className="grid gap-3 content-start">
            <Link className="logo flex items-center gap-2 no-underline text-inherit" href="/">
              <span
                className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--primary)] text-white"
                aria-hidden="true"
              >
                <GraduationCap size={20} />
              </span>
              <span>
                Ustaz<span>Lab</span>
              </span>
            </Link>
            <p className="muted text-sm m-0 max-w-xs">{m.footer.description}</p>
          </div>

          <div className="grid gap-2 content-start">
            <h3 className="text-sm font-bold m-0 mb-1">{m.footer.platform}</h3>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/dashboard/lessons/new">
              {m.nav.lessons}
            </Link>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/games">
              {m.nav.games}
            </Link>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/materials">
              {m.nav.materials}
            </Link>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/inclusive">
              {m.nav.inclusive}
            </Link>
          </div>

          <div className="grid gap-2 content-start">
            <h3 className="text-sm font-bold m-0 mb-1">{m.footer.resources}</h3>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/about">
              {m.nav.about}
            </Link>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/inclusive/accessibility">
              {m.inclusive.navAccessibility}
            </Link>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/inclusive/communication">
              {m.inclusive.navCommunication}
            </Link>
          </div>

          <div className="grid gap-2 content-start">
            <h3 className="text-sm font-bold m-0 mb-1">{m.footer.legal}</h3>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/about#privacy">
              {m.footer.privacy}
            </Link>
            <Link className="text-sm muted no-underline hover:text-[var(--text)]" href="/about#terms">
              {m.footer.terms}
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs muted">
          <span>© {new Date().getFullYear()} {m.footer.copyright}</span>
          <span>Kazakhstan · EdTech · WCAG 2.2 AA</span>
        </div>
      </div>
    </footer>
  );
}
