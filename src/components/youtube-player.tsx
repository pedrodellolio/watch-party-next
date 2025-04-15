"use client";

import dynamic from "next/dynamic";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
// import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface Props {
  url: string;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  playbackTime: number;
  fallbackMessage?: string;
  handleRequest: (action: string, message: string) => void;
}

const VideoPlayer = ({
  url,
  playing,
  setPlaying,
  fallbackMessage,
  handleRequest,
  playbackTime,
}: Props) => {
  // const playerRef = useRef<ReactPlayer>(null);
  // const onReady = () => {
  //   console.log(playbackTime);
  //   playerRef.current?.seekTo(playbackTime, "seconds");
  //   if (playbackTime > 0) {
  //     console.log("already playing a video. Starting...");
  //     setPlaying(true);
  //   }
  // };

  const handlePlay = () => {
    if (!playing) handleRequest("command", "/play");
  };

  const handlePause = () => {
    if (playing) handleRequest("command", "/pause");
  };

  const handleEnded = () => {
    handleRequest("command", "/skip");
  };

  const handleProgress = (state: OnProgressProps) => {
    handleRequest("feedback", state.playedSeconds.toString());
  };
  console.log(url);
  return (
    <div className="video-player border rounded-md p-6 w-full flex justify-center items-center">
      {url !== "" ? (
        <ReactPlayer
          // ref={playerRef}
          url={url}
          width={"100%"}
          height={"600px"}
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          playing={playing}
          onEnded={handleEnded}
          // onReady={onReady}
        />
      ) : (
        <p className="text-muted-foreground text-sm">
          Add a video to the queue using the command{" "}
          <span className="bg-[#15151a] rounded-md p-2 text-xs">
            /queue VIDEO_URL
          </span>
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
