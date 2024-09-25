import Image from "next/image";
import { WavyBackgroundDemo } from "./(homepage)/heropage-component";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <WavyBackgroundDemo/>
    </div>
  );
}
