"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Gamepad2,
  Users,
  ClipboardList,
  FolderOpen,
  HeartHandshake,
  Award,
  ChartNoAxesCombined,
  Sparkles,
  Settings,
  Shield,
  User,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/lessons": BookOpen,
  "/dashboard/quizzes": ClipboardCheck,
  "/games": Gamepad2,
  "/dashboard/classes": Users,
  "/dashboard/assignments": ClipboardList,
  "/dashboard/materials": FolderOpen,
  "/inclusive": HeartHandshake,
  "/dashboard/results": Award,
  "/dashboard/analytics": ChartNoAxesCombined,
  "/dashboard/assistant": Sparkles,
  "/dashboard/settings": Settings,
  "/dashboard/profile": User,
  "/admin": Shield,
};

export function SidebarLinks({
  links,
}: {
  links: readonly (readonly [string, string])[];
}) {
  const pathname = usePathname();

  return (
    <div className="grid gap-1">
      {links.map(([href, label]) => {
        const isActive =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === href || pathname.startsWith(`${href}/`);
        const Icon = ICONS[href];
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
          >
            {Icon && <Icon size={17} />}
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
