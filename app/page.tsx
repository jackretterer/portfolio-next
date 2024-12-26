import Image from "next/image";
import { WavyBackgroundDemo } from "./(homepage)/heropage-component";

export default function Home() {
  return (
    <div className="h-[90vh] bg-black">
      <WavyBackgroundDemo/>
    </div>
  );
}
