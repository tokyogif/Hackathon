import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ThemeProvider } from './context/ThemeContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task } from './types/task';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Dashboard from './components/Dashboard';
import ProductivitySection from './components/ProductivitySection';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [activeTab, setActiveTab] = useState<'tasks' | 'dashboard' | 'productivity'>('tasks');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    const updatedTask: Task = {
      ...taskData,
      id: editingTask.id,
      createdAt: editingTask.createdAt,
    };
    
    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(undefined);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            completedAt: task.status === 'pending' ? new Date().toISOString() : undefined
          }
        : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleUpdateDuration = (taskId: string, duration: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, actualDuration: duration }
        : task
    ));
  };
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'tasks' && (
            <TaskList
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
              onUpdateDuration={handleUpdateDuration}
            />
          )}
          
          {activeTab === 'dashboard' && <Dashboard tasks={tasks} />}
          
          {activeTab === 'productivity' && <ProductivitySection />}
        </main>

        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={handleCloseTaskForm}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          editingTask={editingTask}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;