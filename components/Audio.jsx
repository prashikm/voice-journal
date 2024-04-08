"use client";

import { useRef, useState } from "react";
import { CirclePlay, CirclePause } from "lucide-react";

export default function Audio({ audio }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const playAudio = () => {
    setIsPlaying(true);
    audioRef.current.play();
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const onPlaying = () => {
    if (audioRef.current.paused) setIsPlaying(false);
  };

  return (
    <div>
      <audio
        controls
        className="hidden"
        src={audio}
        ref={audioRef}
        onTimeUpdate={onPlaying}
      />

      {isPlaying ? (
        <button onClick={pauseAudio}>
          <CirclePause className="h-6 w-6" />
        </button>
      ) : (
        <button onClick={playAudio}>
          <CirclePlay className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
