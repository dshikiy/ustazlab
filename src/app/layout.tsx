import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: {
    default: "UstazLab — Қазақстан мұғалімдеріне арналған цифрлық білім платформасы",
    template: "%s · UstazLab",
  },
  description:
    "ҚМЖ конструкторы, автоматты бағаланатын тесттер, интерактивті оқу ойындары және инклюзивті білім құралдары бір платформада.",
  openGraph: {
    title: "UstazLab — Мұғалімнің цифрлық зертханасы",
    description:
      "Сабақ жоспарлары, тесттер, дидактикалық материалдар және инклюзивті оқыту құралдары.",
    type: "website",
    locale: "kk_KZ",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <a href="#main-content" className="skip-link">
          {locale === "ru" ? "Перейти к основному содержанию" : "Негізгі мазмұнға өту"}
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
