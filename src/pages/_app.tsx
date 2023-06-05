import Navbar from '../components/navbar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NoSSR from '@/components/NoSSR'
import { Klee_One, Noto_Sans_TC } from 'next/font/google'
import Head from 'next/head'
import Footer from '@/components/Footer'
import localFont from 'next/font/local'
import Script from 'next/script'

const klee = Klee_One({
  weight: '600',
  subsets: ['latin'],
})

const Noto = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={Noto.className}>
      <Head>
        <title>小寶成長日記</title>
        <meta name='description' content='My Baby Photo Album' />
        <meta name='keywords' content='baby, infant, baby products' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
        <link rel='icon' href='/baby1.svg' />
        <link rel='apple-touch-icon' href='/baby1.svg' />
      </Head>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-7EJ6PKSZ6R'>
        {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-7EJ6PKSZ6R');
      `}
      </Script>
      <NoSSR>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </NoSSR>
    </div>
  )
}
