import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { signIn, signOut } from 'next-auth/react';

export default function Login() {
  const { t } = useTranslation('common');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleCredentialsSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      console.log('Error:', result.error);
      setError(true);
    } else {
      window.location.replace('/');
    }
  };

  return (
    <div className="relative">
      <Image
        src="/assets/bao6.jpeg"
        alt={t('user.login')}
        fill
        quality={10}
        className="inset-0 -z-10 opacity-80 absolute object-cover"
      />
      <div className="bg-gray-100/70 min-h-screen flex flex-col justify-start py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center font-medium text-3xl mb-4 md:mt-20">
            <h1 className="text-gray-900">{t('user.login')}</h1>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleCredentialsSignIn}>
            <div className="bg-white rounded-lg shadow-lg px-4 py-6">
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-bold mb-2 "
                >
                  {t('user.username')}
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder={t('user.userName')}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  {t('common:user.passWord')}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder={t('user.passWord')}
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="mt-12 group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-full hover:bg-teal-980 hover:text-gray-100 text-slate-600 bg-blue-980 focus:outline-none "
                >
                  {t('common:user.login')}
                </button>
              </div>

              {error && (
                <div className="mt-4 text-center">
                  <span className="text-red-500">{t('user.errorMessage')}</span>
                </div>
              )}
            </div>
          </form>

          <div className="mt-8 space-y-4 text-center">
            <button
              className="w-full py-2 px-4 rounded-lg"
              onClick={() => signIn('google', { callbackUrl: '/' })}
            >
              <Image
                src="/assets/google-logo.svg"
                alt={t('user.loginWithGoogle')}
                width={500}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => signIn('line', { callbackUrl: '/' })}
              className="flex items-center justify-center w-full bg-green-500 text-white hover:bg-green-600 rounded-full"
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '180 / 40',
                padding: 0,
              }}
            >
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {t('user.loginWithLine')}
              </span>
            </button>
          </div>

          <div className="mt-12 text-xl text-center">
            <span className="text-gray-500">{t('user.noAccountMessage')}</span>
            <Link href="/register">
              <p className="text-blue-500 hover:text-blue-700 hover:text-2xl mt-4">
                {t('user.registerHere')}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
