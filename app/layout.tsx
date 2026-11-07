import type { Metadata } from "next";
import "./globals.css";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: config.title,
    template: `%s · ${config.title}`
  },
  description: config.description,
  icons: {
    icon: "/assets/img/logo.svg"
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml"
    }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
