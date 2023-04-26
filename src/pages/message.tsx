'use client'

import Select from 'react-select'

import { useState, useEffect } from 'react'
import { components } from 'react-select'

const MenuList = (props: any) => (
  <components.MenuList {...props} className='grid grid-cols-4 gap-2'>
    {props.children}
  </components.MenuList>
)

export default function Message() {
  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    message: '',
  })

  const handleAvatarChange = (selectedOption: any) => {
    setFormData({
      ...formData,
      avatar: selectedOption.value,
    })
  }

  const avatarOptions = [
    { value: '/01.svg', label: 'Avatar 1' },
    { value: '/02.svg', label: 'Avatar 2' },
    { value: '/03.svg', label: 'Avatar 3' },
    { value: '/04.svg', label: 'Avatar 4' },
    { value: '/05.svg', label: 'Avatar 5' },
    { value: '/06.svg', label: 'Avatar 6' },
    { value: '/07.svg', label: 'Avatar 7' },
    { value: '/08.svg', label: 'Avatar 8' },
    { value: '/09.svg', label: 'Avatar 9' },
    { value: '/10.svg', label: 'Avatar 10' },
    { value: '/11.svg', label: 'Avatar 11' },
    { value: '/12.svg', label: 'Avatar 12' },
    { value: '/13.svg', label: 'Avatar 13' },
    { value: '/14.svg', label: 'Avatar 14' },
    { value: '/15.svg', label: 'Avatar 15' },
    { value: '/16.svg', label: 'Avatar 16' },
  ]

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    // send the formdata to Google Sheets
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        alert('success!!!')
        setFormData({
          avatar: '',
          name: '',
          message: '',
        })
      } else {
        throw new Error('Error submitting data')
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      alert('Error submitting data')
    }
  }

  // Add a new state variable for storing messages
  const [messages, setMessages] = useState([])
  useEffect(() => {
    fetchMessages()
  }, [])
  // Fetch message board data from Google Sheets here

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/loading', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)

        // Extract the values property from the fetched data
        const values = data.values || []

        const formattedMessages = values.slice(1).map((row: any) => {
          return {
            date: row[0],
            avatar: row[1],
            name: row[2],
            message: row[3],
          }
        })

        setMessages(formattedMessages) // Store fetched messages in the state
      } else {
        throw new Error('Error loading data')
      }
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error loading data')
    }
  }

  return (
    <div
      className='min-h-screen bg-gray-900/70 flex flex-col items-center bg-cover bg-center '
      style={{ backgroundImage: "url('comi.jpg')" }}
    >
      <div className='w-full max-w-7xl mt-10 flex flex-col md:flex-row gap-8 justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-lg'>
          <h2 className='text-2xl text-center font-medium mb-6'>
            Leave a Message
          </h2>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <label htmlFor='avatar'>Choose an avatar:</label>
            <Select
              name='avatar'
              id='avatar'
              value={avatarOptions.find(
                (option) => option.value === formData.avatar
              )}
              onChange={handleAvatarChange}
              options={avatarOptions}
              placeholder='Select an avatar'
              formatOptionLabel={(option) => (
                <div className=''>
                  <img
                    src={option.value}
                    alt={option.label}
                    className='w-30 h-30 hover:cursor-pointer'
                  />
                </div>
              )}
              components={{ MenuList }}
            />
            <div>
              <label
                htmlFor='name'
                className='block text-gray-700 font-medium text-lg'
              >
                Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Your Name'
                onChange={handleChange}
                className='mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50'
              />
            </div>
            <div className='whitespace-pre-wrap'>
              <label
                htmlFor='message'
                className='block text-gray-700 font-medium text-lg'
              >
                Message
              </label>
              <textarea
                id='message'
                name='message'
                onChange={handleChange}
                className='mt-1 block w-full resize-none md:h-48 border-b-2 border-gray-300  focus:outline-none whitespace-pre-wrap'
                placeholder='Write your message'
              ></textarea>
            </div>
            <div className='py-4 text-center'>
              <button
                type='submit'
                className='bg-orange-950 text-black py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors duration-300'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className='bg-red-500 rounded-lg shadow-lg p-6 w-full max-w-lg'>
          <h2 className='text-2xl text-center font-medium mb-6'>
            Message Board
          </h2>
          <div className='space-y-4 max-h-96 overflow-y-auto bg-red-600 border-2 border-black'>
            <div className='bg-blue-500 p-4 rounded-md'>
              <p>Test message</p>
            </div>
            {messages.map(({ date, avatar, name, message }) => (
              <div
                key={`${date}-${name}`}
                className=' p-4 rounded-md bg-yellow-500'
              >
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center'>
                    <img
                      src={avatar}
                      alt={name}
                      className='w-10 h-10 rounded-full mr-3'
                    />
                    <h3 className='font-semibold text-lg'>{name}</h3>
                  </div>
                  <p className='text-gray-500 text-sm'>{date}</p>
                </div>
                <p className='text-gray-700'>{message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
