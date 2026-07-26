import type { Metadata } from 'next';
import { Poppins, Inter, Montserrat } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'High IQ Montessori School | Premium Education in Ikorodu, Lagos',
  description: 'Welcome to High IQ Montessori School, Ikorodu, Lagos, Nigeria. Offering world-class Montessori, British, and Nigerian curriculums, with STEM robotics, coding, and premium leadership values.',
  keywords: 'high iq montessori school, best school in ikorodu, lagos schools, montessori education lagos, preschool in ikorodu, robotics and coding for kids lagos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-cream dark:bg-dark-bg text-foreground transition-colors duration-200">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
