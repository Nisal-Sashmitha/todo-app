import { TaskCategory } from '@/constants/categories';

export type BlockStatus = 'pending' | 'completed' | 'carriedForward';

export interface Task {
  id: string;
  title: string;
  estimatedDurationMinutes?: number;
  category: TaskCategory;
  createdAt: string;
  archived?: boolean;
}

export interface Block {
  id: string;
  taskId: string;
  start: string;
  end: string;
  status: BlockStatus;
  carriedFromDate?: string;
}

export interface DaySchedule {
  date: string;
  blocks: Block[];
}

export interface TimeboxState {
  tasks: Task[];
  schedules: Record<string, DaySchedule>;
  selectedDate: string;
}
