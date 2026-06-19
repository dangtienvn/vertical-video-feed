"use client";

import { useCallback, useRef } from "react";
import { videos } from "@/data/videos";
import VideoCard from "./VideoCard";

export default function VideoFeed() {
  // Registry of all video elements — used to pause others when one starts playing
  const videoRegistry = useRef<Map<string, HTMLVideoElement>>(new Map());

  const registerVideo = useCallback(
    (id: string, el: HTMLVideoElement | null) => {
      if (el) {
        videoRegistry.current.set(id, el);
      } else {
        videoRegistry.current.delete(id);
      }
    },
    []
  );

  const handlePlay = useCallback((activeId: string) => {
    videoRegistry.current.forEach((videoEl, id) => {
      if (id !== activeId) {
        videoEl.pause();
      }
    });
  }, []);

  return (
    <div className="h-screen w-full overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onPlay={handlePlay}
          registerVideo={registerVideo}
        />
      ))}
    </div>
  );
}
