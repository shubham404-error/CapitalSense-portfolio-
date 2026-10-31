import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MotionSystem } from '@/components/motion-system';

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
    <html lang="en" suppressHydrationWarning>
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
