import React, { useEffect, useState } from 'react';
import { fetchData, pushData } from '../api/client';
import { TaskItem } from '../components/TaskItem';
import { AddTask } from '../components/AddTask';
import { v4 as uuidv4 } from 'uuid';

export const Inbox: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchData();
      if (data && data.tasks) {
        setTasks(data.tasks.filter((t: any) => !t.is_deleted));
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (content: string) => {
    const now = Date.now();
    const newTask = {
      id: uuidv4(),
      content,
      description: '',
      project_id: null,
      parent_id: null,
      order: tasks.length,
      priority: 1,
      due_date: null,
      is_completed: false,
      is_deleted: 0,
      created_at: now,
      updated_at: now,
    };

    // Optimistic update
    setTasks((prev) => [...prev, newTask]);
    setIsAdding(false);

    try {
      await pushData({ tasks: [newTask] });
    } catch (err) {
      console.error('Failed to save task:', err);
      // Rollback on error could be implemented here
    }
  };

  const handleToggleTask = async (id: string, is_completed: boolean) => {
    const now = Date.now();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    const updatedTask = { ...tasks[taskIndex], is_completed, updated_at: now };

    // Optimistic update
    setTasks(prev => {
        const newTasks = [...prev];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
    });

    try {
        await pushData({ tasks: [updatedTask] });
    } catch (err) {
        console.error('Failed to update task:', err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1 mb-4">
        {loading ? (
          <p className="text-muted-foreground text-sm py-4">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Your inbox is empty</p>
            <p className="text-xs text-muted-foreground mt-1">Add a task below to get started</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
          ))
        )}
      </div>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground group py-2"
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            +
          </span>
          Add task
        </button>
      ) : (
        <AddTask onAdd={handleAddTask} />
      )}
    </div>
  );
};
