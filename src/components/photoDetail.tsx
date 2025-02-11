'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { RiHeartFill, RiHeartAddLine } from 'react-icons/ri';
import { FaShareAlt } from 'react-icons/fa';

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    image?: string;
  };
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
  userOwner: {
    _id: string;
    username: string;
    image?: string;
  };
  likes: string[];
  createdAt?: string;
}

interface PhotoDetailProps {
  photoId?: string;
}

export default function PhotoDetail({
  photoId: propPhotoId,
}: PhotoDetailProps) {
  const router = useRouter();
  const photoId = propPhotoId || (router.query.photoId as string);
  const { data: session } = useSession();

  const [photo, setPhoto] = useState<PhotoDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!photoId) return;
    axios
      .get(`/api/photo/${photoId}`)
      .then(res => {
        setPhoto(res.data.photo);
        setComments(res.data.comments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (!photo) return;
    if (navigator.share) {
      navigator
        .share({
          title: photo.name,
          text: photo.instructions,
          url: window.location.href,
        })
        .catch(err => console.error(err));
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('已複製連結到剪貼簿');
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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {photo.userOwner.image ? (
              <Image
                src={photo.userOwner.image}
                alt={photo.userOwner.username}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-sm">{photo.userOwner.username}</p>
            {photo.createdAt && (
              <p className="text-xs text-gray-400">
                {new Date(photo.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button onClick={toggleLike} aria-label="Like" className="group">
            {(photo.likes ?? []).includes(session?.user?.id ?? '') ? (
              <RiHeartFill
                size={24}
                className="text-pink-500 transition-transform group-active:scale-125"
              />
            ) : (
              <RiHeartAddLine
                size={24}
                className="text-gray-600 transition-transform group-active:scale-125"
              />
            )}
          </button>
          <button onClick={handleShare} aria-label="Share" className="group">
            <FaShareAlt
              size={20}
              className="text-gray-600 transition-transform group-active:scale-125"
            />
          </button>
        </div>
      </div>

      <div className="bg-black flex items-center justify-center">
        {photo.imageUrl.endsWith('.mp4') ? (
          <video
            src={photo.imageUrl}
            controls
            className="object-contain w-full max-h-[500px]"
          />
        ) : (
          <Image
            src={photo.imageUrl}
            alt={photo.name}
            width={800}
            height={600}
            className="object-contain w-full max-h-[500px]"
          />
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <h1 className="font-bold text-lg">{photo.name}</h1>
          <p className="text-sm text-gray-400">{photo.location}</p>
          <p className="text-sm text-gray-700 mt-2">{photo.instructions}</p>
          <p className="text-sm font-semibold mt-2">
            {(photo.likes ?? []).length}{' '}
            {(photo.likes ?? []).length === 1 ? 'Like' : 'Likes'}
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-3">
          {comments.map(comment => (
            <div key={comment._id} className="flex space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {comment.user.image ? (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.username}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-bold">{comment.user.username}</span>{' '}
                  {comment.text}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleCommentSubmit}
          className="flex items-center space-x-2 border-t border-gray-200 pt-2"
        >
          <input
            type="text"
            placeholder="新增留言..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="flex-1 text-sm py-1 px-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="text-blue-500 font-bold text-sm"
          >
            送出
          </button>
        </form>
      </div>
    </div>
  );
}
