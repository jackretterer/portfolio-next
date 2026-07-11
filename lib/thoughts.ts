import fs from "fs/promises";
import path from "path";

export type ThoughtSummary = {
  slug: string;
  title: string;
  date: string; // ISO date string
};

export type ThoughtDetail = ThoughtSummary & {
  content: string;
};

const THOUGHTS_DIR = path.join(process.cwd(), "content", "thoughts");

export async function getAllSlugs(): Promise<string[]> {
  try {
    const dirents = await fs.readdir(THOUGHTS_DIR, { withFileTypes: true });
    return dirents
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

export async function getAllThoughts(): Promise<ThoughtSummary[]> {
  const slugs = await getAllSlugs();
  const thoughts: ThoughtSummary[] = [];

  for (const slug of slugs) {
    const metaPath = path.join(THOUGHTS_DIR, slug, "meta.json");
    try {
      const metaRaw = await fs.readFile(metaPath, "utf8");
      const meta = JSON.parse(metaRaw) as { title: string; date: string };
      thoughts.push({ slug, title: meta.title, date: meta.date });
    } catch {
      // skip malformed entries
    }
  }

  // Sort by date desc, then slug desc
  thoughts.sort((a, b) => {
    const dateDiff = (b.date || "").localeCompare(a.date || "");
    if (dateDiff !== 0) return dateDiff;
    return b.slug.localeCompare(a.slug, undefined, { numeric: true });
  });

  return thoughts;
}

export async function getThoughtBySlug(slug: string): Promise<ThoughtDetail | null> {
  const metaPath = path.join(THOUGHTS_DIR, slug, "meta.json");
  const contentPath = path.join(THOUGHTS_DIR, slug, "content.txt");
  try {
    const [metaRaw, content] = await Promise.all([
      fs.readFile(metaPath, "utf8"),
      fs.readFile(contentPath, "utf8"),
    ]);
    const meta = JSON.parse(metaRaw) as { title: string; date: string };
    return { slug, title: meta.title, date: meta.date, content };
  } catch {
    return null;
  }
}


