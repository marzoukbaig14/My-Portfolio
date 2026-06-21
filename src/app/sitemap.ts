import { siteUrl } from "@/lib/site";

export default function sitemap() {
  const lastModified = new Date();
  const urls = [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
  ];
  // Only advertise /committed when the demo is actually enabled (otherwise it 404s).
  if (process.env.NEXT_PUBLIC_COMMITTED_ENABLED === "true") {
    urls.push({ url: `${siteUrl}/committed`, lastModified, changeFrequency: "monthly", priority: 0.8 });
  }
  return urls;
}
