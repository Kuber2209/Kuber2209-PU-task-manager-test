'use client';

import type { Task, User } from '@/lib/types';
import { TaskItem } from './task-item';

interface TaskListProps {
  tasks: Task[];
  currentUser: User;
  users: User[];
  onTaskUpdate?: (updatedTask: Task) => void;
}

export function TaskList({ tasks, currentUser, users, onTaskUpdate }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-64 bg-card">
        <h3 className="text-2xl font-bold tracking-tight font-headline">No tasks here!</h3>
        <p className="text-sm text-muted-foreground">There are currently no tasks in this view.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} currentUser={currentUser} users={users} onTaskUpdate={onTaskUpdate} />
      ))}
    </div>
  );
}
