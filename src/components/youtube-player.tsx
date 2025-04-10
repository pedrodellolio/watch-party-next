"use client";

import React, { RefObject } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactPlayer to prevent SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface Props {
  socketRef: RefObject<WebSocket | null>;
  url: string;
  playing: boolean;
  handleRequest: (action: string, message: string) => void;
}

const VideoPlayer = ({ url, playing, handleRequest }: Props) => {
  const handlePlay = () => {
    handleRequest("command", "/play");
  };

  const handlePause = () => {
    handleRequest("command", "/pause");
  };

  // const handleEnded = () => {
  //   sendMessage("message");
  // };

  // const handleProgress = (state: OnProgressProps) => {
  //   console.log(state);
  //   // Optionally, send progress updates through WebSocket if needed
  //   // socketRef.current?.send(
  //   //   JSON.stringify({
  //   //     action: "progress",
  //   //     roomCode: data.code,
  //   //     username: "Pedro",
  //   //     progress: state.playedSeconds,
  //   //   })
  //   // );
  // };

  return (
    <div className="video-player border rounded-md p-6">
      <ReactPlayer
        url={url}
        width={"100%"}
        height={440}
        onPlay={handlePlay}
        onPause={handlePause}
        // onEnded={handleEnded}
        playing={playing}
      />
    </div>
  );
};

export default VideoPlayer;
