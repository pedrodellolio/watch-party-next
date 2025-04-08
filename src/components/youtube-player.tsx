// components/YouTubePlayer.tsx
"use client";

import { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  width?: string;
  height?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  width = "100%",
  height = "390",
}) => {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      new (window as any).YT.Player(playerRef.current, {
        height,
        width,
        videoId,
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
          },
        },
      });
    };
  }, [videoId, width, height]);

  return <div ref={playerRef} />;
};

export default YouTubePlayer;
