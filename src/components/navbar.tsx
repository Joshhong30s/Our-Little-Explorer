'use client';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { IoMdMenu, IoMdClose } from 'react-icons/io';
import { HiLockClosed } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation('common');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isDatabarOpen, setIsDatabarOpen] = useState(false);
  const { data: session } = useSession();

  const logout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="bg-white mx-auto text-xl text-black px-4 md:px-6 py-4 items-center shadow-md">
      <div className="flex flex-col md:flex-row justify-center md:items-center md:justify-between">
        <div
          className={`fixed md:relative top-[72px] md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent z-50 border-b border-gray-200 md:border-none transition-all duration-300 ease-in-out ${
            isNavbarOpen ? 'max-h-[600px] opacity-100 shadow-lg md:shadow-none' : 'max-h-0 opacity-0 md:opacity-100 md:max-h-[600px]'
          }`}
        >
          <div className="xl:text-xl w-full">
            <ul className="xl:flex items-center xl:space-x-10 space-y-0 divide-y divide-gray-100 md:divide-y-0">
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                <Link href="/" className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95">
                  {t('navbar.allPhotos')}
                </Link>
              </li>
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                {session ? (
                  <Link href="/writePhoto" className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95">
                    {t('navbar.uploadPhoto')}
                  </Link>
                ) : (
                  <button 
                    onClick={() => alert(t('auth.loginRequired'))}
                    className="block w-full text-left py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95 text-gray-500 hover:text-teal-980 group"
                    title={t('auth.loginToAccess')}
                  >
                    <span className="flex items-center gap-2">
                      {t('navbar.uploadPhoto')}
                      <HiLockClosed className="inline-block text-gray-400 group-hover:text-teal-980" size={16} />
                    </span>
                  </button>
                )}
              </li>
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                {session ? (
                  <Link href="/savedPhoto" className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95">
                    {t('navbar.favorites')}
                  </Link>
                ) : (
                  <button 
                    onClick={() => alert(t('auth.loginRequired'))}
                    className="block w-full text-left py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95 text-gray-500 hover:text-teal-980 group"
                    title={t('auth.loginToAccess')}
                  >
                    <span className="flex items-center gap-2">
                      {t('navbar.favorites')}
                      <HiLockClosed className="inline-block text-gray-400 group-hover:text-teal-980" size={16} />
                    </span>
                  </button>
                )}
              </li>
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980 md:hidden">
                <Link href="/message" className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95">
                  {t('navbar.leaveMessage')}
                </Link>
              </li>
              {session && (
                <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980 md:hidden">
                  <Link href="/profile" className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95">
                    {t('navbar.profile')}
                  </Link>
                </li>
              )}
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                {session ? (
                  <button 
                    onClick={logout} 
                    className="block w-full text-left py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                  >
                    {t('navbar.logout')}
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95">
                      {t('navbar.login')}
                    </Link>
                  </>
                )}
              </li>
              {!session && (
                <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                  <Link href="/register" className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95">
                    {t('navbar.register')}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="md:hidden z-50 text-neutral-800 p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all"
            aria-label={t('navbar.toggleMenu')}
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          >
            {isNavbarOpen ? <IoMdClose size={36} /> : <IoMdMenu size={36} />}
          </button>

          <Link href="/" className="block md:hidden absolute left-1/2 transform -translate-x-1/2">
            <Image
              className="rounded-full drop-shadow-xl mx-auto p-0"
              src="/assets/baby1.svg"
              alt={t('navbar.logoAlt')}
              width={100}
              height={100}
              priority={true}
            />
          </Link>


          <div className="hidden md:flex items-center space-x-4">
            <Link href="/message" className="py-2 px-4 hover:text-teal-980 transition-colors duration-200">
              {t('navbar.leaveMessage')}
            </Link>
            {session ? (
              <Link href="/profile" className="py-2 px-4 hover:text-teal-980 transition-colors duration-200">
                {t('navbar.profile')}
              </Link>
            ) : (
              <button 
                onClick={() => alert(t('auth.loginRequired'))}
                className="py-2 px-4 text-gray-500 hover:text-teal-980 transition-colors duration-200 group flex items-center gap-2"
                title={t('auth.loginToAccess')}
              >
                {t('navbar.profile')}
                <HiLockClosed className="inline-block text-gray-400 group-hover:text-teal-980" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
