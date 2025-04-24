'use client';

import dayjs from 'dayjs';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
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

  const calculateAge = useCallback(
    (growingTime: number | string) => {
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
    },
    [babyBirthday]
  );

  // Age filter states
  const [startPeriod, setStartPeriod] = useState({ years: 0, months: 0 });
  const [endPeriod, setEndPeriod] = useState({ years: 2, months: 11 });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Range options
  const yearOptions = Array.from({ length: 3 }, (_, i) => i); // 0-2 years
  const monthOptions = Array.from({ length: 12 }, (_, i) => i); // 0-11 months

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

  const ageToMonths = useCallback((photoAge: string) => {
    const years = parseInt(photoAge.split('Y')[0]) || 0;
    const months = parseInt(photoAge.split('Y')[1]?.replace('M', '')) || 0;
    return years * 12 + months;
  }, []);

  const isInAgeRange = useCallback(
    (photoAge: string) => {
      const ageInMonths = ageToMonths(photoAge);
      const startMonths = startPeriod.years * 12 + startPeriod.months;
      const endMonths = endPeriod.years * 12 + endPeriod.months;
      return ageInMonths >= startMonths && ageInMonths <= endMonths;
    },
    [startPeriod, endPeriod, ageToMonths]
  );

  // Filter and sort photos
  const filteredAndSortedPhotos = useMemo(() => {
    return photo
      .slice()
      .filter(p => isInAgeRange(calculateAge(p.growingTime)))
      .sort((a, b) => {
        const ageA =
          parseInt(calculateAge(a.growingTime).replace(/Y|M/g, '')) || 0;
        const ageB =
          parseInt(calculateAge(b.growingTime).replace(/Y|M/g, '')) || 0;
        if (ageB !== ageA) {
          return ageB - ageA;
        }
        const timestampA = parseInt(a._id.substring(0, 8), 16);
        const timestampB = parseInt(b._id.substring(0, 8), 16);
        return timestampB - timestampA;
      });
  }, [photo, isInAgeRange, calculateAge]);

  // Implement virtual scrolling with intersection observer
  const [displayCount, setDisplayCount] = useState(8);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && displayCount < filteredAndSortedPhotos.length) {
      setDisplayCount(prev =>
        Math.min(prev + 8, filteredAndSortedPhotos.length)
      );
    }
  }, [inView, filteredAndSortedPhotos.length, displayCount]);

  // Memoize image loading state tracking
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages(prev => new Set([...prev, id]));
  }, []);

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
          <button
            onClick={handlePrevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 text-white bg-black/60 hover:bg-black/80 rounded-full z-20 active:scale-95 transition-all cursor-pointer"
            aria-label={t('common.previous')}
          >
            <AiOutlineLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <div className="w-full h-[45vh] md:h-[75vh] flex overflow-hidden relative m-auto">
            <div className="absolute inset-0 z-0">
              {images.map((image, index) => {
                const isNext = index === (currentSlide + 1) % images.length;
                const isPrev =
                  index === (currentSlide - 1 + images.length) % images.length;
                const shouldLoad = index === currentSlide || isNext || isPrev;

                return shouldLoad ? (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={t('photo.uploadedPhotoAlt', { index: index + 1 })}
                      className="animate-fadeIn"
                      priority={index === currentSlide}
                      fill
                      style={{ objectFit: 'contain' }}
                      quality={75}
                      sizes="100vw"
                    />
                  </div>
                ) : null;
              })}
            </div>
            <Swipe
              onSwipeLeft={handleNextSlide}
              onSwipeRight={handlePrevSlide}
              className="absolute z-10 w-full h-full"
            />
          </div>
          <button
            onClick={handleNextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 text-white bg-black/60 hover:bg-black/80 rounded-full z-20 active:scale-95 transition-all cursor-pointer"
            aria-label={t('common.next')}
          >
            <AiOutlineRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
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

      <div className="bg-gradient-to-b from-blue-50 to-white ">
        <div className="max-w-7xl mx-auto py-5 px-4">
          <div className="flex flex-wrap gap-6 items-center justify-center">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 min-w-[280px] md:min-w-[320px]">
              <label className="text-sm font-medium text-gray-700">
                {t('filter.from')}:
              </label>
              <select
                className="w-24 md:w-32 px-3 py-2 border-0 bg-blue-50/70 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 hover:bg-blue-50"
                value={startPeriod.years}
                onChange={e =>
                  setStartPeriod(prev => ({
                    ...prev,
                    years: parseInt(e.target.value),
                  }))
                }
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                    {t('filter.yearUnit')}
                  </option>
                ))}
              </select>
              <select
                className="w-24 md:w-32 px-3 py-2 border-0 bg-blue-50/70 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 hover:bg-blue-50"
                value={startPeriod.months}
                onChange={e =>
                  setStartPeriod(prev => ({
                    ...prev,
                    months: parseInt(e.target.value),
                  }))
                }
              >
                {monthOptions.map(month => (
                  <option key={month} value={month}>
                    {month}
                    {t('filter.monthUnit')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 min-w-[280px] md:min-w-[320px]">
              <label className="text-sm font-medium text-gray-700">
                {t('filter.to')}:
              </label>
              <select
                className="w-24 md:w-32 px-3 py-2 border-0 bg-blue-50/70 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 hover:bg-blue-50"
                value={endPeriod.years}
                onChange={e =>
                  setEndPeriod(prev => ({
                    ...prev,
                    years: parseInt(e.target.value),
                  }))
                }
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                    {t('filter.yearUnit')}
                  </option>
                ))}
              </select>
              <select
                className="w-24 md:w-32 px-3 py-2 border-0 bg-blue-50/70 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 hover:bg-blue-50"
                value={endPeriod.months}
                onChange={e =>
                  setEndPeriod(prev => ({
                    ...prev,
                    months: parseInt(e.target.value),
                  }))
                }
              >
                {monthOptions.map(month => (
                  <option key={month} value={month}>
                    {month}
                    {t('filter.monthUnit')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 md:px-6 mx-auto mb-6 text-black">
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
          {filteredAndSortedPhotos.slice(0, displayCount).map(photo => (
            <li
              key={photo._id}
              className="border border-gray-300 bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => setModalPhotoId(photo._id)}
            >
              <div className="relative w-full aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4]">
                {photo?.imageUrl?.includes('cloudinary') && photo?.imageUrl?.includes('/video/') ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <video
                      src={photo.imageUrl}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  </div>
                ) : photo?.imageUrl?.endsWith('.jpg') ||
                  photo?.imageUrl?.endsWith('.png') ||
                  photo?.imageUrl?.endsWith('.jpeg') ||
                  photo?.imageUrl?.includes('cloudinary') ? (
                  <>
                    {!loadedImages.has(photo._id) && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <Image
                      src={photo.imageUrl}
                      alt={photo.name}
                      className={`object-cover transition-opacity duration-300 ${
                        loadedImages.has(photo._id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      onLoadingComplete={() => handleImageLoad(photo._id)}
                    />
                  </>
                ) : photo?.imageUrl &&
                  (photo.imageUrl.includes('youtube.com') ||
                    photo.imageUrl.includes('youtu.be')) ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <ReactPlayer
                      url={photo.imageUrl}
                      controls={true}
                      width="100%"
                      height="100%"
                      config={{
                        youtube: {
                          playerVars: {
                            origin:
                              typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                            modestbranding: 1,
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <Image
                    src="/assets/notFound.jpg"
                    alt="Not Found"
                    fill
                    className="object-cover"
                  />
                )}
                <button
                  className={`absolute top-2 right-2 text-red-500 rounded-full p-3 active:scale-90 transition-all ${
                    isPhotosaved(photo._id)
                      ? 'bg-white/90 shadow-lg'
                      : 'bg-neutral-50/30 hover:bg-white/60'
                  }`}
                  onClick={e => {
                    e.stopPropagation();
                    if (!session) {
                      alert(t('photo.notLoggedIn'));
                      return;
                    }
                    toggleSavePhoto(photo._id);
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

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/10 to-transparent px-3 py-3 flex justify-end">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setModalPhotoId(photo._id);
                    }}
                    className="text-white flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-black/60 active:scale-95 transition-all"
                  >
                    <FaRegComment size={22} className="inline-block" />
                    <span className="text-sm font-semibold ">
                      {t('message.leaveMessage')}
                    </span>
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-bold pt-1 pb-3 mb-0">
                    {photo.name}
                  </h3>
                  <div className="flex gap-2 items-center">
                    <FaBaby size={25} />
                    {calculateAge(photo.growingTime)}
                  </div>
                </div>{' '}
                <p className="text-gray-600 text-sm md:text-base flex gap-2 items-center">
                  <FaMapMarkerAlt className="text-lg flex-shrink-0" />
                  <span className="truncate">{photo.location}</span>
                </p>
                <p className="text-gray-600 text-sm md:text-base line-clamp-3">
                  {photo.instructions}
                </p>
              </div>
            </li>
          ))}
          {displayCount < filteredAndSortedPhotos.length && (
            <li
              ref={loadMoreRef}
              className="col-span-full flex justify-center p-4"
            >
              <div className="animate-pulse rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </li>
          )}
        </ul>
      </div>
      {modalPhotoId && (
        <PhotoModal
          open={true}
          photoId={modalPhotoId}
          onClose={() => setModalPhotoId(null)}
          setModalPhotoId={setModalPhotoId}
        />
      )}
    </main>
  );
}
