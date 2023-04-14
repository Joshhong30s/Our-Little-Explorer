'use client'
import Link from 'next/link'
import { IoMdMenu, IoMdClose, IoMdCloseCircle } from 'react-icons/io'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { HiSearch, HiOutlineSearch } from 'react-icons/hi'
import Image from 'next/image'

export default function Navbar() {
  const [cookies, setCookies] = useCookies(['access_token'])
  const [navbar, setNavbar] = useState(false)
  const [searchbar, setSearchbar] = useState(false)
  const logout = () => {
    setCookies('access_token', '')
    window.localStorage.clear()
  }

  return (
    // outside flex div
    <nav className='bg-white mx-auto text-xl text-black px-6 py-4 items-center'>
      <div className='flex flex-col md:flex-row justify-center md:items-center md:justify-between'>
        {/* navbar for md */}
        <div
          className={`md:flex md:pb-0 mt-2 md:my-2  basis-1/3 order-2 md:order-1 ${
            navbar ? 'block' : 'hidden'
          }`}
        >
          <div className='xl:text-xl'>
            <ul className='xl:flex items-center'>
              <li className='block mb-4 md:mb-0 md:ml-6'>
                {!cookies.access_token ? (
                  <Link href='/login'>登入</Link>
                ) : (
                  <button onClick={logout}>登出</button>
                )}
              </li>
              <li className='block mb-4 md:mb-0 md:ml-6'>
                {!cookies.access_token ? (
                  <Link href='/register'>註冊</Link>
                ) : (
                  <Link href='/savedRecipe'>我的最愛</Link>
                )}
              </li>
              <li className='block mb-4 md:mb-0 md:ml-6'>
                {!cookies.access_token ? (
                  <Link href='/login'>上傳相片</Link>
                ) : (
                  <Link href='/writeRecipe'>上傳相片</Link>
                )}
              </li>
              <li className='block mb-4 md:mb-0 md:ml-6'>
                <Link href='/'>所有相片</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* navbar */}
        <div className=' order-1 md:order-2 flex justify-between items-center '>
          <button className='md:hidden' onClick={() => setNavbar(!navbar)}>
            {navbar ? <IoMdClose size={30} /> : <IoMdMenu size={30} />}
          </button>
          {/* logo */}

          <Link href='/'>
            <Image
              className='rounded-full drop-shadow-xl mx-auto '
              src='/baby.jpg'
              alt='cat.jpg'
              width={70}
              height={70}
              priority={true}
            />
          </Link>

          {/* searchbar button for mobile */}
          <button
            className='md:hidden'
            onClick={() => setSearchbar(!searchbar)}
          >
            {searchbar ? <IoMdCloseCircle size={30} /> : <HiSearch size={30} />}
          </button>
        </div>

        {/* searchbar for mobile */}
        <div
          className={`order-3 md:flex justify-end space-x-4 md:space-x-6 my-4 md:my-0 md:text-lg lg:text-xl basis-1/3 ${
            searchbar ? 'flex' : 'hidden'
          }`}
        >
          <input
            type='text'
            aria-label='search'
            className='px-2 py-2 w-11/12 md:w-7/12 border-2 rounded-md border-slate-900'
            placeholder='...搜尋相片功能施工中'
            value=''
          />
          <button className='w-auto'>
            <HiSearch size={30} />
          </button>
        </div>
      </div>
    </nav>
  )
}
