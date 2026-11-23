"use client";

import { Search as SearchIcon, Upload, X } from "lucide-react";
import type { ChangeEvent } from "react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Іздеу...",
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <label className="grid gap-1.5">
      {label && <span className="text-sm font-semibold">{label}</span>}
      <div className="relative flex items-center">
        <SearchIcon
          size={18}
          className="absolute left-3 text-[var(--muted)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingLeft: 38, paddingRight: value ? 36 : 14 }}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="absolute right-2 p-1 rounded-md text-[var(--muted)] hover:text-[var(--text)] bg-transparent border-0 cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </label>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FileUpload({
  label,
  accept,
  onFileSelect,
  helperText,
}: {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  helperText?: string;
}) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  }

  return (
    <label className="card flex flex-col items-center justify-center gap-2 py-6 px-4 cursor-pointer border-dashed hover:border-[var(--primary)] text-center">
      <Upload size={22} className="text-[var(--primary)]" />
      <span className="font-semibold text-sm">{label}</span>
      {helperText && <span className="text-xs muted">{helperText}</span>}
      <input type="file" accept={accept} onChange={handleChange} className="sr-only" />
    </label>
  );
}

