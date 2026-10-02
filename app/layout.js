import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata = {
  metadataBase: new URL("https://www.uhs2006.com"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description:
    "Relive the Urbana High School Class of 2006 reunion, share your contact details, and help shape our next gathering.",
  openGraph: {
    title: siteConfig.name,
    description: "Reunion memories, class updates, and our next chapter.",
    type: "website",
    images: [{ url: "/urbana-high-school.webp", alt: "Urbana High School" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: "Reunion memories, class updates, and our next chapter.",
    images: ["/urbana-high-school.webp"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
