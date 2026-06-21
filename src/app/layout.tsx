import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitGenie AI — Your AI-Powered Fitness Coach",
  description:
    "Transform your fitness journey with personalized AI coaching, smart workout plans, nutrition guidance, and real-time progress tracking.",
  keywords: ["fitness", "AI coach", "workout", "nutrition", "health", "fitness plan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A2E',
              border: '1px solid #3A3A5C',
              color: '#EAEAFF',
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
