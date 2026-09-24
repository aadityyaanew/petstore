'use client';

import dynamic from 'next/dynamic';

// Dynamically import the entire React Router app shell with SSR disabled
const ClientApp = dynamic(() => import('./ClientApp'), { ssr: false });

export default function CatchAllPage() {
  return <ClientApp />;
}
