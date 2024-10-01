import { NextIntlClientProvider } from 'next-intl';
import React, { ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import '@/assets/styles/globals.css'; // Ensure Tailwind is correctly loaded

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  const currentLocale = locale || 'en'; // Default to English if no locale is provided
  const messages = await getMessages({ locale: currentLocale });

  return (
    <html lang={currentLocale}>
      <head>
        <script
          type="text/javascript"
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        />
      </head>
      <body>
        <NextIntlClientProvider locale={currentLocale} messages={messages}>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
