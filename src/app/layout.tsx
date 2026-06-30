import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
              background: 'rgba(14, 20, 40, 0.95)',
              border: '1px solid rgba(91, 140, 255, 0.2)',
              color: '#FFFFFF',
              backdropFilter: 'blur(20px)',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
