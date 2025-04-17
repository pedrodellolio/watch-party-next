"use client";

import dynamic from "next/dynamic";
import React from "react";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

type Props = {
  videoUrl: string;
  isPlaying: boolean;
  send: (action: string, message: string) => void;
};

export default function VideoPlayer({ videoUrl, isPlaying, send }: Props) {
  const handlePlay = () => {
    if (!isPlaying) send("command", "/play");
  };

  const handlePause = () => {
    if (isPlaying) send("command", "/pause");
  };

  return (
    <div className="border w-full min-h-[600px]">
      {videoUrl === "" ? (
        <p className="text-center mt-64 xl:mt-80 text-muted-foreground text-sm">
          There are no videos in the queue. You can add one using the{" "}
          <span className="bg-gray-800 p-1 px-2 rounded-md">/queue VIDEO_URL</span> command.
        </p>
      ) : (
        <ReactPlayer
          key={videoUrl}
          url={videoUrl.split("?forceUpdate")[0]}
          width={"100%"}
          height={"600px"}
          onPlay={handlePlay}
          onPause={handlePause}
          playing={isPlaying}
          fallback={<p className="text-white">Loading...</p>}
        />
      )}
    </div>
  );
}
