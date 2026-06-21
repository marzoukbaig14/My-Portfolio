import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = profile.name;
const description = "ML Engineer and Applied Researcher. MS AI at Northeastern.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  // Sub-pages set their own title; it is slotted into this template.
  title: { default: title, template: `%s | ${title}` },
  description,
  keywords: [
    "Muhammad Marzouk Baig",
    "ML Engineer",
    "Machine Learning",
    "Applied Research",
    "Northeastern",
    "Fine-tuning",
    "LLMs",
  ],
  authors: [{ name: title, url: siteUrl }],
  creator: title,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: title,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport = {
  themeColor: "#0d0d12",
};

// Structured data so search engines understand this is a person's profile.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  jobTitle: "ML Engineer & Applied Researcher",
  alumniOf: "Northeastern University",
  sameAs: [profile.socials.github, profile.socials.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
