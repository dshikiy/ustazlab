import type { kk } from "./kk";

type DeepString<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepString<T[K]>;
};

export type Locale = "kk" | "ru";
export type Messages = DeepString<typeof kk>;
