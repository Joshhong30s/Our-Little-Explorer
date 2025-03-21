'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useGetUserID } from '../hooks/useGetUserId';
import { FaBaby } from 'react-icons/fa';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

export default function SavedPhotos() {
  const { t } = useTranslation('common');
  const [savedPhotos, setSavedPhotos] = useState([]);

  const userID = useGetUserID();
  useEffect(() => {
    const fetchSavedPhotos = async () => {
      try {
        const response = await axios.get(`/api/photo/photo`, {
          params: { action: 'savedPhotos', userID },
        });
        setSavedPhotos(response.data.savedPhotos);
        console.log('Response data:', response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedPhotos();
  }, [userID]);

  const babyBirthday = dayjs('2023-04-12T00:00:00+08:00');
  const calculateAge = (growingTime: number | string) => {
    if (typeof growingTime === 'number') {
      const diffYears = Math.floor(growingTime / 12);
      const diffMonths = Math.floor(growingTime % 12);
      console.log('diffYears:', diffYears, 'diffMonths:', diffMonths);

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

  const reversedSavedPhotos = Array.isArray(savedPhotos)
    ? savedPhotos.slice().reverse()
    : [];

  return (
    <main>
      <div className="px-6 mx-auto mb-8 text-black">
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {reversedSavedPhotos.map(
            (photo: {
              _id: string;
              name: string;
              location: string;
              instructions: string;
              imageUrl: string;
              growingTime: number | string;
            }) => (
              <li className="border border-gray-200 rounded-lg" key={photo._id}>
                <div className="relative w-full h-96 sm:h-[450px] lg:h-[600px]">
                  {photo.imageUrl.endsWith('.jpg') ||
                  photo.imageUrl.endsWith('.png') ||
                  photo.imageUrl.endsWith('.jpeg') ? (
                    <Link
                      href={photo.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.name}
                        className="object-cover"
                        fill
                      />
                    </Link>
                  ) : (
                    <ReactPlayer
                      url={photo.imageUrl}
                      controls={false}
                      width="100%"
                      height="100%"
                      config={{
                        youtube: {
                          playerVars: {
                            origin: 'https://www.youtube.com',
                          },
                        },
                      }}
                      allow="fullscreen; autoplay"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-3xl font-bold pt-1 pb-3 mb-0">
                      {photo.name}
                    </h3>
                    <div className="flex space-x-1 items-center">
                      <FaBaby size={30} />
                      <p className=" text-gray-800 text-sm">
                        {calculateAge(photo.growingTime)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm ">
                    {t('photo.photoLocationLabel')}：{photo.location}
                  </p>
                  <p className="text-gray-600 text-sm my-4">
                    {photo.instructions}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </main>
  );
}
