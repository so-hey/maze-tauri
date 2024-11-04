"use client";

import { useEffect, useRef } from "react";

export const BGMPlayer = () => {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window != "undefined") {
      bgmRef.current = new Audio("/bgm.mp3");
      bgmRef.current.preload = "auto";

      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.7;
      bgmRef.current.play();

      return () => {
        if (bgmRef.current) {
          bgmRef.current.pause();
          bgmRef.current.currentTime = 0;
        }
      };
    }
  }, []);
};

const useAudio = (url: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(url);
      audioRef.current.preload = "auto";

      const currentAudio = audioRef.current;

      currentAudio.addEventListener("ended", () => {
        currentAudio.pause();
      });

      return () => {
        currentAudio.currentTime = 0;
      };
    }
  }, [url]);

  const play = (ended: () => void = () => {}) => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", ended);
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
