import NavBar from "@/components/NavBar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "An application for collecting reliable data from the internet and use it as a Question-answering agent powered by LLM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex`}>
        <main className="flex flex-col w-screen h-screen">
          <header className="flex flex-1 h-[20vh] items-center justify-center bg-gray-500">
            <span className="font-bold text-4xl text-amber-200">
              Knowledge Base
            </span>
          </header>
          <section className="flex flex-6 h-[80vh]">
            <NavBar />
            <section className="flex flex-col flex-8 px-4 py-3 gap-8 bg-teal-100">
              {children}
            </section>
          </section>
        </main>
      </body>
    </html>
  );
}
