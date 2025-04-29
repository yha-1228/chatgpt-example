import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Container } from "@/components";

export const metadata: Metadata = {
  title: "ChatGPT",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <header className="h-16 sticky top-0 z-10 bg-white border-b-1 border-b-gray-300 flex items-center">
          <Container>
            <h1 className="text-2xl tracking-wide font-extrabold text-center">
              ChatGPT
            </h1>
          </Container>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
