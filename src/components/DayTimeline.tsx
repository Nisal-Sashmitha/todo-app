import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Task } from '@/store/types';
import { useTimeboxStore } from '@/store/useTimeboxStore';
import { timeToSlotIndex } from '@/utils/time';
import TaskBlock from './TaskBlock';
import { Block } from '@/store/types';

interface Props {
  date: string;
  slots: string[];
  blocks: Block[];
}

const DayTimeline = ({ date, slots, blocks }: Props) => {
  const { tasks, setBlockStatus, changeBlockDuration, removeBlock } = useTimeboxStore();
  const tasksById = Object.fromEntries(tasks.map((task) => [task.id, task])) as Record<string, Task>;

  return (
    <div className="flex-1 bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Day timeline</h2>
          <p className="text-sm text-slate-400">Drag tasks onto a time slot or reposition blocks.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-1" style={{ gridTemplateRows: `repeat(${slots.length}, minmax(48px, 1fr))` }}>
        {slots.map((slot, index) => {
          const slotBlocks = blocks.filter((block) => timeToSlotIndex(block.start) === index);
          return (
            <Droppable droppableId={`slot-${index}`} key={slot} type="TIMELINE">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`relative border border-slate-800 rounded-lg px-3 py-2 flex flex-col gap-2 bg-slate-950/40 ${
                    snapshot.isDraggingOver ? 'border-blue-500 shadow-inner' : ''
                  }`}
                >
                  <div className="text-xs text-slate-400 font-mono">{slot}</div>
                  <div className="flex flex-col gap-2">
                    {slotBlocks.map((block, blockIndex) => (
                      <Draggable draggableId={block.id} index={blockIndex} key={block.id}>
                        {(dragProvided) => (
                          <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                            <TaskBlock
                              block={block}
                              task={tasksById[block.taskId]}
                              onMarkComplete={() => setBlockStatus(date, block.id, 'completed')}
                              onMarkPending={() => setBlockStatus(date, block.id, 'pending')}
                              onExtend={(minutes) => changeBlockDuration(date, block.id, minutes)}
                              onDelete={() => removeBlock(date, block.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </div>
  );
};

export default DayTimeline;
