import type { Metadata } from 'next';
import StarMap from './components/StarMap';

export const metadata: Metadata = {
  title: 'the neighborhood',
  description: 'An interactive 3D map of every known star within 25 light years.',
};

export default function Stars() {
  return (
    <div className="h-[calc(100dvh-4rem)] bg-black">
      <StarMap />
    </div>
  );
}
