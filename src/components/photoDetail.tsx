'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { RiHeartFill, RiHeartAddLine } from 'react-icons/ri';
import { FaShareAlt } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });
import { Photo } from '@/types/photos';
import VideoPlayer from './VideoPlayer';

interface Comment {
  _id: string;
  user: { _id: string; username: string; image?: string };
  text: string;
  createdAt: string;
}

interface PhotoDetails {
  _id: string;
  name: string;
  location: string;
  instructions: string;
  imageUrl: string;
  growingTime: string;
  userOwner: { _id: string; username: string; image?: string };
  likes: string[];
  createdAt?: string;
}

interface PhotoRecommendation {
  suggestedTags: string[];
  relatedPhotos: Photo[];
}

interface PhotoDetailProps {
  photoId?: string;
  setModalPhotoId?: (id: string) => void;
  isMobile?: boolean;
}

export default function PhotoDetail({
  photoId: propPhotoId,
  setModalPhotoId,
  isMobile = false,
}: PhotoDetailProps) {
  const router = useRouter();
  const photoId = propPhotoId || (router.query.photoId as string);
  const { data: session } = useSession();

  const [photo, setPhoto] = useState<PhotoDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [recommendations, setRecommendations] =
    useState<PhotoRecommendation | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);

  const getMediaType = (url?: string) => {
    if (!url) return 'none';
    if (url.includes('youtube.com') || url.includes('youtu.be'))
      return 'youtube';
    if (url.includes('cloudinary') && url.includes('/video/'))
      return 'cloudinary-video';
    return 'image';
  };
  const mediaType = getMediaType(photo?.imageUrl);

  useEffect(() => {
    if (!photoId) return;
    const fetchPhotoData = async () => {
      try {
        const res = await axios.get(`/api/photo/${photoId}`);
        setPhoto(res.data.photo);
        setComments(res.data.comments || []);
      } catch {}
      setLoading(false);
      try {
        const rec = await axios.get(
          `/api/photo/recommendations?photoId=${photoId}`
        );
        setRecommendations(rec.data);
      } catch {}
    };
    fetchPhotoData();
  }, [photoId]);

  const toggleLike = async () => {
    if (!session || !photo) {
      alert('請先登入才能按讚');
      return;
    }
    try {
      const res = await axios.post(`/api/photo/${photo._id}/like`, {
        userId: session.user.id,
      });
      setPhoto(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !photo) {
      alert('請先登入才能留言');
      return;
    }
    try {
      const res = await axios.post(`/api/photo/${photo._id}/comment`, {
        userId: session.user.id,
        text: newComment,
      });
      setComments(res.data.comments);
      setNewComment('');
      setIsCommenting(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (!photo) return;
    if (navigator.share) {
      await navigator.share({
        title: photo.name,
        text: photo.instructions,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('已複製連結到剪貼簿');
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const target = event.target as HTMLElement;
    if (
      target.closest('.comment-form') ||
      target.closest('.comment-input') ||
      target.closest('.comment-scroll-container')
    )
      return;
    if (touch.clientY > window.innerHeight - 100) {
      setModalPhotoId?.('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  if (!photo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>找不到相片</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col md:flex-row h-full"
        onTouchStart={handleTouchStart}
      >
        <div
          className={`
          bg-black flex items-center justify-center relative
          ${isMobile ? 'h-[60vh]' : ''}
          md:flex-1 md:min-w-[600px]
        `}
        >
          {mediaType === 'youtube' ? (
            <div className="w-[450px] h-[600px] flex items-center justify-center">
              <ReactPlayer
                url={photo.imageUrl}
                controls={true}
                width={450}
                height={600}
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
          ) : mediaType === 'cloudinary-video' ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-[450px] aspect-[3/4] flex items-center justify-center">
                <VideoPlayer videoUrl={photo.imageUrl} />
              </div>
            </div>
          ) : (
            <Image
              src={photo.imageUrl || '/assets/notFound.jpg'}
              alt={photo.name}
              width={800}
              height={600}
              className="object-contain w-full h-full"
            />
          )}
        </div>

        <div
          className={`
          flex flex-col bg-white
          ${isMobile ? 'h-[40vh]' : 'h-full'}
          md:flex-none md:w-[380px]
        `}
        >
          <div className="p-4 border-b space-y-2">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={photo.userOwner.image || '/assets/avatar.jpg'}
                  alt={photo.userOwner.username}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-bold">{photo.userOwner.username}</span>{' '}
                  {photo.instructions}
                </p>
                {photo.createdAt && (
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {recommendations && recommendations?.suggestedTags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {recommendations?.suggestedTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-blue-600 text-sm hover:underline cursor-pointer"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 comment-scroll-container">
            {comments.map(c => (
              <div key={c._id} className="flex space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  {c.user.image ? (
                    <Image
                      src={c.user.image}
                      alt={c.user.username}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <RxAvatar size={32} className="text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-bold">{c.user.username}</span>{' '}
                    {c.text}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!isCommenting && (
            <div className="border-t bg-white">
              <div className="px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleLike}
                    className="p-2 group active:scale-90 transition-transform"
                  >
                    {photo.likes.includes(session?.user?.id || '') ? (
                      <RiHeartFill size={28} className="text-red-500" />
                    ) : (
                      <RiHeartAddLine size={28} className="text-gray-700" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 group active:scale-90 transition-transform"
                  >
                    <FaShareAlt size={22} className="text-gray-700" />
                  </button>
                </div>
                <p className="text-sm font-semibold">
                  {photo.likes.length}{' '}
                  {photo.likes.length === 1 ? 'like' : 'likes'}
                </p>
              </div>
              <form
                onSubmit={handleCommentSubmit}
                className="comment-form flex items-center px-4 py-2 border-t"
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onFocus={() => setIsCommenting(true)}
                  className="comment-input flex-1 text-sm py-2 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="ml-2 text-blue-500 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {isCommenting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <form onSubmit={handleCommentSubmit} className="flex flex-col">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                autoFocus
                className="border p-2 mb-4 focus:outline-none"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCommenting(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
