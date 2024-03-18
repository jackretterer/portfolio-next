import MasonryGrid from "@/components/ui/masonry-grid";

export default function About() {
  return <div>
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">about me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        </div>
      </div>
    </section>
    <div className="w-95">
    <MasonryGrid />
    </div>

  </div>;
}