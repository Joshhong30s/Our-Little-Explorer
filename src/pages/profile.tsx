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
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
      <section className="p-4 border border-gray-300 rounded-md space-y-4 bg-white">
        <h2 className="text-lg font-semibold">{t('profile.basicInfo')}</h2>
        <div className="flex items-center gap-4">
          {currentImage ? (
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={currentImage}
                alt="current avatar"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200" />
          )}

          <div>
            <p className="text-sm text-gray-500">{t('profile.username')}</p>
            <p className="text-base font-medium">
              {session?.user?.name || 'No name'}
            </p>

            <p className="text-sm text-gray-500 mt-2">{t('profile.email')}</p>
            <p className="text-base font-medium">
              {session?.user?.email || t('error_message')}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-semibold">{t('profile.registrationDate')}</span>
          {formattedDate}
        </div>
      </section>

      <section className="p-4 border border-gray-300 rounded-md space-y-4 bg-white">
        <h2 className="text-lg font-semibold">{t('profile.avatarUpload')}</h2>

        {previewUrl && (
          <div>
            <p className="text-sm text-gray-500">{t('profile.preview')}</p>
            <Image
              src={previewUrl}
              alt="preview"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
          "
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {uploading ? t('profile.uploading') : t('profile.avatarUpload')}
        </button>
      </section>

      <section className="p-4 border border-gray-300 rounded-md space-y-4 bg-white">
        <h2 className="text-lg font-semibold">{t('profile.bio')}</h2>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder={t('profile.bioPlaceholder')}
          className="w-full h-24 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleUpdateBio}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('profile.updateBio')}
        </button>
      </section>
    </div>
  );
}
