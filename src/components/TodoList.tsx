import { useMemo, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { CATEGORY_OPTIONS, CATEGORY_TEXT_COLORS, TaskCategory } from '@/constants/categories';
import { isTaskScheduled, useTimeboxStore } from '@/store/useTimeboxStore';

const TaskListItem = ({
  id,
  title,
  category,
  estimatedDurationMinutes,
  onUpdate,
  onDelete
}: {
  id: string;
  title: string;
  category: TaskCategory;
  estimatedDurationMinutes?: number;
  onUpdate: (updates: { title: string; category: TaskCategory; estimatedDurationMinutes?: number }) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftCategory, setDraftCategory] = useState<TaskCategory>(category);
  const [draftDuration, setDraftDuration] = useState(estimatedDurationMinutes?.toString() ?? '');

  const save = () => {
    onUpdate({
      title: draftTitle.trim() || title,
      category: draftCategory,
      estimatedDurationMinutes: draftDuration ? Number(draftDuration) : undefined
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm flex flex-col gap-2">
      {isEditing ? (
        <input
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-100"
        />
      ) : (
        <p className="font-semibold text-slate-100">{title}</p>
      )}
      <div className="flex items-center justify-between text-xs text-slate-300">
        {isEditing ? (
          <select
            value={draftCategory}
            onChange={(event) => setDraftCategory(event.target.value as TaskCategory)}
            className="bg-slate-900 border border-slate-600 rounded px-2 py-1"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <span className={`${CATEGORY_TEXT_COLORS[category]} font-semibold`}>{category}</span>
        )}
        {isEditing ? (
          <input
            type="number"
            min={15}
            step={15}
            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-20"
            value={draftDuration}
            onChange={(event) => setDraftDuration(event.target.value)}
            placeholder="mins"
          />
        ) : (
          <span>{estimatedDurationMinutes ? `${estimatedDurationMinutes}m` : 'flexible'}</span>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button onClick={save} className="px-3 py-1 bg-emerald-600 rounded text-xs font-semibold">
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setDraftTitle(title);
                setDraftCategory(category);
                setDraftDuration(estimatedDurationMinutes?.toString() ?? '');
              }}
              className="px-3 py-1 border border-slate-600 rounded text-xs"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="px-3 py-1 border border-slate-600 rounded text-xs">
              Edit
            </button>
            <button onClick={onDelete} className="px-3 py-1 border border-rose-500 text-rose-400 rounded text-xs">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const TodoList = () => {
  const { tasks, schedules, addTask, updateTask, deleteTask } = useTimeboxStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [estimated, setEstimated] = useState('');

  const unscheduledTasks = useMemo(
    () => tasks.filter((task) => !isTaskScheduled(task.id, schedules)),
    [tasks, schedules]
  );

  const add = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), category, estimatedDurationMinutes: estimated ? Number(estimated) : undefined });
    setTitle('');
    setEstimated('');
  };

  return (
    <div className="w-full md:w-80 bg-slate-900 rounded-xl p-4 shadow-lg border border-slate-800 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">To-do</h2>
        <p className="text-sm text-slate-400">Drag tasks into the day timeline.</p>
      </div>
      <div className="space-y-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as TaskCategory)}
            className="flex-1 rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            value={estimated}
            onChange={(event) => setEstimated(event.target.value)}
            placeholder="mins"
            type="number"
            min={15}
            step={15}
            className="w-24 rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm"
          />
        </div>
        <button onClick={add} className="w-full bg-work hover:bg-blue-500 rounded py-2 text-sm font-semibold">
          Add task
        </button>
      </div>
      <Droppable droppableId="todo-list" type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 overflow-y-auto pr-1 ${snapshot.isDraggingOver ? 'bg-slate-800/50 rounded-lg p-2' : ''}`}
          >
            {unscheduledTasks.length === 0 ? (
              <p className="text-sm text-slate-400">All tasks are scheduled. Great job!</p>
            ) : (
              unscheduledTasks.map((task, index) => (
                <Draggable draggableId={task.id} index={index} key={task.id}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      <TaskListItem
                        id={task.id}
                        title={task.title}
                        category={task.category}
                        estimatedDurationMinutes={task.estimatedDurationMinutes}
                        onUpdate={(updates) => updateTask(task.id, updates)}
                        onDelete={() => deleteTask(task.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;
