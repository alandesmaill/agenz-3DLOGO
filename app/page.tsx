'use client';

import dynamic from 'next/dynamic';

// Dynamically import the View component with SSR disabled
const View = dynamic(() => import('@/components/canvas/View'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-white">Loading 3D Scene...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-screen relative">
      {/* Three.js Canvas - Loaded client-side only */}
      <View />
    </main>
  );
}
