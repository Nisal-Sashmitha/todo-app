import { CATEGORY_COLORS, CATEGORY_TEXT_COLORS } from '@/constants/categories';
import { Block, Task } from '@/store/types';
import { blockDurationMinutes } from '@/store/useTimeboxStore';

interface Props {
  block: Block;
  task?: Task;
  onMarkComplete: () => void;
  onMarkPending: () => void;
  onExtend: (minutes: number) => void;
  onDelete: () => void;
}

const TaskBlock = ({ block, task, onMarkComplete, onMarkPending, onExtend, onDelete }: Props) => {
  if (!task) {
    return null;
  }

  const colorClasses = CATEGORY_COLORS[task.category];
  const textColor = CATEGORY_TEXT_COLORS[task.category];
  const duration = blockDurationMinutes(block);

  return (
    <div className={`rounded-lg border ${colorClasses} bg-opacity-80 px-3 py-2 text-xs shadow-md`}> 
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-100 text-sm">{task.title}</p>
        <span className={`text-[10px] uppercase tracking-wide ${textColor}`}>{task.category}</span>
      </div>
      <p className="text-slate-200 text-sm font-mono">
        {block.start} – {block.end} ({duration}m)
      </p>
      <p className="text-[11px] text-slate-200 capitalize">Status: {block.status}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        <button onClick={onMarkComplete} className="px-2 py-1 rounded bg-emerald-600 text-white">
          Complete
        </button>
        <button onClick={onMarkPending} className="px-2 py-1 rounded border border-slate-200 text-slate-100">
          Pending
        </button>
        <button onClick={() => onExtend(15)} className="px-2 py-1 rounded border border-slate-200 text-slate-100">
          +15m
        </button>
        <button onClick={() => onExtend(-15)} className="px-2 py-1 rounded border border-slate-200 text-slate-100">
          -15m
        </button>
        <button onClick={onDelete} className="px-2 py-1 rounded border border-rose-500 text-rose-300">
          Remove
        </button>
      </div>
      {block.carriedFromDate && (
        <p className="text-[10px] text-slate-300 mt-1">Carried from {block.carriedFromDate}</p>
      )}
    </div>
  );
};

export default TaskBlock;
