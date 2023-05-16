import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useGetUserID } from '../hooks/useGetUserId'
import { useCookies } from 'react-cookie'
import { RiHeartAddLine, RiHeartFill } from 'react-icons/ri'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { FaBaby } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import Swipe from 'react-easy-swipe'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [photo, setPhoto] = useState([])
  const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
  const [savedPhotos, setSavedPhotos] = useState<string[]>([])
  const [cookies, _] = useCookies(['access_token'])
  const userID = useGetUserID()

  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNextSlide = () => {
    let newSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1
    setCurrentSlide(newSlide)
  }

  const handlePrevSlide = () => {
    let newSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1
    setCurrentSlide(newSlide)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // or however long you think it might take to load the images

    return () => clearTimeout(timer) // cleanup on unmount
  }, [])

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(
          'https://zero6babyserver.onrender.com/photos'
        )
        setPhoto(response.data)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    const fetchSavedPhotos = async () => {
      try {
        const response = await axios.get(
          `https://zero6babyserver.onrender.com/photos/savedPhotos/ids/${userID}`
        )
        setSavedPhotos(response.data.savedPhotos)
        console.log('Response data:', response.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchPhoto()

    if (cookies.access_token) fetchSavedPhotos()
  }, [cookies.access_token, userID])

  // send update request to backend and wait for response
  const savePhoto = async (photoID: string) => {
    try {
      const response = await axios.put(
        'https://zero6babyserver.onrender.com/photos',
        {
          photoID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      )
      setSavedPhotos(response.data.savedPhotos)
    } catch (err) {
      console.log(err)
    }
  }

  const unsavePhoto = async (photoID: string) => {
    try {
      const response = await axios.delete(
        'https://zero6babyserver.onrender.com/photos',
        {
          data: {
            photoID,
            userID,
          },
          headers: { authorization: cookies.access_token },
        }
      )
      setSavedPhotos(response.data.savedPhotos || [])
    } catch (err) {
      console.log(err)
    }
  }

  const isPhotosaved = (photoID: string) =>
    savedPhotos && savedPhotos.includes(photoID)

  const toggleSavePhoto = (photoID: string) => {
    if (isPhotosaved(photoID)) {
      unsavePhoto(photoID)
    } else {
      savePhoto(photoID)
    }
  }

  const reversedPhoto = photo.slice().reverse()

  ///slideshow

  const images = [
    { id: 1, src: '/bao1.jpeg', alt: 'bao1' },
    { id: 2, src: '/bao2.jpeg', alt: 'bao2' },
    { id: 3, src: '/bao3.jpeg', alt: 'bao3' },
    { id: 4, src: '/bao4.jpeg', alt: 'bao4' },
    { id: 5, src: '/bao5.jpeg', alt: 'bao5' },
    { id: 6, src: '/bao6.jpeg', alt: 'bao6' },
    { id: 7, src: '/bao7.jpeg', alt: 'bao7' },
    { id: 8, src: '/bao8.jpeg', alt: 'bao8' },
    { id: 9, src: '/bao9.jpeg', alt: 'bao9' },
    { id: 10, src: '/bao10.jpeg', alt: 'bao10' },
  ]

  return (
    <main>
      {isLoading ? (
        <div className='flex flex-col justify-center items-center min-h-screen text-center gap-2'>
          <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
          <p className='text-lg ml-4'>Loading...</p>
        </div>
      ) : (
        <div className='relative bg-gradient-to-br from-neutral-800 to-neutral-500'>
          <AiOutlineLeft
            onClick={handlePrevSlide}
            className='absolute left-4 m-auto text-3xl md:text-6xl inset-y-1/2 cursor-pointer text-white p-1 md:p-4 bg-black rounded-full z-20'
          />

          <div className='w-full h-[40vh] md:h-[75vh] flex overflow-hidden relative m-auto '>
            <Swipe
              onSwipeLeft={handleNextSlide}
              onSwipeRight={handlePrevSlide}
              className='absolute z-10 w-full h-full'
            >
              {images.map((image, index) => {
                if (index === currentSlide) {
                  return (
                    <Image
                      key={image.id}
                      src={image.src}
                      alt={`Slide image ${index + 1}`}
                      className='animate-fadeIn'
                      priority={true}
                      fill
                      style={{ objectFit: 'contain' }}
                      quality={10}
                    />
                  )
                }
              })}
            </Swipe>
          </div>
          <AiOutlineRight
            onClick={handleNextSlide}
            className='absolute right-4 m-auto text-3xl md:text-6xl inset-y-1/2 cursor-pointer text-white p-1 md:p-4 bg-black rounded-full z-20'
          />
        </div>
      )}
      <div className='relative flex justify-center items-center p-6 bg-white'>
        {images.map((_, index) => {
          return (
            <div
              className={
                index === currentSlide
                  ? 'h-4 w-4 bg-gray-700 rounded-full mx-2  cursor-pointer'
                  : 'h-4 w-4 bg-gray-300 rounded-full mx-2  cursor-pointer'
              }
              key={index}
              onClick={() => {
                setCurrentSlide(index)
              }}
            />
          )
        })}
      </div>

      <div className='px-2 md:px-6 mx-auto mb-6 text-black'>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          {reversedPhoto.map(
            (photo: {
              birthday: string
              _id: string
              name: string
              location: string
              instructions: string
              imageUrl: string
              growingTime: number
            }) => (
              <li
                key={photo._id}
                className='border border-gray-300  bg-gray-100 rounded-lg'
              >
                <div className='relative w-full h-96 sm:h-[450px] lg:h-[600px]'>
                  {photo.imageUrl.endsWith('.jpg') ||
                  photo.imageUrl.endsWith('.png') ? (
                    <Link
                      href={photo.imageUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.name}
                        className='object-cover'
                        fill
                      />
                    </Link>
                  ) : (
                    <ReactPlayer
                      url={photo.imageUrl}
                      controls={false}
                      width='100%'
                      height='100%'
                      config={{
                        youtube: {
                          playerVars: {
                            origin: 'https://www.youtube.com',
                          },
                        },
                      }}
                    />
                  )}
                  <button
                    className='absolute top-2 right-2 bg-neutral-50 bg-opacity-30 text-red-500 rounded-full p-3'
                    onClick={() => {
                      if (!cookies.access_token) {
                        alert('請先登入才能使用我的最愛功能')
                        return
                      }
                      toggleSavePhoto(photo._id)
                    }}
                    style={{
                      transform: isPhotosaved(photo._id)
                        ? 'scale(1.1)'
                        : 'scale(1)',
                    }}
                  >
                    {isPhotosaved(photo._id) ? (
                      <RiHeartFill
                        size={40}
                        className='text-red-500 text-base hover:scale-125 transition-all'
                      />
                    ) : (
                      <RiHeartAddLine
                        size={40}
                        className='text-base hover:scale-125 transition-all'
                      />
                    )}
                  </button>
                </div>
                <div className='p-4'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-3xl font-bold pt-1 pb-3 mb-0'>
                      {photo.name}
                    </h3>
                    <div className='flex gap-2 items-center'>
                      <FaBaby size={25} />
                      {photo.growingTime} month
                    </div>
                  </div>
                  <p className='text-gray-600 text-base flex gap-2 items-center'>
                    <FaMapMarkerAlt size={25} />
                    {photo.location}
                  </p>
                  <p className='text-gray-600 text-base my-8'>
                    {photo.instructions}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </main>
  )
}
