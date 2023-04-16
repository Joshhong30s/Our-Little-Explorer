import Navbar from '../components/navbar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import dynamic from 'next/dynamic'
import NoSSR from '@/components/NoSSR'
import { Klee_One } from 'next/font/google'
import Head from 'next/head'

const klee = Klee_One({
  weight: '600',
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={klee.className}>
      <Head>
        <link rel='apple-touch-icon' href='/family.jpg' />
        <title>小寶成長紀錄</title>
      </Head>
      <NoSSR>
        <Navbar />
        <Component {...pageProps} />
      </NoSSR>
    </div>
  )
}
