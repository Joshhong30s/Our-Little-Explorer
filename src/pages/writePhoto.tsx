'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserId';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { uploadToCloudinary, isVideo } from '@/utils/cloudinaryUploader';
import { DragDropUpload } from '../components/common/DragDropUpload';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

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
  const [quickMode, setQuickMode] = useState(false);
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

  const handleFileSelect = async (selectedFile: File) => {
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
        name: photo.name || selectedFile.name.replace(/\.[^/.]+$/, ''), // Auto-fill name if empty
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
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

    try {
      const photoData = {
        ...photo,
        userOwner: userID,
        location: photo.location || '',
        instructions: photo.instructions || '',
        growingTime: photo.growingTime || dayjs().toISOString()
      };
      await axios.post('/api/photo/photo', photoData);
      window.location.replace('/');
    } catch (error) {
      console.error(error);
      alert(t('photo.failedUpload'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('photo.diaryTitle')}
          </h1>
          <p className="text-gray-600">
            記錄寶寶珍貴的成長時刻
          </p>
        </div>

        {/* Quick Mode Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">快速上傳模式</h3>
              <p className="text-sm text-gray-500">只需填寫標題即可快速分享</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quickMode}
                onChange={(e) => setQuickMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <form className="p-6 space-y-6" onSubmit={onSubmit}>
            {/* Photo Upload Area */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                選擇照片或影片
              </h3>
              
              {!photo.imageUrl ? (
                <DragDropUpload
                  onFileSelect={handleFileSelect}
                  disabled={uploadStatus.status === 'uploading'}
                  className="min-h-[200px]"
                />
              ) : (
                <div className="relative">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {file && file.type.startsWith('video/') ? (
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={photo.imageUrl}
                        alt="上傳的照片"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto({ ...photo, imageUrl: '' });
                      setFile(null);
                      setUploadStatus({ status: 'idle' });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {/* Alternative file input for fallback */}
              <div className="text-center">
                <label htmlFor="file-input" className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                  或從檔案管理器選擇
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploadStatus.status === 'uploading'}
                />
              </div>
            </div>

            {/* Upload Status */}
            {uploadStatus.status === 'uploading' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <div>
                  <p className="font-medium text-blue-900">{uploadStatus.message}</p>
                  <p className="text-sm text-blue-600">正在處理您的檔案...</p>
                </div>
              </div>
            )}
            
            {uploadStatus.status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{uploadStatus.message}</p>
                  <p className="text-sm text-green-600">檔案已成功上傳至雲端</p>
                </div>
              </div>
            )}
            
            {uploadStatus.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">{uploadStatus.message}</p>
                  {uploadStatus.details && (
                    <p className="text-sm text-red-600 mt-1">{uploadStatus.details}</p>
                  )}
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                基本資訊
              </h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  照片標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={photo.name}
                  placeholder="例如：寶寶第一次笑容"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="growingTime" className="block text-sm font-medium text-gray-700 mb-2">
                  拍攝時間
                </label>
                <input
                  type="date"
                  id="growingTime"
                  name="growingTime"
                  onChange={handleDateChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
            </div>

            {/* Additional Details (shown only when not in quick mode) */}
            {!quickMode && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  詳細資訊 <span className="text-sm font-normal text-gray-500">(選填)</span>
                </h3>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    拍攝地點
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={photo.location}
                    placeholder="例如：家裡客廳、公園、醫院"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    照片描述
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={photo.instructions}
                    onChange={handleChange}
                    rows={4}
                    placeholder="記錄這個美好時刻的故事..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-400 resize-none"
                  />
                </div>
              </div>
            )}
            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={uploadStatus.status === 'uploading' || !photo.imageUrl || !photo.name}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                {uploadStatus.status === 'uploading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    上傳中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    📸 分享到相簿
                  </span>
                )}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-3">
                {quickMode ? '快速模式：只需填寫標題即可分享' : '完整模式：包含詳細資訊'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
