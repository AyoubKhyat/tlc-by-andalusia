import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tlc-marrakech.com";

  const [blogPosts, pageMetas] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.pageMeta.findMany({
      where: { noIndex: false },
      select: { path: true, updatedAt: true },
    }),
  ]);

  const metaMap = new Map(pageMetas.map((m) => [m.path, m.updatedAt]));

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: metaMap.get("/") || new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: metaMap.get("/about") || new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/programs`, lastModified: metaMap.get("/programs") || new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/approach`, lastModified: metaMap.get("/approach") || new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/gallery`, lastModified: metaMap.get("/gallery") || new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: metaMap.get("/faq") || new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/results`, lastModified: metaMap.get("/results") || new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: metaMap.get("/contact") || new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: metaMap.get("/blog") || new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/events`, lastModified: metaMap.get("/events") || new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/booking`, lastModified: metaMap.get("/booking") || new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const noIndexPaths = new Set(
    (await prisma.pageMeta.findMany({ where: { noIndex: true }, select: { path: true } })).map((m) => m.path)
  );

  return [...staticPages, ...blogPages].filter((p) => {
    const path = p.url.replace(baseUrl, "") || "/";
    return !noIndexPaths.has(path);
  });
}
