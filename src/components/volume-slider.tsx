"use client";

import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import React, { Dispatch } from "react";
import { Slider } from "./ui/slider";

type Props = {
  value: number[];
  onChange: Dispatch<React.SetStateAction<number[]>>;
};

export default function VolumeSlider({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div onClick={() => onChange([0])} className="cursor-pointer">
        {value[0] === 0 ? (
          <VolumeX />
        ) : value[0] <= 25 ? (
          <Volume />
        ) : value[0] <= 75 ? (
          <Volume1 />
        ) : (
          <Volume2 />
        )}
      </div>

      <Slider
        value={value}
        onValueChange={onChange}
        max={100}
        step={1}
        className="w-40"
      />
    </div>
  );
}
