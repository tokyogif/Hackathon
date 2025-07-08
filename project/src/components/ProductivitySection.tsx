import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Quote } from 'lucide-react';
import { ProductivityLink } from '../types/task';

const ProductivitySection: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const productivityLinks: ProductivityLink[] = [
    {
      id: '1',
      title: 'Pomodoro Timer',
      url: 'https://pomofocus.io',
      description: 'Time management technique with focused work intervals'
    },
    {
      id: '2',
      title: 'Forest',
      url: 'https://www.forestapp.cc',
      description: 'Stay focused and plant virtual trees'
    },
    {
      id: '3',
      title: 'Toggl Track',
      url: 'https://toggl.com',
      description: 'Time tracking for productivity insights'
    },
    {
      id: '4',
      title: 'Notion',
      url: 'https://notion.so',
      description: 'All-in-one workspace for notes and planning'
    },
    {
      id: '5',
      title: 'RescueTime',
      url: 'https://rescuetime.com',
      description: 'Automatic time tracking and productivity analysis'
    },
    {
      id: '6',
      title: 'Brain.fm',
      url: 'https://brain.fm',
      description: 'Music designed to improve focus and productivity'
    }
  ];

  const motivationalQuotes = [
    {
      id: '1',
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      id: '2',
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      id: '3',
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    },
    {
      id: '4',
      text: "The future depends on what you do today.",
      author: "Mahatma Gandhi"
    },
    {
      id: '5',
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle"
    },
    {
      id: '6',
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    },
    {
      id: '7',
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      id: '8',
      text: "Success is not the key to happiness. Happiness is the key to success.",
      author: "Albert Schweitzer"
    }
  ];

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
  };

  const currentQuote = motivationalQuotes[currentQuoteIndex];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Quote className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Motivation</h3>
            </div>
            <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-sm text-gray-600 dark:text-gray-400">
              — {currentQuote.author}
            </cite>
          </div>
          <button
            onClick={nextQuote}
            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Next quote"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Productivity Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productivityLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {link.description}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 ml-2" />
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Productivity Tips
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Time Blocking</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Schedule specific time blocks for different types of tasks to maintain focus.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Two-Minute Rule</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If a task takes less than two minutes, do it immediately instead of adding it to your list.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Batch Similar Tasks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Group similar tasks together to minimize context switching and increase efficiency.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Take Regular Breaks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use techniques like the Pomodoro Technique to maintain high productivity with regular breaks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivitySection;