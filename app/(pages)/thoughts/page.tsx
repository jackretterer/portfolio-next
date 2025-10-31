import Link from "next/link";
import { getAllThoughts } from "@/lib/thoughts";

export default async function Thoughts() {
  const posts = await getAllThoughts();

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-white font-bold text-4xl mb-12 text-center">thoughts</h2>

        <div className="mx-auto w-full md:w-3/4 lg:w-2/3">
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug} className="group">
                <Link href={`/thoughts/${post.slug}`} className="block">
                  <h3 className="text-white text-2xl font-semibold group-hover:underline">{post.title}</h3>
                  <p className="text-white/60 text-sm mt-1">{post.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


