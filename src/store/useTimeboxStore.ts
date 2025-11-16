import { addDays } from 'date-fns';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TaskCategory } from '@/constants/categories';
import { TimeboxState, Task, Block, BlockStatus } from './types';
import { addMinutesToTime, formatDateKey } from '@/utils/time';

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const emptyState: TimeboxState = {
  tasks: [],
  schedules: {},
  selectedDate: formatDateKey(new Date())
};

const defaultDuration = 60;

interface Actions {
  addTask: (input: { title: string; estimatedDurationMinutes?: number; category: TaskCategory }) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  addBlockForTask: (date: string, taskId: string, start: string, durationMinutes: number) => void;
  moveBlockToSlot: (date: string, blockId: string, newStart: string) => void;
  changeBlockDuration: (date: string, blockId: string, minutes: number) => void;
  setBlockStatus: (date: string, blockId: string, status: BlockStatus) => void;
  removeBlock: (date: string, blockId: string) => void;
  carryForward: (date: string) => void;
  setSelectedDate: (date: string) => void;
}

const ensureSchedule = (state: TimeboxState, date: string) => {
  if (!state.schedules[date]) {
    state.schedules[date] = { date, blocks: [] };
  }
};

const cloneSchedules = (schedules: TimeboxState['schedules']) =>
  typeof structuredClone === 'function'
    ? structuredClone(schedules)
    : JSON.parse(JSON.stringify(schedules));

export const useTimeboxStore = create<TimeboxState & Actions>()(
  persist(
    (set, get) => ({
      ...emptyState,
      addTask: ({ title, estimatedDurationMinutes, category }) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: createId(),
              title,
              estimatedDurationMinutes,
              category,
              createdAt: new Date().toISOString()
            }
          ]
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
        })),
      deleteTask: (id) =>
        set((state) => {
          const schedules = { ...state.schedules };
          Object.values(schedules).forEach((day) => {
            day.blocks = day.blocks.filter((block) => block.taskId !== id);
          });
          return { tasks: state.tasks.filter((task) => task.id !== id), schedules };
        }),
      addBlockForTask: (date, taskId, start, durationMinutes) =>
        set((state) => {
          const schedules = cloneSchedules(state.schedules);
          ensureSchedule({ ...state, schedules }, date);
          const day = schedules[date];
          const end = addMinutesToTime(start, durationMinutes || defaultDuration);
          const block: Block = {
            id: createId(),
            taskId,
            start,
            end,
            status: 'pending'
          };
          day.blocks = [...day.blocks, block];
          return { schedules };
        }),
      moveBlockToSlot: (date, blockId, newStart) =>
        set((state) => {
          const schedules = cloneSchedules(state.schedules);
          const day = schedules[date];
          if (!day) return {};
          day.blocks = day.blocks.map((block) => {
            if (block.id !== blockId) return block;
            const duration = blockDurationMinutes(block);
            const newEnd = addMinutesToTime(newStart, duration);
            return { ...block, start: newStart, end: newEnd };
          });
          return { schedules };
        }),
      changeBlockDuration: (date, blockId, minutes) =>
        set((state) => {
          const schedules = cloneSchedules(state.schedules);
          const day = schedules[date];
          if (!day) return {};
          day.blocks = day.blocks.map((block) => {
            if (block.id !== blockId) return block;
            const duration = Math.max(15, blockDurationMinutes(block) + minutes);
            const newEnd = addMinutesToTime(block.start, duration);
            return { ...block, end: newEnd };
          });
          return { schedules };
        }),
      setBlockStatus: (date, blockId, status) =>
        set((state) => {
          const schedules = cloneSchedules(state.schedules);
          const day = schedules[date];
          if (!day) return {};
          day.blocks = day.blocks.map((block) => (block.id === blockId ? { ...block, status } : block));
          return { schedules };
        }),
      removeBlock: (date, blockId) =>
        set((state) => {
          const schedules = cloneSchedules(state.schedules);
          const day = schedules[date];
          if (!day) return {};
          day.blocks = day.blocks.filter((block) => block.id !== blockId);
          return { schedules };
        }),
      carryForward: (date) =>
        set((state) => {
          const schedules = cloneSchedules(state.schedules);
          const day = schedules[date];
          if (!day) return {};
          const nextDate = formatDateKey(addDays(new Date(date), 1));
          ensureSchedule({ ...state, schedules }, nextDate);
          const nextDay = schedules[nextDate];
          const pendingBlocks = day.blocks.filter((block) => block.status === 'pending');
          pendingBlocks.forEach((block) => {
            nextDay.blocks.push({
              ...block,
              id: createId(),
              status: 'pending',
              carriedFromDate: date
            });
          });
          day.blocks = day.blocks.map((block) =>
            block.status === 'pending' ? { ...block, status: 'carriedForward' } : block
          );
          return { schedules };
        }),
      setSelectedDate: (date) => set(() => ({ selectedDate: date }))
    }),
    {
      name: 'timeboxer-state',
      version: 1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const blockDurationMinutes = (block: Block): number => {
  const [startHour, startMinute] = block.start.split(':').map(Number);
  const [endHour, endMinute] = block.end.split(':').map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
};

export const isTaskScheduled = (taskId: string, schedules: TimeboxState['schedules']): boolean =>
  Object.values(schedules).some((day) => day.blocks.some((block) => block.taskId === taskId));
