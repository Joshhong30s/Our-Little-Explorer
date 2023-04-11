import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Image from 'next/image'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError(false)
    setSubmitting(true)
    try {
      const res = await axios.post('https://zero6babyserver.onrender.com', {
        username,
        email,
        password,
      })
      res.data && setSuccess(true)
      window.location.replace('/login')
    } catch (err) {
      setError(true)
    }
  }

  return (
    <div className='relative '>
      <Image
        src='/register.jpg'
        alt='register'
        fill
        className='inset-0 -z-10 opacity-80 absolute object-cover'
      />
      <div className='bg-gray-100/70 min-h-screen flex flex-col items-center justify-start py-20 px-4 sm:px-6 lg:px-8 '>
        <div className='max-w-md w-full space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-black'>
              註冊帳號
            </h2>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='bg-white rounded-lg shadow-lg px-4 py-6'>
              <div className='mb-4'>
                <label
                  htmlFor='username'
                  className='block text-gray-700 font-bold mb-2 '
                >
                  帳號名稱(全小寫)
                </label>
                <input
                  id='username'
                  name='username'
                  type='text'
                  autoComplete='username'
                  required
                  className='appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Enter your username..'
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='mb-6'>
                <label
                  htmlFor='email-address'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Email
                </label>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Enter your email..'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='mb-6'>
                <label
                  htmlFor='password'
                  className='block text-gray-700 font-bold mb-2'
                >
                  密碼
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Enter your password..'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type='submit'
                className='mt-12 group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-full text-black bg-orange-950 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              >
                <span className='absolute left-0 inset-y-0 flex items-center pl-3'></span>
                {submitting ? null : '點我註冊'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
