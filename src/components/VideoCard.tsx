"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "@/types/video";

interface VideoCardProps {
  video: Video;
  onPlay: (id: string) => void;
  registerVideo: (id: string, el: HTMLVideoElement | null) => void;
  globalMuted: boolean;
  onToggleMute: () => void;
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export default function VideoCard({
  video,
  onPlay,
  registerVideo,
  globalMuted,
  onToggleMute,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  // Tracks manual pause so Intersection Observer won't auto-resume until scrolled away
  const userPausedRef = useRef(false);
  const heartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    registerVideo(video.id, videoRef.current);
    return () => registerVideo(video.id, null);
  }, [video.id, registerVideo]);

  // Update muted property programmatically to avoid React warning issues
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = globalMuted;
    }
  }, [globalMuted]);

  // Intersection Observer: auto play when ≥60% visible, pause when not.
  useEffect(() => {
    const card = cardRef.current;
    const videoEl = videoRef.current;
    if (!card || !videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          if (!userPausedRef.current) {
            videoEl.play().catch(() => {});
            onPlay(video.id);
            setIsPlaying(true);
          }
        } else {
          videoEl.pause();
          setIsPlaying(false);
          // Reset manual pause once the card leaves view
          if (!entry.isIntersecting) {
            userPausedRef.current = false;
          }
        }
      },
      { threshold: [0, 0.6, 1] }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [video.id, onPlay]);

  const handleVideoClick = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      userPausedRef.current = false;
      videoEl.play().catch(() => {});
      onPlay(video.id);
      setIsPlaying(true);
    } else {
      userPausedRef.current = true;
      videoEl.pause();
      setIsPlaying(false);
    }
  }, [video.id, onPlay]);

  const handleLike = useCallback(() => {
    setIsLiked((prev) => {
      setLikesCount((count) => (prev ? count - 1 : count + 1));
      return !prev;
    });
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      // Prevent standard single click behavior (play/pause) when double tapping
      if (!isLiked) {
        handleLike();
      }
      setShowHeartAnimation(true);
      if (heartTimeoutRef.current) clearTimeout(heartTimeoutRef.current);
      heartTimeoutRef.current = setTimeout(() => {
        setShowHeartAnimation(false);
      }, 800);
    },
    [isLiked, handleLike]
  );

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative h-screen w-full shrink-0 snap-start snap-always bg-black"
    >
      {/* 9:16 video container — full width on mobile, centered on desktop */}
      <div 
        className="relative mx-auto h-full w-full max-w-[calc(100vh*9/16)]"
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="h-full w-full cursor-pointer object-cover"
          loop
          playsInline
          preload="metadata"
          onClick={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Play/pause indicator */}
        {!isPlaying && !showHeartAnimation && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <svg
                className="ml-1 h-8 w-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Double-tap Heart Animation */}
        {showHeartAnimation && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50">
            <svg
              className="h-32 w-32 text-red-500 animate-[heart-pop_0.8s_ease-out_forwards] drop-shadow-2xl"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )}

        {/* Volume Toggle Button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
          className="absolute top-6 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          {globalMuted ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* Bottom overlay: author + description */}
        <div className="absolute bottom-0 left-0 right-16 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 pb-8 z-30">
          <p className="mb-1 text-sm font-bold text-white drop-shadow-md">{video.authorName}</p>
          <p className="line-clamp-2 text-sm text-white/90 drop-shadow-md">{video.description}</p>
        </div>

        {/* Right-side action buttons */}
        <div className="absolute bottom-24 right-3 z-40 flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={handleLike}
            className="flex flex-col items-center gap-1"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors ${
                isLiked ? "text-red-500" : "text-white"
              }`}
            >
              <svg
                className="h-7 w-7"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">
              {formatCount(likesCount)}
            </span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1"
            aria-label="Comment"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">1.2K</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1"
            aria-label="Share"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">Share</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-50">
          <div 
            className="h-full bg-white transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
