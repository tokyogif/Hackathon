import React from 'react';
import { BarChart3, CheckSquare, Lightbulb } from 'lucide-react';

interface NavigationProps {
  activeTab: 'tasks' | 'dashboard' | 'productivity';
  onTabChange: (tab: 'tasks' | 'dashboard' | 'productivity') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'productivity', label: 'Productivity', icon: Lightbulb },
  ] as const;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;