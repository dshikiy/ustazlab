import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MemoryGame } from "@/features/games/memory";
import Link from "next/link";

export default function MemoryGamePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="container section max-w-3xl grid gap-4">
        <Link href="/games" className="text-sm font-semibold text-[var(--primary)] no-underline">
          ← Барлық ойындар
        </Link>
        <MemoryGame />
      </main>
      <Footer />
    </>
  );
}
