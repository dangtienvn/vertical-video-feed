"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "@/types/video";

interface VideoCardProps {
  video: Video;
  onPlay: (id: string) => void;
  registerVideo: (id: string, el: HTMLVideoElement | null) => void;
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
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [isPlaying, setIsPlaying] = useState(false);

  // Tracks manual pause so Intersection Observer won't auto-resume until scrolled away
  const userPausedRef = useRef(false);

  useEffect(() => {
    registerVideo(video.id, videoRef.current);
    return () => registerVideo(video.id, null);
  }, [video.id, registerVideo]);

  // Intersection Observer: auto play when ≥60% visible, pause when not.
  // Uses threshold 0.6 so the video must fill most of the viewport before playing.
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

  return (
    <div
      ref={cardRef}
      className="relative h-screen w-full shrink-0 snap-start snap-always bg-black"
    >
      {/* 9:16 video container — full width on mobile, centered on desktop */}
      <div className="relative mx-auto h-full w-full max-w-[calc(100vh*9/16)]">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="h-full w-full cursor-pointer object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          onClick={handleVideoClick}
        />

        {/* Play/pause indicator */}
        {!isPlaying && (
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

        {/* Bottom overlay: author + description */}
        <div className="absolute bottom-0 left-0 right-16 bg-gradient-to-t from-black/70 to-transparent p-4 pb-8">
          <p className="mb-1 text-sm font-bold text-white">{video.authorName}</p>
          <p className="line-clamp-2 text-sm text-white/90">{video.description}</p>
        </div>

        {/* Right-side action buttons */}
        <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
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
            <span className="text-xs font-semibold text-white">
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
            <span className="text-xs font-semibold text-white">1.2K</span>
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
            <span className="text-xs font-semibold text-white">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
