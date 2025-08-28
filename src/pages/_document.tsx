import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script async src="https://www.youtube.com/iframe_api"></script>
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/assets/baby1.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/baby1.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/baby1.svg" />
        <link rel="apple-touch-icon" sizes="167x167" href="/assets/baby1.svg" />
        
        {/* Apple PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="小寶日記" />
        
        {/* Windows/MS Meta Tags */}
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/assets/baby1.svg" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#3b82f6" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
