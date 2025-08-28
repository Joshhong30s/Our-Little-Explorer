'use client';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { IoMdMenu, IoMdClose } from 'react-icons/io';
import { HiLockClosed } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isDatabarOpen, setIsDatabarOpen] = useState(false);
  const { data: session } = useSession();

  const logout = () => {
    signOut({ callbackUrl: '/login' });
  };

  // Auto close mobile menu on route change
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsNavbarOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  return (
    <nav className="bg-white mx-auto text-xl text-black px-4 md:px-6 py-4 items-center shadow-md">
      <div className="flex flex-col md:flex-row justify-center md:items-center md:justify-between">
        <div
          className={`fixed md:relative top-[72px] md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent z-50 border-b border-gray-200 md:border-none transition-all duration-300 ease-in-out ${
            isNavbarOpen
              ? 'max-h-[600px] opacity-100 shadow-lg md:shadow-none'
              : 'max-h-0 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto md:max-h-[600px]'
          }`}
        >
          <div className="xl:text-xl w-full">
            <ul className="xl:flex items-center xl:space-x-10 space-y-0 divide-y divide-gray-100 md:divide-y-0">
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                <Link
                  href="/"
                  className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                {session ? (
                  <Link
                    href="/writePhoto"
                    className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                  >
                    {t('nav.writePhoto')}
                  </Link>
                ) : (
                  <button
                    onClick={() => alert(t('auth.loginRequired'))}
                    className="block w-full text-left py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95 text-gray-500 hover:text-teal-980 group"
                    title={t('auth.loginToAccess')}
                  >
                    <span className="flex items-center gap-2">
                      {t('nav.writePhoto')}
                      <HiLockClosed
                        className="inline-block text-gray-400 group-hover:text-teal-980"
                        size={16}
                      />
                    </span>
                  </button>
                )}
              </li>
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                {session ? (
                  <Link
                    href="/savedPhoto"
                    className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                  >
                    {t('nav.savedPhotos', 'Saved Photos')}
                  </Link>
                ) : (
                  <button
                    onClick={() => alert(t('auth.loginRequired'))}
                    className="block w-full text-left py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95 text-gray-500 hover:text-teal-980 group"
                    title={t('auth.loginToAccess')}
                  >
                    <span className="flex items-center gap-2">
                      {t('nav.savedPhotos', 'Saved Photos')}
                      <HiLockClosed
                        className="inline-block text-gray-400 group-hover:text-teal-980"
                        size={16}
                      />
                    </span>
                  </button>
                )}
              </li>
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980 md:hidden">
                <Link
                  href="/message"
                  className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                >
                  {t('nav.leaveMessage', 'Leave Message')}
                </Link>
              </li>
              {session && (
                <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980 md:hidden">
                  <Link
                    href="/profile"
                    className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                  >
                    {t('nav.profile')}
                  </Link>
                </li>
              )}
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                {session ? (
                  <button
                    onClick={logout}
                    className="block w-full text-left py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                  >
                    {t('nav.logout')}
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                    >
                      {t('nav.login')}
                    </Link>
                  </>
                )}
              </li>
              <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980 md:hidden">
                <button
                  onClick={() => {
                    const newLang = i18n.language === 'en' ? 'zh' : 'en';
                    i18n.changeLanguage(newLang);
                    router.push(router.pathname, router.asPath, {
                      locale: newLang,
                    });
                  }}
                  className="block w-full text-left py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                >
                  {i18n.language === 'en' ? '中文' : 'EN'}
                </button>
              </li>
              {!session && (
                <li className="block hover:bg-gray-50 md:hover:bg-transparent md:hover:text-teal-980">
                  <Link
                    href="/register"
                    className="block py-4 px-6 md:px-4 md:py-2 transition-all duration-200 ease-in-out active:scale-95"
                  >
                    {t('nav.register')}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="md:hidden z-50 text-neutral-800 p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all"
            aria-label={t('nav.toggleMenu', 'Toggle Menu')}
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          >
            {isNavbarOpen ? <IoMdClose size={36} /> : <IoMdMenu size={36} />}
          </button>

          <Link
            href="/"
            className="block md:hidden absolute left-1/2 transform -translate-x-1/2"
          >
            <Image
              className="rounded-full drop-shadow-xl mx-auto p-0"
              src="/assets/baby1.svg"
              alt={t('nav.logoAlt', 'Baby Logo')}
              width={100}
              height={100}
              priority={true}
            />
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => {
                const newLang = i18n.language === 'en' ? 'zh' : 'en';
                i18n.changeLanguage(newLang);
                router.push(router.pathname, router.asPath, {
                  locale: newLang,
                });
              }}
              className="py-2 px-4 hover:text-teal-980 transition-colors duration-200 border rounded-md hover:bg-gray-50"
            >
              {i18n.language === 'en' ? '中文' : 'EN'}
            </button>
            <Link
              href="/message"
              className="py-2 px-4 hover:text-teal-980 transition-colors duration-200"
            >
              {t('nav.leaveMessage', 'Leave Message')}
            </Link>
            {session ? (
              <Link
                href="/profile"
                className="py-2 px-4 hover:text-teal-980 transition-colors duration-200"
              >
                {t('nav.profile')}
              </Link>
            ) : (
              <button
                onClick={() => alert(t('auth.loginRequired'))}
                className="py-2 px-4 text-gray-500 hover:text-teal-980 transition-colors duration-200 group flex items-center gap-2"
                title={t('auth.loginToAccess')}
              >
                {t('nav.profile')}
                <HiLockClosed
                  className="inline-block text-gray-400 group-hover:text-teal-980"
                  size={16}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
