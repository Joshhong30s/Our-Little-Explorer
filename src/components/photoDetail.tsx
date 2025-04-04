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
}

export default function PhotoDetail({
  photoId: propPhotoId,
  setModalPhotoId: setModalPhotoId,
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

  const isYoutube = photo?.imageUrl && (
    photo.imageUrl.includes('youtube.com') ||
    photo.imageUrl.includes('youtu.be')
  );

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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-b-4 border-gray-400">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <Image
              src="/assets/avatar.jpg"
              alt={photo.userOwner.username}
              width={40}
              height={40}
              className="object-cover"
            />
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
                      origin: typeof window !== 'undefined' ? window.location.origin : '',
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

      <div className="p-4 space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">{photo.name}</h1>
            <p className="text-sm font-semibold">
              {(photo.likes ?? []).length}{' '}
              {(photo.likes ?? []).length === 1 ? 'Like' : 'Likes'}
            </p>
          </div>
          <p className="text-sm text-gray-400">{photo.location}</p>
          <p className="text-sm text-gray-700 mt-3">{photo.instructions}</p>

          {/* AI-Generated Tags */}
          {recommendations?.suggestedTags &&
            recommendations.suggestedTags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {recommendations.suggestedTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Comments Section */}
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

        {/* Comment Form */}
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

        {/* Related Photos Section - Powered by MCP */}
        {recommendations?.relatedPhotos &&
          recommendations.relatedPhotos.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-md font-semibold mb-3">Related Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {recommendations.relatedPhotos.slice(0, 3).map(relatedPhoto => (
                  <div
                    key={relatedPhoto._id}
                    className="relative h-24 cursor-pointer"
                    onClick={() =>
                      setModalPhotoId && setModalPhotoId(relatedPhoto._id)
                    }
                  >
                    <Image
                      src={relatedPhoto.imageUrl || '/assets/notFound.jpg'}
                      alt={relatedPhoto.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
