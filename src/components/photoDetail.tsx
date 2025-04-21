// Updated PhotoDetail.tsx with MCP integration
'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { RiHeartFill, RiHeartAddLine } from 'react-icons/ri';
import { FaShareAlt, FaTag } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });
import { Photo } from '@/types/photos';

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
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const isYoutube =
    photo?.imageUrl &&
    (photo.imageUrl.includes('youtube.com') ||
      photo.imageUrl.includes('youtu.be'));

  useEffect(() => {
    if (!photoId) return;

    const fetchPhotoData = async () => {
      try {
        const res = await axios.get(`/api/photo/${photoId}`);
        setPhoto(res.data.photo);
        setComments(res.data.comments || []);
        setLoading(false);

        // Fetch recommendations after photo is loaded
        fetchRecommendations();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const res = await axios.get(
          `/api/photo/recommendations?photoId=${photoId}`
        );
        setRecommendations(res.data);
        setLoadingRecommendations(false);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setLoadingRecommendations(false);
      }
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

  console.log('recommendations', recommendations);
  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left side - Image/Video */}
      <div className="md:flex-1 bg-black flex items-center justify-center relative">
        {/* Header for mobile */}
        {isMobile && (
          <div className="absolute top-12 left-0 right-0 z-10 flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 ring-2 ring-white">
                <Image
                  src={photo.userOwner.image || '/assets/avatar.jpg'}
                  alt={photo.userOwner.username}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-white font-medium text-sm drop-shadow">
                {photo.userOwner.username}
              </span>
            </div>
          </div>
        )}

        {isYoutube ? (
          <div className="w-[450px] h-[600px] flex items-center justify-center">
            {isYoutube && (
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
            )}
          </div>
        ) : (
          <Image
            src={photo.imageUrl ? photo.imageUrl : '/assets/notFound.jpg'}
            alt={photo.name}
            width={800}
            height={600}
            className="object-contain w-full max-h-[500px]"
          />
        )}
      </div>

      {/* Right side - Details and Comments */}
      <div className="flex flex-col md:w-[380px] bg-white">
        {/* Header for desktop */}
        {/* {!isMobile && (
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={photo.userOwner.image || "/assets/avatar.jpg"}
                  alt={photo.userOwner.username}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm">{photo.userOwner.username}</p>
                <p className="text-xs text-gray-500">{photo.location}</p>
              </div>
            </div>
          </div>
        )} */}

        {/* Comments and details scroll area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Photo caption */}
          <div className="p-4 space-y-2 border-b">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
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
                  <span className="text-gray-900">{photo.instructions}</span>
                </p>
                {photo.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            {recommendations?.suggestedTags &&
              recommendations.suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {recommendations.suggestedTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-blue-600 text-sm hover:underline cursor-pointer"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}
          </div>

          {/* Comments */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
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
                  ) : (
                    <RxAvatar size={32} className="text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-bold">{comment.user.username}</span>{' '}
                    {comment.text}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t bg-white">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLike}
                className="p-2 -ml-2 group active:scale-90 transition-transform"
                aria-label="Like"
              >
                {(photo.likes ?? []).includes(session?.user?.id ?? '') ? (
                  <RiHeartFill size={28} className="text-red-500" />
                ) : (
                  <RiHeartAddLine size={28} className="text-gray-700" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 group active:scale-90 transition-transform"
                aria-label="Share"
              >
                <FaShareAlt size={22} className="text-gray-700" />
              </button>
            </div>
            <p className="text-sm font-semibold">
              {(photo.likes ?? []).length}{' '}
              {(photo.likes ?? []).length === 1 ? 'like' : 'likes'}
            </p>
          </div>

          {/* Comment form */}
          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center px-4 py-2 border-t"
          >
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-1 text-sm py-2 focus:outline-none"
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
      </div>
    </div>
  );
}
