import { useMemo } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { addDays, format } from 'date-fns';
import TodoList from './components/TodoList';
import DayTimeline from './components/DayTimeline';
import AnalyticsPanel from './components/AnalyticsPanel';
import { useTimeboxStore } from './store/useTimeboxStore';
import { slotIndexToTime, totalSlots, formatDateKey } from './utils/time';

const App = () => {
  const {
    selectedDate,
    setSelectedDate,
    schedules,
    tasks,
    addBlockForTask,
    moveBlockToSlot,
    carryForward
  } = useTimeboxStore();

  const daySchedule = schedules[selectedDate] ?? { date: selectedDate, blocks: [] };
  const slots = useMemo(() => Array.from({ length: totalSlots() }, (_, index) => slotIndexToTime(index)), []);

  const navigate = (offset: number) => {
    const target = addDays(new Date(selectedDate), offset);
    setSelectedDate(formatDateKey(target));
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (source.droppableId === 'todo-list' && destination.droppableId.startsWith('slot-')) {
      const slotIndex = Number(destination.droppableId.replace('slot-', ''));
      const start = slotIndexToTime(slotIndex);
      const task = tasks.find((item) => item.id === draggableId);
      if (!task) return;
      addBlockForTask(selectedDate, task.id, start, task.estimatedDurationMinutes ?? 60);
      return;
    }

    if (source.droppableId.startsWith('slot-') && destination.droppableId.startsWith('slot-')) {
      const slotIndex = Number(destination.droppableId.replace('slot-', ''));
      const newStart = slotIndexToTime(slotIndex);
      moveBlockToSlot(selectedDate, draggableId, newStart);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold">TimeBoxer</h1>
              <p className="text-sm text-slate-400">Local-first focus companion</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="px-3 py-1 rounded border border-slate-700">
                Previous
              </button>
              <button onClick={() => setSelectedDate(formatDateKey(new Date()))} className="px-3 py-1 rounded border border-slate-700">
                Today
              </button>
              <button onClick={() => navigate(1)} className="px-3 py-1 rounded border border-slate-700">
                Next
              </button>
              <div className="ml-4 text-sm text-slate-300 font-mono">
                {format(new Date(selectedDate), 'PPP')}
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 lg:flex-row">
          <div className="flex flex-col gap-6 lg:flex-row lg:flex-1">
            <TodoList />
            <DayTimeline date={selectedDate} slots={slots} blocks={daySchedule.blocks} />
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-80">
            <button
              onClick={() => carryForward(selectedDate)}
              className="w-full rounded bg-purple-600 py-2 text-sm font-semibold"
            >
              Carry forward unfinished tasks
            </button>
            <AnalyticsPanel blocks={daySchedule.blocks} />
          </div>
        </main>
      </div>
    </DragDropContext>
  );
};

export default App;
