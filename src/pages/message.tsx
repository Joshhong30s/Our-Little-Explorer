import { useState } from 'react'
import Select from 'react-select'

export default function Message() {
  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    message: '',
  })
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const avatarOptions = [
    { value: '/path/to/avatar1.png', label: 'Avatar 1' },
    { value: '/path/to/avatar2.png', label: 'Avatar 2' },
    { value: '/path/to/avatar2.png', label: 'Avatar 3' },
    { value: '/path/to/avatar2.png', label: 'Avatar 4' },
    { value: '/path/to/avatar2.png', label: 'Avatar 5' },
    { value: '/path/to/avatar2.png', label: 'Avatar 6' },
    { value: '/path/to/avatar2.png', label: 'Avatar 7' },
    { value: '/path/to/avatar2.png', label: 'Avatar 8' },
    { value: '/path/to/avatar2.png', label: 'Avatar 9' },
    // Add more avatar options here
  ]

  const handleAvatarClick = (avatar: string) => {
    setSelectedAvatar(avatar)
    handleChange({ target: { name: 'avatar', value: avatar } })
  }
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
        /// alert
        alert('suceess!!!')
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

  // Fetch message board data from Google Sheets here

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
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div className='grid grid-cols-3 gap-2'>
              {avatarOptions.map((option, index) => (
                <img
                  key={index}
                  src={option.value}
                  alt={option.label}
                  className={`w-full h-auto rounded-lg cursor-pointer border-2 ${
                    selectedAvatar === option.value
                      ? 'border-indigo-500'
                      : 'border-transparent'
                  }`}
                  onClick={() => handleAvatarClick(option.value)}
                />
              ))}
            </div>
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
        <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-lg'>
          <h2 className='text-2xl text-center font-medium mb-6'>
            Message Board
          </h2>
          <div className='message-board space-y-4 max-h-96 overflow-y-auto'>
            {/* Render message board data here */}
            <div className='bg-gray-100 p-4 rounded-md'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center'>
                  <img
                    src='avatar1.jpg'
                    alt='Avatar 1'
                    className='w-10 h-10 rounded-full mr-3'
                  />
                  <h3 className='font-semibold text-lg'>John Doe</h3>
                </div>
                <p className='text-gray-500 text-sm'>2023/05/01</p>
              </div>
              <p className='text-gray-700'>
                This is a sample message from John Doe.
              </p>
            </div>
            <div className='bg-gray-100 p-4 rounded-md'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center'>
                  <img
                    src='avatar2.jpg'
                    alt='Avatar 2'
                    className='w-10 h-10 rounded-full mr-3'
                  />
                  <h3 className='font-semibold text-lg'>Jane Smith</h3>
                </div>
                <p className='text-gray-500 text-sm'>2023/05/02</p>
              </div>
              <p className='text-gray-700'>
                This is another sample message from Jane Smith.
              </p>
            </div>
            {/* Continue rendering more messages */}
          </div>
        </div>
      </div>
    </div>
  )
}
