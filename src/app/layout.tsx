import { PropsWithChildren } from 'react';

import { Toaster } from '@/ui/components/sonner';
import '@/ui/styles/globals.css';

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster richColors />
      </body>
    </html>
  );
}
