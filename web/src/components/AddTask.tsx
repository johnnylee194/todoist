import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AddTaskProps {
  onAdd: (content: string) => void;
}

export const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="e.g., Buy groceries..."
        className="text-sm"
      />
      <div className="flex justify-end gap-2">
        <Button type="submit" size="sm" disabled={!content.trim()}>
          Add Task
        </Button>
      </div>
    </form>
  );
};
