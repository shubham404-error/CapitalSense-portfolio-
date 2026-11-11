import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import './globals.css';
import './research-simulator.css';
export const metadata: Metadata = { title: 'Stride - by Capital Sense', description: 'Small steps. A future that feels like you. Build your investing habit with Stride.' };
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
