import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, Calendar, TrendingUp, Target, Zap, Award, BarChart3, PieChart, Activity } from 'lucide-react';
import { Task } from '../types/task';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const [activeChart, setActiveChart] = useState<'completion' | 'priority' | 'category' | 'timeline'>('completion');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const overdueTasks = tasks.filter(task => 
    task.status === 'pending' && 
    task.dueDate && 
    new Date(task.dueDate) < new Date()
  ).length;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Advanced analytics
  const todayTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today;
  });

  const thisWeekTasks = tasks.filter(task => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const taskDate = new Date(task.dueDate);
    return taskDate >= weekStart && taskDate <= new Date();
  });

  const averageCompletionTime = () => {
    const completedWithDuration = tasks.filter(task => 
      task.status === 'completed' && task.actualDuration
    );
    if (completedWithDuration.length === 0) return 0;
    const total = completedWithDuration.reduce((sum, task) => sum + (task.actualDuration || 0), 0);
    return Math.round(total / completedWithDuration.length);
  };

  const productivityScore = () => {
    if (totalTasks === 0) return 0;
    const baseScore = (completedTasks / totalTasks) * 100;
    const overdueDeduction = (overdueTasks / totalTasks) * 20;
    const todayBonus = todayTasks.filter(t => t.status === 'completed').length * 5;
    return Math.max(0, Math.min(100, baseScore - overdueDeduction + todayBonus));
  };

  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high' && task.status === 'pending').length,
    medium: tasks.filter(task => task.priority === 'medium' && task.status === 'pending').length,
    low: tasks.filter(task => task.priority === 'low' && task.status === 'pending').length,
  };

  const categoryStats = tasks.reduce((acc, task) => {
    if (task.category) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const recentlyCompleted = tasks
    .filter(task => task.status === 'completed')
    .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())
    .slice(0, 3);

  const upcomingTasks = tasks
    .filter(task => task.status === 'pending' && task.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Chart components
  const CompletionChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Completion Progress</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">{completionRate.toFixed(1)}%</span>
      </div>
      <div className="relative">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-red-400 to-red-600 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${completionRate}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white">{completedTasks}</div>
          <div className="text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white">{pendingTasks}</div>
          <div className="text-gray-500">Pending</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white">{overdueTasks}</div>
          <div className="text-gray-500">Overdue</div>
        </div>
      </div>
    </div>
  );

  const PriorityChart = () => (
    <div className="space-y-3">
      {Object.entries(priorityStats).map(([priority, count]) => {
        const colors = {
          high: 'bg-red-500',
          medium: 'bg-yellow-500',
          low: 'bg-green-500'
        };
        const maxCount = Math.max(...Object.values(priorityStats));
        const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        return (
          <div key={priority} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="capitalize text-gray-600 dark:text-gray-400">{priority} Priority</span>
              <span className="font-medium text-gray-900 dark:text-white">{count}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`${colors[priority as keyof typeof colors]} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const CategoryChart = () => (
    <div className="space-y-3">
      {Object.entries(categoryStats).slice(0, 5).map(([category, count], index) => {
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'];
        const maxCount = Math.max(...Object.values(categoryStats));
        const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        return (
          <div key={category} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{category || 'Uncategorized'}</span>
              <span className="font-medium text-gray-900 dark:text-white">{count}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalTasks}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {todayTasks.length} due today
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg shadow-sm border border-green-200 dark:border-green-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Productivity Score</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{productivityScore().toFixed(0)}%</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {productivityScore() >= 80 ? 'Excellent!' : productivityScore() >= 60 ? 'Good' : 'Needs improvement'}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg shadow-sm border border-purple-200 dark:border-purple-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg. Completion</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{averageCompletionTime()}m</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Per task
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg shadow-sm border border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">This Week</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{thisWeekTasks.length}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {thisWeekTasks.filter(t => t.status === 'completed').length} completed
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h3>
          <div className="flex space-x-2">
            {[
              { id: 'completion', label: 'Completion', icon: BarChart3 },
              { id: 'priority', label: 'Priority', icon: AlertTriangle },
              { id: 'category', label: 'Category', icon: PieChart },
            ].map((chart) => {
              const Icon = chart.icon;
              return (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    activeChart === chart.id
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{chart.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="h-64">
          {activeChart === 'completion' && <CompletionChart />}
          {activeChart === 'priority' && <PriorityChart />}
          {activeChart === 'category' && <CategoryChart />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-red-500" />
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task) => {
                const isToday = task.dueDate === new Date().toISOString().split('T')[0];
                const isOverdue = new Date(task.dueDate) < new Date();
                
                return (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      isOverdue ? 'bg-red-500' : isToday ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(task.dueDate).toLocaleDateString()}
                        {task.dueTime && ` at ${task.dueTime}`}
                        {task.estimatedDuration && ` • ${task.estimatedDuration}m`}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recently Completed */}
        {recentlyCompleted.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Recently Completed
            </h3>
            <div className="space-y-3">
              {recentlyCompleted.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'recently'}
                      {task.actualDuration && ` • Took ${task.actualDuration}m`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;