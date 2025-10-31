import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getThoughtBySlug } from "@/lib/thoughts";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getThoughtBySlug(params.slug);
  if (!post) return { title: "thought not found" };
  return { title: post.title, description: post.title };
}

export default async function ThoughtPage({ params }: Props) {
  const post = await getThoughtBySlug(params.slug);
  if (!post) return notFound();

  const paragraphs = post.content.trim().split(/\n\s*\n/);

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full md:w-3/4 lg:w-2/3">
          <header className="mb-8">
            <h1 className="text-white text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-white/60 text-sm">{post.date}</p>
          </header>
          <article>
            {paragraphs.map((para, idx) => (
              <p key={idx} className="text-white leading-7 mb-4">
                {para}
              </p>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}


