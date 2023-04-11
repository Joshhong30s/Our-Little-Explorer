import Navbar from '../components/navbar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import dynamic from 'next/dynamic'
import NoSSR from '@/components/NoSSR'
import { Klee_One } from 'next/font/google'

const klee = Klee_One({
  weight: '600',
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={klee.className}>
      <NoSSR>
        <Navbar />
        <Component {...pageProps} />
      </NoSSR>
    </div>
  )
}
