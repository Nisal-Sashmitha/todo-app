export type TaskCategory = 'Work' | 'Personal' | 'Urgent';

export const CATEGORY_OPTIONS: TaskCategory[] = ['Work', 'Personal', 'Urgent'];

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Work: 'bg-work/70 border-work',
  Personal: 'bg-personal/70 border-personal',
  Urgent: 'bg-urgent/70 border-urgent'
};

export const CATEGORY_TEXT_COLORS: Record<TaskCategory, string> = {
  Work: 'text-work',
  Personal: 'text-personal',
  Urgent: 'text-urgent'
};
