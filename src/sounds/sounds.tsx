"use client";

import { useEffect, useRef } from "react";

const useAudio = (url: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(url);
      audioRef.current.preload = "auto";

      const currentAudio = audioRef.current;
      return () => {
        if (currentAudio.paused) {
          currentAudio.pause();
        }
        currentAudio.currentTime = 0;
      };
    }
  }, [url]);

  const play = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.pause();
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return play;
};

export const useSounds = () => {
  const clickButtonSound = useAudio("/clickButton.mp3");
  const clickCommandSound = useAudio("/clickCommand.mp3");
  const runCommandSound = useAudio("/runCommand.mp3");
  const clearStageSound = useAudio("/clearStage.mp3");
  const moveMazeSound = useAudio("/moveMaze.mp3");

  return {
    clickButtonSound,
    clickCommandSound,
    runCommandSound,
    clearStageSound,
    moveMazeSound,
  };
};
