import React from 'react';
import { Checkbox } from './ui/checkbox';

interface TaskItemProps {
  task: {
    id: string;
    content: string;
    is_completed?: boolean;
  };
  onToggle?: (id: string, completed: boolean) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <div className="flex items-center gap-3 py-2 border-b group">
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={(checked) => onToggle?.(task.id, checked === true)}
      />
      <span className={`text-sm ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
        {task.content}
      </span>
    </div>
  );
};
