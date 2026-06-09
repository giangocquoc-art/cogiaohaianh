import type { Metadata } from "next";
import { Nunito, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cô Giáo Hải Anh - Học Tập Vui Vẻ",
  description: "Trang web giáo dục cho học sinh tiểu học lớp 1-5. Kiểm tra online, bài tập và kết quả học tập.",
  keywords: ["Cô Giáo Hải Anh", "học tập", "tiểu học", "kiểm tra online", "toán", "ngữ văn"],
  authors: [{ name: "Cô Giáo Hải Anh" }],
  icons: {
    icon: "/images/mascot.png",
  },
  openGraph: {
    title: "Cô Giáo Hải Anh - Học Tập Vui Vẻ",
    description: "Trang web giáo dục cho học sinh tiểu học lớp 1-5",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${patrickHand.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
