import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MotionSystem } from '@/components/motion-system';

const display = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300','400','500','600','700','800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shubham404-error.github.io/CapitalSense-portfolio-/'),
  title: {
    default: 'CapitalSense | Research-led mutual fund investing',
    template: '%s | CapitalSense'
  },
  description: 'Research-led mutual fund distribution, portfolio understanding and investor education built around clarity, goals and disciplined decision-making.'
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={display.variable}>
      <body>
        <ThemeProvider>
          <MotionSystem/>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}