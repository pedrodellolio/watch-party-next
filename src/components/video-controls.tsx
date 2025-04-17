"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import VolumeSlider from "./volume-slider";

type Props = {
  isPlaying: boolean;
  progress: number;
  duration?: number;
  volume: number[];
  setVolume: Dispatch<SetStateAction<number[]>>;
  onPlay: () => void;
  onPause: () => void;
};

export default function VideoControls({
  isPlaying,
  progress,
  duration,
  volume,
  setVolume,
  onPlay,
  onPause,
}: Props) {
  const handlePlayPause = () => {
    if (!isPlaying) onPlay();
    else onPause();
  };

  const formatToHHMMSS = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Progress
          value={duration ? (progress / duration) * 100 : 0}
          className="mb-1 h-3"
        />
        <div className="flex flex-row justify-between items-center">
          <p>{formatToHHMMSS(progress)}</p>
          <p>{formatToHHMMSS(duration ?? 0)}</p>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <Button onClick={handlePlayPause} type="submit" size="icon">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <VolumeSlider value={volume} onChange={setVolume} />
      </div>
    </div>
  );
}
