import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Task } from '../types/task';

interface TimeTrackerProps {
  task: Task;
  onUpdateDuration: (taskId: string, duration: number) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ task, onUpdateDuration }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(task.actualDuration || 0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000 / 60); // Convert to minutes
        setElapsedTime((task.actualDuration || 0) + elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, task.actualDuration]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const handlePause = () => {
    setIsRunning(false);
    if (startTime) {
      const sessionDuration = Math.floor((Date.now() - startTime) / 1000 / 60);
      const newDuration = (task.actualDuration || 0) + sessionDuration;
      onUpdateDuration(task.id, newDuration);
      setStartTime(null);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    if (startTime) {
      const sessionDuration = Math.floor((Date.now() - startTime) / 1000 / 60);
      const newDuration = (task.actualDuration || 0) + sessionDuration;
      onUpdateDuration(task.id, newDuration);
      setElapsedTime(newDuration);
      setStartTime(null);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
      <Clock className="w-4 h-4 text-gray-500" />
      <span className="text-sm font-mono text-gray-700 dark:text-gray-300 min-w-[60px]">
        {formatTime(elapsedTime)}
      </span>
      
      <div className="flex space-x-1">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
            title="Start timer"
          >
            <Play className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="p-1 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded transition-colors"
            title="Pause timer"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={handleStop}
          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
          title="Stop timer"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TimeTracker;