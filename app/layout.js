import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PhotoSessionProvider } from "@/lib/context/PhotoSessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Photo Booth",
  description: "Website Photo Booth - Ambil foto dengan mudah",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PhotoSessionProvider>
          {children}
        </PhotoSessionProvider>
      </body>
    </html>
  );
}
