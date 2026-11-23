"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

export function Accordion({
  items,
  className,
}: {
  items: AccordionItemData[];
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="card p-0 overflow-hidden"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`acc-panel-${item.id}`}
              id={`acc-trigger-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left bg-transparent border-0 text-[var(--text)] font-semibold text-base cursor-pointer hover:bg-[var(--surface-subtle)] transition-colors"
            >
              <span>{item.question}</span>
              <ChevronDown
                size={18}
                className={cn(
                  "shrink-0 text-[var(--muted)] transition-transform duration-300",
                  isOpen && "rotate-180 text-[var(--primary)]"
                )}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div
                id={`acc-panel-${item.id}`}
                role="region"
                aria-labelledby={`acc-trigger-${item.id}`}
                className="px-5 pb-5 pt-0 text-sm muted leading-relaxed"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
