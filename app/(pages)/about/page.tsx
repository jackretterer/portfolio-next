import MasonryGrid from "@/components/ui/masonry-grid";
import SolarSystem from "@/components/ui/planets";

export default function About() {
  return (
    <div>
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">About Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="mx-auto w-3/4">
              <p className="text-white">
                I am building products that help the world. That&apos;s pretty much it. I am a firm believer that technology has the potential to benefit the world. And when you build a good enough product its almost like a gift to the user.<br/><br/>
                My biggest interests are in crypto, AI, finance and space. I&apos;ve worked in some capacity in all of them, but have spent most of my time in AI.<br/><br/>
                I am a &apos;jack&apos; of all trades. I am capable of writing code but I view myself more as a builder. I know full stack, ML/AI, and data science. I spend most of my time these days wrangling LLMs. Outside of work, I enjoy skiing, running, investing, art, lifting, baking, being outdoors, and competitive gaming.
                <div className="pt-10 pb-20">
                </div>
                <SolarSystem/>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">some photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          </div>
        </div>
      </section>
      <div className="w-95 bg-black">
        <MasonryGrid />
      </div>
    </div>
  );
}