import { Cormorant_Garamond, Outfit } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "@/components/layout/providers";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mithilamakhana.com"),
  title: {
    default: "Mithila Makhana | Farm Fresh Fox Nuts from Bihar",
    template: "%s | Mithila Makhana",
  },
  description:
    "Premium quality fox nuts (makhana) sourced directly from the Mithila region of Bihar, India. Oil-free, small-batch, GI-tagged harvest.",
  keywords: [
    "makhana",
    "fox nuts",
    "Mithila",
    "Bihar",
    "lotus seeds",
    "healthy snacks",
    "premium D2C",
  ],
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
  },
  openGraph: {
    title: "Mithila Makhana",
    description: "Farm Fresh Makhana From Mithila, Bihar",
    images: ["/images/logo.jpg", "/images/hero-makhana.png"],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mithila Makhana",
    description: "Farm Fresh Makhana From Mithila, Bihar",
    images: ["/images/logo.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${cormorant.variable} font-sans antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
