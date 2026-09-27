'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null); // { title, reference, audioUrl, duration }
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 180);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playTrack = (track) => {
    if (!audioRef.current) return;
    setCurrentTrack(track);
    audioRef.current.src = track.audioUrl;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => console.warn('Audio play request interrupted:', err));
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.warn);
    }
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentTrack,
      playbackSpeed,
      currentTime,
      duration,
      volume,
      playTrack,
      togglePlay,
      seekTo,
      changeSpeed,
      setVolume
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
