"use client";

import dynamic from "next/dynamic";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Card } from "./ui/card";
import VideoControls from "./video-controls";
import { OnProgressProps } from "react-player/base";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

type Props = {
  video?: Video;
  isPlaying: boolean;
  send: (action: string, message: string) => void;
  setCurrentProgress: Dispatch<SetStateAction<number>>;
  currentProgress: number;
};

export default function VideoPlayer({
  video,
  isPlaying,
  currentProgress,
  setCurrentProgress,
  send,
}: Props) {
  const [volume, setVolume] = useState([0]);

  const handlePlay = () => {
    if (!isPlaying) send("command", "/play");
  };

  const handlePause = () => {
    if (isPlaying) send("command", "/pause");
  };

  const handleProgress = (state: OnProgressProps) => {
    setCurrentProgress(state.playedSeconds);
  };

  const handleEnded = () => {
    send("command", "/skip");
  };

  return (
    <Card className="w-full min-h-[600px] p-6 flex flex-col justify-between gap-4">
      <div className="flex-grow">
        {video?.url === "" ? (
          <p className="text-center mt-64 xl:mt-80 text-foreground text-sm">
            There are no videos in the queue. You can add one using the{" "}
            <span className="bg-foreground/5 p-1 px-2 rounded-md">
              /queue VIDEO_URL
            </span>{" "}
            command.
          </p>
        ) : (
          <ReactPlayer
            key={video?.url}
            url={video?.url.split("?forceUpdate")[0]}
            width={"100%"}
            height={"540px"}
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleProgress}
            onEnded={handleEnded}
            playing={isPlaying}
            volume={volume[0] / 100}
            fallback={<p className="text-white">Loading...</p>}
          />
        )}
      </div>

      <VideoControls
        progress={currentProgress}
        duration={video?.duration}
        isPlaying={isPlaying}
        volume={volume}
        setVolume={setVolume}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </Card>
  );
}
