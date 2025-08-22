import MasonryGrid from "@/components/ui/masonry-grid";
import SolarSystem from "@/components/ui/planets";
import Link from "next/link";

export default function About() {
  return (
    <div>
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-white font-bold text-4xl mb-12 text-center">about me</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="mx-auto w-3/4">
              <p className="text-white">
                I am building products that help the world. That&apos;s pretty much it. I am a firm believer that technology has the potential to benefit humankind and when you build a good enough product it&apos;s almost like a gift.<br/><br/>
                I am a &apos;jack&apos; of all trades. I enjoy writing fullstack code but I view myself more as a builder. These days, I spend most of my time wrangling LLMs and building custom long-term memory systems.<br/><br/>
                My biggest interests are in AI, crypto, finance and space. I&apos;ve worked in some capacity in all of them, but have spent most of my time in AI. I am currently building Aspen over at <Link href="https://ventnow.ai" className="font-bold text-indigo-500">Vent</Link>.<br/><br/>
                Outside of work, I enjoy skiing, running, investing, being outdoors, and competitive gaming. I&apos;m also known to bake a pretty wicked cookie.
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