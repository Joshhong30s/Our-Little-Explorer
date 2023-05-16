'use client'
import Link from 'next/link'
import Image from 'next/image'

import { useState } from 'react'
import { useCookies } from 'react-cookie'

import { IoMdMenu, IoMdClose, IoMdCloseCircle } from 'react-icons/io'
import { FaBabyCarriage } from 'react-icons/fa'

export default function Navbar() {
  const [cookies, setCookies] = useCookies(['access_token'])
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const [isDatabarOpen, setIsDatabarOpen] = useState(false)
  const logout = () => {
    setCookies('access_token', '')
    window.localStorage.clear()
  }

  return (
    <nav className='bg-white mx-auto text-xl text-black px-6 py-4 items-center'>
      <div className='flex flex-col md:flex-row justify-center md:items-center md:justify-between'>
        <div
          className={`md:flex md:pb-0 mt-2 md:my-2 basis-1/3 order-2 md:order-1 ${
            isNavbarOpen ? 'block' : 'hidden'
          }`}
        >
          <div className='xl:text-xl'>
            <ul className='xl:flex items-center md:space-x-10'>
              <li className='block mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out'>
                {!cookies.access_token ? (
                  <Link href='/login'>登入</Link>
                ) : (
                  <button onClick={logout}>登出</button>
                )}
              </li>
              <li className='block mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out'>
                {!cookies.access_token ? (
                  <Link href='/register'>註冊</Link>
                ) : (
                  <Link href='/savedPhoto'>我的最愛</Link>
                )}
              </li>
              <li className='block mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out'>
                {!cookies.access_token ? (
                  <Link href='/login'>上傳相片</Link>
                ) : (
                  <Link href='/writePhoto'>上傳相片</Link>
                )}
              </li>
              <li className='block mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out'>
                <Link href='/'>所有相片</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className=' order-1 md:order-2 flex justify-between items-center '>
          <button
            className='md:hidden'
            aria-label='Toggle left'
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          >
            {isNavbarOpen ? <IoMdClose size={30} /> : <IoMdMenu size={30} />}
          </button>

          <Link href='/'>
            <Image
              className='rounded-full drop-shadow-xl mx-auto '
              src='/baby.jpg'
              alt='baby'
              width={70}
              height={70}
              priority={true}
            />
          </Link>

          <button
            className='md:hidden'
            aria-label='Toggle right'
            onClick={() => setIsDatabarOpen(!isDatabarOpen)}
          >
            {isDatabarOpen ? (
              <IoMdCloseCircle size={30} />
            ) : (
              <FaBabyCarriage size={30} />
            )}
          </button>
        </div>

        <div
          className={`order-3 justify-end md:flex md:justify-end md:space-x-10 py-2 md:text-lg lg:text-xl basis-1/3 text-right ${
            isDatabarOpen ? 'block' : 'hidden'
          }`}
        >
          <div className='mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out'>
            <Link href='/dashboard'>成長圖表</Link>
          </div>
          <div className='mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out'>
            <Link href='/table'>成長數據</Link>
          </div>
          <div className='mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out'>
            <Link href='/message'>留言小寶</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
