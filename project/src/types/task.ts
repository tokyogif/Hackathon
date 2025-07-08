export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  dueDate: string;
  dueTime: string;
  createdAt: string;
  completedAt?: string;
  category: string;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  tags: string[];
}

export interface ProductivityLink {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
}