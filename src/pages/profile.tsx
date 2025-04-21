'use client';

import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

export default function ProfilePage() {
  const { t } = useTranslation('common');
  const { data: session } = useSession();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const [currentImage, setCurrentImage] = useState<string | null>(
    session?.user?.image || null
  );

  const [bio, setBio] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert(t('photo.noPhoto'));
      return;
    }
    if (!session?.user?.id) {
      alert(t('photo.notLoggedIn'));
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      formData.append('userId', session.user.id);

      const uploadRes = await axios.post('/api/user/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const cloudinaryUrl = uploadRes.data.url;

      const updateRes = await axios.put(`/api/user/${session.user.id}`, {
        image: cloudinaryUrl,
      });

      alert(t('profile.avatarUpload') + '成功！');
      console.log('更新回傳:', updateRes.data);

      setCurrentImage(cloudinaryUrl);
      setPreviewUrl('');
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      alert(t('photo.uploadFail'));
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateBio = async () => {
    if (!session?.user?.id) {
      alert(t('photo.notLoggedIn'));
      return;
    }
    try {
      const updateRes = await axios.put(`/api/user/${session.user.id}`, {
        bio,
      });
      alert(t('profile.updateBio') + '成功！');
      console.log(updateRes.data);
    } catch (error) {
      console.error(error);
      alert('更新失敗');
    }
  };

  const userCreatedAt = session?.user?.createdAt;
  const formattedDate = userCreatedAt
    ? dayjs(userCreatedAt).format('YYYY-MM-DD')
    : t('message.unknownDate');

  return (
    <div className="max-w-2xl mx-auto p-3 md:p-4 space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold px-1">{t('profile.title')}</h1>
      <section className="p-4 border border-gray-300 rounded-lg shadow-sm space-y-4 bg-white">
        <h2 className="text-lg font-semibold">{t('profile.basicInfo')}</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {currentImage ? (
            <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={currentImage}
                alt="current avatar"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-gray-200 border-2 border-gray-300" />
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-1">{t('profile.username')}</p>
            <p className="text-base font-medium truncate">
              {session?.user?.name || 'No name'}
            </p>

            <p className="text-sm text-gray-500 mt-3 mb-1">{t('profile.email')}</p>
            <p className="text-base font-medium truncate">
              {session?.user?.email || t('error_message')}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-semibold">{t('profile.registrationDate')}</span>
          {formattedDate}
        </div>
      </section>

      <section className="p-4 border border-gray-300 rounded-lg shadow-sm space-y-4 bg-white">
        <h2 className="text-lg font-semibold">{t('profile.avatarUpload')}</h2>

        <div className="flex flex-col items-center space-y-4">
          {previewUrl && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">{t('profile.preview')}</p>
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-blue-200">
                <Image
                  src={previewUrl}
                  alt="preview"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <label className="w-full cursor-pointer">
            <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-sm text-gray-600 text-center mb-2">{t('profile.dropImage')}</span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded font-medium text-sm hover:bg-blue-100 transition-colors">
                {t('profile.selectFile')}
              </span>
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 font-medium transition-colors active:scale-95"
          >
            {uploading ? t('profile.uploading') : t('profile.avatarUpload')}
          </button>
        </div>
      </section>

      <section className="p-4 border border-gray-300 rounded-lg shadow-sm space-y-4 bg-white">
        <h2 className="text-lg font-semibold">{t('profile.bio')}</h2>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder={t('profile.bioPlaceholder')}
          className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none text-base"
        />
        <button
          onClick={handleUpdateBio}
          className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors active:scale-95"
        >
          {t('profile.updateBio')}
        </button>
      </section>
    </div>
  );
}
