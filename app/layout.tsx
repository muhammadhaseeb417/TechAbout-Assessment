import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flight results | Travel.pk",
  description: "Compare sample flight fares from Pakistan in PKR.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
