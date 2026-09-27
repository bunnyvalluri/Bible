'use client';

import React from 'react';
import { useAudio } from '../audio/AudioContext';
import { Play, Pause, FastForward, Volume2, X, Headphones } from 'lucide-react';
import { Button } from '../ui/button';

export function AudioFloatingBar() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seekTo,
    playbackSpeed,
    changeSpeed
  } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const nextSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const idx = speeds.indexOf(playbackSpeed);
    const nextIdx = (idx + 1) % speeds.length;
    changeSpeed(speeds[nextIdx]);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-primary-950/95 dark:bg-card/95 border border-gold-500/30 text-white rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Title & Reference */}
        <div className="flex items-center space-x-3 min-w-0 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gold-400 text-primary-950 flex items-center justify-center flex-shrink-0 font-bold shadow-md">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold truncate text-white">
              {currentTrack.title || 'Audio Bible'}
            </h4>
            <p className="text-xs text-gold-300 truncate">
              {currentTrack.reference || 'Holy Scripture'}
            </p>
          </div>
        </div>

        {/* Playback Controls & Progress */}
        <div className="flex flex-col items-center w-full sm:max-w-md space-y-1">
          <div className="flex items-center space-x-4">
            <Button
              variant="gold"
              size="icon"
              className="w-10 h-10 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            <button
              onClick={nextSpeed}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-gold-300 border border-white/10 transition-colors"
              title="Playback speed"
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* Timeline Bar */}
          <div className="w-full flex items-center space-x-2 text-[11px] text-muted-foreground font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime || 0}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold-400"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
