'use client';

import { useState, useEffect } from 'react';
import { SessionReplay, ReplayState } from '../../lib/screen-reader/SessionReplay';
import { Session, SessionEvent } from '../../lib/screen-reader/SessionRecorder';

interface ReplayControlsProps {
  replay: SessionReplay;
  session: Session;
}

export default function ReplayControls({ replay, session }: ReplayControlsProps) {
  const [state, setState] = useState<ReplayState>('idle');
  const [progress, setProgress] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Update current time periodically when playing
  useEffect(() => {
    if (state !== 'playing') return;

    const interval = setInterval(() => {
      setCurrentTime(replay.getCurrentTime());
      setProgress(replay.getProgress());
    }, 100);

    return () => clearInterval(interval);
  }, [state, replay]);

  // Listen to replay state changes
  useEffect(() => {
    const handleStateChange = (newState: ReplayState) => {
      setState(newState);
    };

    const handleEventPlayed = (event: SessionEvent, index: number, total: number) => {
      setCurrentEventIndex(index);
      setProgress((index / total) * 100);
    };

    const handleProgress = (prog: number) => {
      setProgress(prog);
    };

    // Subscribe to replay events
    replay['onStateChange'] = handleStateChange;
    replay['onEventPlayed'] = handleEventPlayed;
    replay['onProgress'] = handleProgress;

    return () => {
      replay['onStateChange'] = undefined;
      replay['onEventPlayed'] = undefined;
      replay['onProgress'] = undefined;
    };
  }, [replay]);

  const handlePlayPause = () => {
    if (state === 'playing') {
      replay.pause();
    } else {
      replay.play();
    }
  };

  const handleStop = () => {
    replay.stop();
    setCurrentTime(0);
    setProgress(0);
    setCurrentEventIndex(0);
  };

  const handleStepBackward = () => {
    replay.stepBackward();
  };

  const handleStepForward = () => {
    replay.stepForward();
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    replay.setPlaybackSpeed(speed);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value);
    const eventIndex = Math.floor((percent / 100) * session.events.length);
    replay.seekToEvent(Math.max(0, eventIndex));
  };

  const totalDuration = session.duration || 0;
  const totalEvents = session.events.length;

  return (
    <div className="bg-gray-100 border-t border-gray-300 px-6 py-4">
      <div className="flex flex-col gap-4">
        {/* Session Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-700">
            Session Replay
          </div>
          <div className="text-gray-600">
            {session.events.length} events • {SessionReplay.formatTime(totalDuration)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-600 w-12 text-right">
            {SessionReplay.formatTime(currentTime)}
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress}%, #d1d5db ${progress}%, #d1d5db 100%)`
            }}
          />
          <div className="text-xs text-gray-600 w-12">
            {SessionReplay.formatTime(totalDuration)}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2"
              title={state === 'playing' ? 'Pause' : 'Play'}
              aria-label={state === 'playing' ? 'Pause replay' : 'Play replay'}
            >
              {state === 'playing' ? '⏸' : state === 'finished' ? '↻' : '▶'}
              <span>{state === 'playing' ? 'Pause' : state === 'finished' ? 'Replay' : 'Play'}</span>
            </button>

            {/* Stop */}
            <button
              onClick={handleStop}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Stop and reset"
              aria-label="Stop replay"
              disabled={state === 'idle'}
            >
              ⏹ Stop
            </button>

            {/* Step Backward */}
            <button
              onClick={handleStepBackward}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Previous event"
              aria-label="Previous event"
              disabled={currentEventIndex === 0}
            >
              ⏮
            </button>

            {/* Step Forward */}
            <button
              onClick={handleStepForward}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Next event"
              aria-label="Next event"
              disabled={currentEventIndex >= totalEvents - 1}
            >
              ⏭
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Event Counter */}
            <div className="text-sm text-gray-600">
              Event: <span className="font-mono">{currentEventIndex + 1}</span> / <span className="font-mono">{totalEvents}</span>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-2">
              <label htmlFor="playback-speed" className="text-sm text-gray-600">
                Speed:
              </label>
              <select
                id="playback-speed"
                value={playbackSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2.0}>2x</option>
                <option value={3.0}>3x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current Event Info */}
        {currentEventIndex < session.events.length && (
          <div className="bg-white border border-gray-300 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Current Event
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-purple-700">
                    {session.events[currentEventIndex].type}
                  </span>
                  {session.events[currentEventIndex].data.message && (
                    <span className="ml-2 text-gray-700">
                      "{session.events[currentEventIndex].data.message.content}"
                    </span>
                  )}
                  {session.events[currentEventIndex].data.nodeName && (
                    <span className="ml-2 text-gray-600">
                      → {session.events[currentEventIndex].data.nodeName} ({session.events[currentEventIndex].data.nodeRole})
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {SessionReplay.formatTime(
                  session.events[currentEventIndex].timestamp - session.startTime
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
