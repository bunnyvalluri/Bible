'use client';

import React from 'react';
import { useAudio } from '../audio/AudioContext';
import { Play, Pause, Headphones } from 'lucide-react';
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
    <div className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-3 right-3 sm:left-4 sm:right-4 max-w-4xl mx-auto z-40 animate-in slide-in-from-bottom-5">
      <div className="bg-white border border-[#E5E7EB] text-[#171717] rounded-2xl p-3 sm:p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Track Title & Reference */}
        <div className="flex items-center space-x-3 min-w-0 w-full sm:w-auto">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#163A5F] text-white flex items-center justify-center flex-shrink-0 font-bold shadow-sm">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A227]" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-semibold truncate text-[#171717]">
              {currentTrack.title || 'Audio Bible'}
            </h4>
            <p className="text-[11px] sm:text-xs text-[#525252] truncate">
              {currentTrack.reference || 'Holy Scripture'}
            </p>
          </div>
        </div>

        {/* Playback Controls & Progress */}
        <div className="flex flex-col items-center w-full sm:max-w-md space-y-1.5">
          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              size="icon"
              className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-full bg-[#163A5F] hover:bg-[#0f2742] text-white shadow-sm"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            <button
              onClick={nextSpeed}
              className="min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-bold rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#163A5F] border border-[#E5E7EB] transition-colors flex items-center justify-center"
              title="Playback speed"
              aria-label={`Playback speed ${playbackSpeed}x`}
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* Timeline Bar */}
          <div className="w-full flex items-center space-x-2 text-[11px] text-[#737373] font-mono">
            <span className="w-8 text-right select-none">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime || 0}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              aria-label="Audio seeker"
              className="flex-1 h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#163A5F]"
            />
            <span className="w-8 select-none">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
