export type Locale = "kk" | "ru";
type Widen<T>={readonly[K in keyof T]:T[K] extends string?string:T[K] extends object?Widen<T[K]>:T[K]};export type Messages=Widen<typeof import("./kk").kk>;
