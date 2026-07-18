import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description:
    "Official reunion website for the Urbana High School Class of 2006, September 25–26, 2026, in Champaign and Urbana, Illinois.",
  openGraph: {
    title: siteConfig.name,
    description: `${siteConfig.dateLabel} in ${siteConfig.locationLabel}`,
    type: "website",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: `${siteConfig.dateLabel} in ${siteConfig.locationLabel}`,
    images: ["/opengraph-image.jpg"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
