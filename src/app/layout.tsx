import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "KOSIGN — Shaping the Future of Business",
  description:
    "KOSIGN provides innovative digital transformation solutions for enterprises across Asia.",
};

// Applies the saved language before first paint and hides content until it is translated.
const localeFlashGuard = `(function () {
  try {
    var saved = localStorage.getItem("ko.lang");
    var locale = saved === "ko" || saved === "en" || saved === "km" ? saved : "en";
    document.documentElement.lang = locale;
    document.documentElement.setAttribute("data-lang", locale);
    if (locale !== "en") {
      document.documentElement.setAttribute("data-locale-loading", "");
    }
  } catch (e) {}
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The flash guard edits <html> attributes before hydration.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Script id="locale-flash-guard" strategy="beforeInteractive">
          {localeFlashGuard}
        </Script>
        <LanguageProvider>{children}</LanguageProvider>
        <script
          src="https://rag-studio-v1.vercel.app/widget.js"
          data-chatbot-id="bot_3x7zdiqn"
          data-color="#eab308"
          data-position="bottom-right"
          data-welcome="Hi! Ask me anything about our help center."
          data-domains="www.kosign.com.kh"
          async
        ></script>
      </body>
    </html>
  );
}
