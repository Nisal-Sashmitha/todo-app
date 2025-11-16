import { addMinutes, format } from 'date-fns';
import { DAY_END_HOUR, DAY_START_HOUR, SLOT_MINUTES } from '@/constants/time';

export const formatDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export const humanizeDate = (date: Date): string => format(date, 'PPP');

export const minutesBetween = (start: string, end: string): number => {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hour, minute] = time.split(':').map(Number);
  const base = new Date();
  base.setHours(hour, minute, 0, 0);
  const result = addMinutes(base, minutes);
  return format(result, 'HH:mm');
};

export const clampToDay = (time: string): string => {
  const [hour, minute] = time.split(':').map(Number);
  const clampedHour = Math.min(Math.max(hour, DAY_START_HOUR), DAY_END_HOUR - 1);
  const normalizedMinute = hour < DAY_START_HOUR ? 0 : minute;
  return `${String(clampedHour).padStart(2, '0')}:${String(normalizedMinute).padStart(2, '0')}`;
};

export const ensureEndWithinDay = (start: string, end: string): string => {
  const [endHour, endMinute] = end.split(':').map(Number);
  if (endHour >= DAY_END_HOUR) {
    return `${String(DAY_END_HOUR).padStart(2, '0')}:00`;
  }
  return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
};

export const timeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour += 1) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (SLOT_MINUTES === 30) {
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }
  return slots;
};

export const slotIndexToTime = (index: number): string => {
  const totalMinutes = index * SLOT_MINUTES + DAY_START_HOUR * 60;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const timeToSlotIndex = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute;
  return Math.max(0, Math.round((totalMinutes - DAY_START_HOUR * 60) / SLOT_MINUTES));
};

export const totalSlots = (): number => ((DAY_END_HOUR - DAY_START_HOUR) * 60) / SLOT_MINUTES;
