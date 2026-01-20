'use client';

import { useState, useEffect, useRef } from 'react';
import { SwitchSimulator, SwitchMode, ActionableElement } from '@/lib/screen-reader/SwitchSimulator';

interface SwitchPanelProps {
  simulator: SwitchSimulator | null;
  isEnabled: boolean;
}

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'action';
  timestamp: number;
}

export default function SwitchPanel({ simulator, isEnabled }: SwitchPanelProps) {
  const [mode, setMode] = useState<SwitchMode>('single');
  const [scanSpeed, setScanSpeed] = useState(1000);
  const [autoRestart, setAutoRestart] = useState(true);
  const [currentElement, setCurrentElement] = useState<ActionableElement | null>(null);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'paused'>('idle');
  const [log, setLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  // Poll for current element and scan state
  useEffect(() => {
    if (!simulator || !isEnabled) return;

    const interval = setInterval(() => {
      const state = simulator.getState();
      setScanState(state.scanState);

      const current = simulator.getCurrentElement();
      setCurrentElement(current);
    }, 100);

    return () => clearInterval(interval);
  }, [simulator, isEnabled]);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  // Add log entry
  const addLog = (message: string, type: 'info' | 'action') => {
    setLog(prev => [...prev, {
      id: `log-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now()
    }]);
  };

  // Handle mode change
  const handleModeChange = (newMode: SwitchMode) => {
    setMode(newMode);
    if (simulator) {
      simulator.updateSettings({ mode: newMode });
      addLog(`Switched to ${newMode === 'single' ? 'single' : 'dual'} switch mode`, 'info');
    }
  };

  // Handle scan speed change
  const handleScanSpeedChange = (newSpeed: number) => {
    setScanSpeed(newSpeed);
    if (simulator) {
      simulator.updateSettings({ scanSpeed: newSpeed });
      addLog(`Scan speed: ${newSpeed}ms`, 'info');
    }
  };

  // Handle auto-restart toggle
  const handleAutoRestartToggle = () => {
    const newValue = !autoRestart;
    setAutoRestart(newValue);
    if (simulator) {
      simulator.updateSettings({ autoRestart: newValue });
      addLog(`Auto-restart: ${newValue ? 'on' : 'off'}`, 'info');
    }
  };

  // Start/stop scanning
  const handleStartStop = () => {
    if (!simulator) return;

    if (scanState === 'scanning') {
      simulator.stopScan();
      setScanState('idle');
      addLog('Scan stopped', 'info');
    } else {
      simulator.startScan();
      setScanState('scanning');
      addLog('Scan started', 'info');
    }
  };

  if (!isEnabled) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center text-gray-500">
        Enable switch simulator to see controls
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Mode Selector */}
      <div className="p-4 border-b border-gray-300">
        <h3 className="text-sm font-semibold mb-2">Switch Mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange('single')}
            className={`px-3 py-1 rounded ${mode === 'single' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Single Switch
          </button>
          <button
            onClick={() => handleModeChange('dual')}
            className={`px-3 py-1 rounded ${mode === 'dual' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Dual Switch
          </button>
        </div>
      </div>

      {/* Current Element */}
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h3 className="text-sm font-semibold mb-2">Current Element</h3>
        {currentElement ? (
          <div className="text-sm space-y-1">
            <div><span className="font-medium">Name:</span> {currentElement.name}</div>
            <div><span className="font-medium">Role:</span> {currentElement.role}</div>
            <div><span className="font-medium">Action:</span> {currentElement.actionDescription}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No element selected</div>
        )}
      </div>

      {/* Switch Log */}
      <div className="flex-1 overflow-y-auto p-4 border-b border-gray-300" ref={logRef}>
        <h3 className="text-sm font-semibold mb-2">Switch Log</h3>
        <div className="space-y-1">
          {log.length === 0 ? (
            <div className="text-sm text-gray-500">No activity yet</div>
          ) : (
            log.map(entry => (
              <div
                key={entry.id}
                className={`text-sm font-mono ${
                  entry.type === 'action' ? 'text-green-700 font-semibold' : 'text-gray-700'
                }`}
              >
                &gt; {entry.message}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Keyboard Controls Info */}
      <div className="p-4 border-b border-gray-300 bg-blue-50">
        <h3 className="text-sm font-semibold mb-2">Keyboard Controls</h3>
        {mode === 'single' ? (
          <div className="text-sm">
            <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Space</kbd> - Select highlighted element</div>
            <div className="text-xs text-gray-600 mt-1">Elements auto-scan at set speed</div>
          </div>
        ) : (
          <div className="text-sm space-y-1">
            <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">→</kbd> - Step to next element</div>
            <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Space</kbd> - Activate current element</div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Settings</h3>

        {/* Scan Speed (only for single switch) */}
        {mode === 'single' && (
          <div>
            <label className="text-sm block mb-1">
              Scan Speed: {scanSpeed}ms
            </label>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={scanSpeed}
              onChange={(e) => handleScanSpeedChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Auto-restart */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="auto-restart"
            checked={autoRestart}
            onChange={handleAutoRestartToggle}
          />
          <label htmlFor="auto-restart" className="text-sm">
            Auto-restart scan at end
          </label>
        </div>

        {/* Start/Stop Button */}
        <button
          onClick={handleStartStop}
          className={`w-full py-2 px-4 rounded font-medium ${
            scanState === 'scanning'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {scanState === 'scanning' ? '⏹ Stop Scan' : '▶ Start Scan'}
        </button>
      </div>
    </div>
  );
}
