interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <div className="relative w-full h-full bg-black">
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-contain"
        playsInline
        muted
        loop
        preload="auto"
      />
    </div>
  );
}
