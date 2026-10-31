import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
export const metadata: Metadata = { metadataBase: new URL('https://shubham404-error.github.io/CapitalSense-portfolio-/'), title: { default: 'CapitalSense | Independent thinking. Systematic research.', template: '%s | CapitalSense' }, description: 'Research-led market intelligence, mutual fund investing and investor education.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en" suppressHydrationWarning className={jakarta.variable}><body><ThemeProvider><SiteHeader />{children}<SiteFooter /></ThemeProvider></body></html>; }
