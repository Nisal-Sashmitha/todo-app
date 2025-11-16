import { Block } from '@/store/types';
import { minutesBetween } from './time';

export interface DayAnalytics {
  totalHours: number;
  completedHours: number;
  completedCount: number;
  pendingCount: number;
  insight: string;
}

export const calculateAnalytics = (blocks: Block[]): DayAnalytics => {
  const totalMinutes = blocks.reduce((sum, block) => sum + minutesBetween(block.start, block.end), 0);
  const completedMinutes = blocks
    .filter((block) => block.status === 'completed')
    .reduce((sum, block) => sum + minutesBetween(block.start, block.end), 0);
  const completedCount = blocks.filter((block) => block.status === 'completed').length;
  const pendingCount = blocks.length - completedCount;
  const completionRatio = blocks.length === 0 ? 0 : completedCount / blocks.length;

  let insight = 'Schedule something to get started!';
  if (blocks.length > 0) {
    if (completionRatio >= 0.8) {
      insight = 'Great job, high productivity today!';
    } else if (completionRatio >= 0.4) {
      insight = "Decent day. There's room for improvement.";
    } else {
      insight = 'Low completion today. Consider lighter scheduling tomorrow.';
    }
  }

  return {
    totalHours: +(totalMinutes / 60).toFixed(2),
    completedHours: +(completedMinutes / 60).toFixed(2),
    completedCount,
    pendingCount,
    insight
  };
};
