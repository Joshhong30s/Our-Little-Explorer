'use client';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { IoMdMenu, IoMdClose, IoMdCloseCircle } from 'react-icons/io';
import { ImStatsDots } from 'react-icons/im';
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
    <nav className="bg-white mx-auto text-xl text-black px-6 py-4 items-center">
      <div className="flex flex-col md:flex-row justify-center md:items-center md:justify-between">
        <div
          className={`md:flex md:pb-0 mt-2 md:my-2 basis-1/3 order-2 md:order-1 ${
            isNavbarOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="xl:text-xl">
            <ul className="xl:flex items-center xl:space-x-10">
              <li className="block mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out">
                {!session ? (
                  <Link href="/login">{t('navbar.login')}</Link>
                ) : (
                  <button onClick={logout}>{t('navbar.logout')}</button>
                )}
              </li>
              <li className="block mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out">
                {!session ? (
                  <Link href="/register">{t('navbar.register')}</Link>
                ) : (
                  <Link href="/savedPhoto">{t('navbar.favorites')}</Link>
                )}
              </li>
              <li className="block mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out">
                {!session ? (
                  <Link href="/login">{t('navbar.uploadPhoto')}</Link>
                ) : (
                  <Link href="/writePhoto">{t('navbar.uploadPhoto')}</Link>
                )}
              </li>
              <li className="block mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out">
                <Link href="/">{t('navbar.allPhotos')}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-between items-center">
          <button
            className="md:hidden text-neutral-800"
            aria-label={t('navbar.toggleLeft')}
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          >
            {isNavbarOpen ? <IoMdClose size={30} /> : <IoMdMenu size={30} />}
          </button>

          <Link href="/">
            <Image
              className="rounded-full drop-shadow-xl mx-auto p-0"
              src="/assets/baby1.svg"
              alt={t('navbar.logoAlt')}
              width={100}
              height={100}
              priority={true}
            />
          </Link>

          <button
            className="md:hidden text-neutral-800"
            aria-label={t('navbar.toggleRight')}
            onClick={() => setIsDatabarOpen(!isDatabarOpen)}
          >
            {isDatabarOpen ? (
              <IoMdCloseCircle size={30} />
            ) : (
              <ImStatsDots size={30} />
            )}
          </button>
        </div>

        <div
          className={`order-3 justify-end md:flex md:justify-end md:space-x-10 py-2 md:text-lg lg:text-xl basis-1/3 text-right ${
            isDatabarOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out">
            <Link href="/dashboard">{t('navbar.growthChart')}</Link>
          </div>
          <div className="mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out">
            <Link href="/message">{t('navbar.leaveMessage')}</Link>
          </div>
          {session && (
            <div className="mb-4 md:mb-0 md:ml-6 hover:bg-teal-980 hover:text-gray-50 hover:p-4 hover:rounded-md transition-colors duration-200 ease-in-out">
              <Link href="/profile">{t('navbar.profile')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
