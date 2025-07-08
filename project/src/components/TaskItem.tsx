import React, { useState } from 'react';
import { CheckCircle, Circle, Edit3, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Task } from '../types/task';
import TimeTracker from './TimeTracker';
import FocusMode from './FocusMode';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateDuration: (taskId: string, duration: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete, onUpdateDuration }) => {
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const priorityIcons = {
    low: <Circle className="w-4 h-4" />,
    medium: <AlertCircle className="w-4 h-4" />,
    high: <AlertCircle className="w-4 h-4" />,
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className={`mt-1 transition-colors ${task.status === 'completed' ? 'text-green-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {priorityIcons[task.priority]}
                <span className="ml-1 capitalize">{task.priority}</span>
              </span>
              
              {task.category && (
                <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Tag className="w-3 h-3 mr-1" />
                  {task.category}
                </span>
              )}
              
              {task.dueDate && (
                <span className={`inline-flex items-center text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                  {task.dueTime && ` at ${task.dueTime}`}
                </span>
              )}
              
              {task.estimatedDuration && (
                <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="w-3 h-3 mr-1">⏱️</span>
                  {task.estimatedDuration}m
                </span>
              )}
            </div>
            
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {Array.isArray(task.tags) && task.tags.length > 0 && (
            <div className="mt-3">
              <TimeTracker task={task} onUpdateDuration={onUpdateDuration} />
            </div>
          )}
          
          {task.status === 'pending' && task.estimatedDuration && (
            <div className="mt-2">
              <button
                onClick={() => setIsFocusModeOpen(true)}
                className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                🎯 Focus Mode
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <FocusMode
        task={task}
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        onComplete={() => {
          onToggle(task.id);
          setIsFocusModeOpen(false);
        }}
      />
    </div>
  );
};

export default TaskItem;