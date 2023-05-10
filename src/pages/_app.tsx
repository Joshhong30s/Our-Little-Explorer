import Navbar from '../components/navbar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NoSSR from '@/components/NoSSR'
import { Klee_One } from 'next/font/google'
import Head from 'next/head'
import Footer from '@/components/Footer'
import localFont from 'next/font/local'

const klee = Klee_One({
  weight: '600',
  subsets: ['latin'],
})

const Font = localFont({
  src: './LXGWWenKaiTC-Regular.ttf',
  display: 'swap',
  fallback: ['klee'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={Font.className}>
      <Head>
        <link rel='apple-touch-icon' href='/family.jpg' />
        <title>小寶成長紀錄</title>
      </Head>
      <NoSSR>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </NoSSR>
    </div>
  )
}
