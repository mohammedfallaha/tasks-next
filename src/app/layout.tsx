import { Geist } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = { title: "Tasks" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} font-sans`}>
      <body className="mx-auto max-w-lg p-4">
        <nav className="mb-6 flex gap-4 border-b pb-2">
          <Link href="/">Home</Link>
          <Link href="/login">Log in</Link>
          <Link href="/tasks">Tasks</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}