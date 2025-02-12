'use client';

import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { set } from 'mongoose';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    session?.user?.image || null
  );
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('請先選擇圖片');
      return;
    }
    if (!session?.user?.id) {
      alert('請先登入');
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

      const updateRes = await axios.put(
        `/api/user/${session.user.id}`,
        { image: cloudinaryUrl } // body
      );

      alert('頭像更新成功！');
      console.log('更新回傳:', updateRes.data);

      setCurrentImage(cloudinaryUrl);
    } catch (error) {
      console.error(error);
      alert('上傳失敗');
    } finally {
      setUploading(false);
    }
  };

  console.log('session:', session);
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">管理個人資料</h1>

      <div className="mb-4">
        <p className="text-sm text-gray-500">目前頭像：</p>
        {currentImage ? (
          <Image
            src={currentImage}
            alt="current avatar"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200" />
        )}
      </div>

      {previewUrl && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">預覽：</p>
          <Image
            src={previewUrl}
            alt="preview"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        </div>
      )}

      <div className="mb-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {uploading ? '上傳中...' : '上傳頭像'}
      </button>
    </div>
  );
}
