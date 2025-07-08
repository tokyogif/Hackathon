import React, { useState, useEffect } from 'react';
import { Focus, X, Play, Pause, RotateCcw } from 'lucide-react';
import { Task } from '../types/task';

interface FocusModeProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ task, isOpen, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(task.estimatedDuration ? task.estimatedDuration * 60 : 1500); // Default 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Auto-switch to break or complete
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(300); // 5-minute break
      } else {
        onComplete();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(task.estimatedDuration ? task.estimatedDuration * 60 : 1500);
    setIsBreak(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-8 text-center">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Focus className="w-6 h-6 mr-2 text-red-500" />
            Focus Mode
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isBreak ? 'Take a Break!' : task.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isBreak ? 'Relax and recharge' : 'Stay focused on your task'}
          </p>
        </div>

        <div className="mb-8">
          <div className={`text-6xl font-mono font-bold mb-4 ${
            isBreak ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                isBreak ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${((task.estimatedDuration ? task.estimatedDuration * 60 : 1500) - timeLeft) / (task.estimatedDuration ? task.estimatedDuration * 60 : 1500) * 100}%` 
              }}
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
            >
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {isBreak && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              Great work! Take this time to stretch, hydrate, or just relax.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusMode;