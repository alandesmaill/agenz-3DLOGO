'use client';

import dynamic from 'next/dynamic';

const View = dynamic(() => import('@/components/canvas/View'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="w-full h-screen relative">
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        <h1>AGENZ — Creative Digital Agency</h1>
        <p>
          Kurdistan&apos;s leading creative agency based in Sulaymaniyah, Iraq.
          We deliver bold advertising campaigns, cinematic video production,
          premium graphic design, and data-driven brand strategy for clients
          across Kurdistan, Iraq, and the wider region.
        </p>
        <ul>
          <li>Advertising &amp; Campaigns</li>
          <li>Video Production</li>
          <li>Graphic Design</li>
          <li>Brand Strategy</li>
        </ul>
      </div>
      <View />
    </main>
  );
}
