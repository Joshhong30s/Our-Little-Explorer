'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserId';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { uploadToCloudinary, isVideo } from '@/utils/cloudinaryUploader';

type PhotoType = {
  name: string;
  location: string;
  instructions: string;
  imageUrl: string;
  growingTime: string;
  userOwner: string;
};

export default function WritePhoto() {
  const { t } = useTranslation('common');
  const userID = useGetUserID();
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState<PhotoType>({
    name: '',
    location: '',
    instructions: '',
    imageUrl: '',
    growingTime: '',
    userOwner: userID ?? '',
  });

  const [uploadStatus, setUploadStatus] = useState<{
    status: 'idle' | 'uploading' | 'success' | 'error';
    message?: string;
    details?: string;
  }>({ status: 'idle' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPhoto({
      ...photo,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setPhoto({
      ...photo,
      growingTime: dayjs(selectedDate).toISOString(),
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      alert(t('photo.noPhoto'));
      return;
    }

    const fileType = selectedFile.type;
    const isVideoFile = isVideo(fileType);
    const maxSize = 60 * 1024 * 1024; // 60MB

    if (selectedFile.size > maxSize) {
      alert(t('photo.fileTooLarge'));
      return;
    }

    setFile(selectedFile);
    setUploadStatus({ 
      status: 'uploading', 
      message: t('photo.uploading')
    });

    try {
      const cloudinaryUrl = await uploadToCloudinary(selectedFile);
      
      setUploadStatus({ 
        status: 'success',
        message: t('photo.uploadSuccess')
      });
      
      setPhoto({
        ...photo,
        imageUrl: cloudinaryUrl,
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadStatus({ 
        status: 'error',
        message: t('photo.uploadFail'),
        details: err.message
      });
      setFile(null);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session || !session.user) {
      alert(t('photo.notLoggedIn'));
      return;
    }

    if (!photo.imageUrl) {
      alert(t('photo.noPhoto'));
      return;
    }

    const token = session.user.accessToken || session?.user?.id;
    if (!token) {
      alert(t('photo.noAccessToken'));
      return;
    }

    try {
      await axios.post('/api/photo/photo', photo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.replace('/');
    } catch (error) {
      console.error(error);
      alert(t('photo.failedUpload'));
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900/70 flex flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: "url('bao6.jpeg')" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mt-10">
        <h2 className="text-2xl text-center font-medium mb-6">
          {t('photo.diaryTitle')}
        </h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium text-lg"
            >
              {t('photo.photoTitleLabel')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t('photo.photoTitlePlaceholder')}
              onChange={handleChange}
              className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-medium text-lg"
            >
              {t('photo.photoLocationLabel')}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder={t('photo.photoLocationPlaceholder')}
              onChange={handleChange}
              className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
          <div className="whitespace-pre-wrap">
            <label
              htmlFor="instructions"
              className="block text-gray-700 font-medium text-lg"
            >
              {t('photo.photoDescriptionLabel')}
            </label>
            <textarea
              id="instructions"
              name="instructions"
              onChange={handleChange}
              className="mt-1 block w-full resize-none md:h-48 border-b-2 border-gray-300 focus:outline-none whitespace-pre-wrap"
              placeholder={t('photo.photoDescriptionPlaceholder')}
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="growingTime"
              className="block text-gray-700 font-medium text-lg"
            >
              {t('photo.photoAgeLabel')}
            </label>
            <input
              type="date"
              id="growingTime"
              name="growingTime"
              placeholder={t('photo.photoAgePlaceholder')}
              onChange={handleDateChange}
              className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium text-lg"
            >
              {t('photo.uploadOptionLabel')}
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*,video/*"
              onChange={handleImageChange}
              className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
              disabled={uploadStatus.status === 'uploading'}
            />
            {uploadStatus.status === 'uploading' && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">{uploadStatus.message}</span>
              </div>
            )}
            {uploadStatus.status === 'error' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{uploadStatus.message}</p>
                {uploadStatus.details && (
                  <p className="text-red-500 text-xs mt-1">{uploadStatus.details}</p>
                )}
              </div>
            )}
            {uploadStatus.status === 'success' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 text-sm">{uploadStatus.message}</p>
              </div>
            )}
            {file && uploadStatus.status !== 'error' && (
              <div className="mt-4 relative w-full aspect-video">
                {file.type.startsWith('video/') ? (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={t('photo.uploadedPhotoAlt')}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            )}
          </div>
          <div className="py-4 text-center">
            <button
              type="submit"
              disabled={uploadStatus.status === 'uploading'}
              className="py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-teal-980 hover:text-gray-100 text-slate-600 bg-blue-980 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('photo.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
