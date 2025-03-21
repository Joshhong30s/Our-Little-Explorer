'use client';

import dayjs from 'dayjs';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useGetUserID } from '../hooks/useGetUserId';
import { useCookies } from 'react-cookie';
import { RiHeartAddLine, RiHeartFill } from 'react-icons/ri';
import { FaMapMarkerAlt, FaBaby } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Swipe from 'react-easy-swipe';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { Photo } from '@/types/photos';
import PhotoModal from '../components/photoModal';
import { FaRegComment } from 'react-icons/fa';
import { set } from 'mongoose';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState<Photo[]>([]);
  const ReactPlayer = dynamic(() => import('react-player/lazy'), {
    ssr: false,
  });
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);
  const [cookies, _] = useCookies(['access_token']);
  const userID = useGetUserID();
  const babyBirthday = dayjs('2023-04-12T00:00:00+08:00');
  const [modalPhotoId, setModalPhotoId] = useState<string | null>(null);

  const calculateAge = (growingTime: number | string) => {
    if (typeof growingTime === 'number') {
      const diffYears = Math.floor(growingTime / 12);
      const diffMonths = Math.floor(growingTime % 12);
      return `${diffYears}Y${diffMonths}M`;
    } else {
      const date = dayjs(growingTime);
      const diffYears = date.diff(babyBirthday, 'year');
      const diffMonths = date.diff(
        babyBirthday.add(diffYears, 'year'),
        'month'
      );
      return `${diffYears}Y${diffMonths}M`;
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    let newSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
  };

  const handlePrevSlide = () => {
    let newSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
  };

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/photo/photo');
        setPhoto(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedPhotos = async () => {
      try {
        if (!session) return;
        const response = await axios.get('/api/photo/photo', {
          params: { action: 'savedPhotos', userID },
        });
        setSavedPhotos(response.data.savedPhotos);
      } catch (err) {
        console.error('Error fetching saved photos:', err);
      }
    };

    fetchPhoto();
    if (session) fetchSavedPhotos();
  }, [session, userID]);

  const savePhoto = async (photoID: string) => {
    try {
      const response = await axios.put(
        '/api/photo/photo',
        { photoID, userID },
        { headers: { authorization: cookies.access_token } }
      );
      setSavedPhotos(response.data.savedPhotos);
    } catch (err) {
      console.log(err);
    }
  };

  const unsavePhoto = async (photoID: string) => {
    try {
      const response = await axios.delete('/api/photo/photo', {
        data: { photoID, userID },
        headers: { authorization: cookies.access_token },
      });
      setSavedPhotos(response.data.savedPhotos || []);
    } catch (err) {
      console.log(err);
    }
  };

  const isPhotosaved = (photoID: string) =>
    savedPhotos && savedPhotos.includes(photoID);

  const toggleSavePhoto = (photoID: string) => {
    if (isPhotosaved(photoID)) {
      unsavePhoto(photoID);
    } else {
      savePhoto(photoID);
    }
  };

  const reversedPhoto = photo.slice().sort((a, b) => {
    const ageA = parseInt(calculateAge(a.growingTime).replace(/Y|M/g, '')) || 0;
    const ageB = parseInt(calculateAge(b.growingTime).replace(/Y|M/g, '')) || 0;
    if (ageB !== ageA) {
      return ageB - ageA;
    }
    const timestampA = parseInt(a._id.substring(0, 8), 16);
    const timestampB = parseInt(b._id.substring(0, 8), 16);
    return timestampB - timestampA;
  });

  /// slideshow images
  const images = [
    { id: 1, src: '/assets/bao1.jpeg', alt: 'bao1' },
    { id: 2, src: '/assets/bao2.jpeg', alt: 'bao2' },
    { id: 3, src: '/assets/bao3.jpeg', alt: 'bao3' },
    { id: 4, src: '/assets/bao4.jpeg', alt: 'bao4' },
    { id: 5, src: '/assets/bao5.jpeg', alt: 'bao5' },
    { id: 6, src: '/assets/bao6.jpeg', alt: 'bao6' },
    { id: 7, src: '/assets/bao7.jpeg', alt: 'bao7' },
    { id: 8, src: '/assets/bao8.jpeg', alt: 'bao8' },
    { id: 9, src: '/assets/bao9.jpeg', alt: 'bao9' },
    { id: 10, src: '/assets/bao10.jpeg', alt: 'bao10' },
  ];

  return (
    <main>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center min-h-screen text-center gap-2">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-lg ml-4">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-neutral-800 to-neutral-500">
          <AiOutlineLeft
            onClick={handlePrevSlide}
            className="absolute left-4 m-auto text-3xl md:text-6xl inset-y-1/2 cursor-pointer text-white p-1 md:p-4 bg-black rounded-full z-20"
          />
          <div className="w-full h-[40vh] md:h-[75vh] flex overflow-hidden relative m-auto">
            <Swipe
              onSwipeLeft={handleNextSlide}
              onSwipeRight={handlePrevSlide}
              className="absolute z-10 w-full h-full"
            >
              {images.map((image, index) => {
                if (index === currentSlide) {
                  return (
                    <Image
                      key={image.id}
                      src={image.src}
                      alt={t('photo.uploadedPhotoAlt', { index: index + 1 })}
                      className="animate-fadeIn"
                      priority={true}
                      fill
                      style={{ objectFit: 'contain' }}
                      quality={5}
                    />
                  );
                }
              })}
            </Swipe>
          </div>
          <AiOutlineRight
            onClick={handleNextSlide}
            className="absolute right-4 m-auto text-3xl md:text-6xl inset-y-1/2 cursor-pointer text-white p-1 md:p-4 bg-black rounded-full z-20"
          />
        </div>
      )}
      <div className="relative flex justify-center items-center p-6 bg-white">
        {images.map((_, index) => (
          <div
            key={index}
            className={
              index === currentSlide
                ? 'h-4 w-4 bg-gray-700 rounded-full mx-2 cursor-pointer'
                : 'h-4 w-4 bg-gray-300 rounded-full mx-2 cursor-pointer'
            }
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      <div className="px-2 md:px-6 mx-auto mb-6 text-black">
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {reversedPhoto.map(photo => (
            <li
              key={photo._id}
              className="border border-gray-300 bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => setModalPhotoId(photo._id)}
            >
              <div className="relative w-full h-96 sm:h-[450px] lg:h-[600px]">
                {photo?.imageUrl?.endsWith('.jpg') ||
                photo?.imageUrl?.endsWith('.png') ||
                photo?.imageUrl?.endsWith('.jpeg') ? (
                  <Image
                    src={photo.imageUrl}
                    alt={photo.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <ReactPlayer
                    url={photo.imageUrl}
                    controls={false}
                    width="100%"
                    height="100%"
                    config={{
                      youtube: {
                        playerVars: {
                          origin: 'https://06baby.vercel.app',
                          modestbranding: 1,
                        },
                      },
                    }}
                  />
                )}
                <button
                  className="absolute top-2 right-2 bg-neutral-50 bg-opacity-30 text-red-500 rounded-full p-3"
                  onClick={e => {
                    e.stopPropagation();
                    if (!session) {
                      alert(t('photo.notLoggedIn'));
                      return;
                    }
                    toggleSavePhoto(photo._id);
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
                      className="text-red-500 text-base hover:scale-125 transition-all"
                    />
                  ) : (
                    <RiHeartAddLine
                      size={40}
                      className="text-base hover:scale-125 transition-all"
                    />
                  )}
                </button>

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/10 to-transparent px-3 py-2 flex justify-end">
                  <button
                    onClick={() => setModalPhotoId(photo._id)}
                    className="text-white flex items-center gap-2 bg-black/30 px-3 py-2 rounded-md hover:bg-black/50 transition"
                  >
                    <FaRegComment size={22} className="inline-block" />
                    <span className="text-sm font-semibold ">
                      {t('message.leaveMessage')}
                    </span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-bold pt-1 pb-3 mb-0">
                    {photo.name}
                  </h3>
                  <div className="flex gap-2 items-center">
                    <FaBaby size={25} />
                    {calculateAge(photo.growingTime)}
                  </div>
                </div>
                <p className="text-gray-600 text-base flex gap-2 items-center">
                  <FaMapMarkerAlt size={25} />
                  {photo.location}
                </p>
                <p className="text-gray-600 text-base my-8">
                  {photo.instructions}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {modalPhotoId && (
        <PhotoModal
          open={true}
          photoId={modalPhotoId}
          onClose={() => setModalPhotoId(null)}
        />
      )}
    </main>
  );
}
