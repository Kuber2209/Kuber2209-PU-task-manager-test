'use client';

import { useState, useMemo, useCallback } from 'react';
import type { User, Task } from '@/lib/types';
import { tasks as allTasks, users } from '@/lib/data';
import { CreateTaskForm } from './create-task-form';
import { TaskList } from './task-list';

interface JptDashboardProps {
  currentUser: User;
}

export function JptDashboard({ currentUser }: JptDashboardProps) {
  const [tasks, setTasks] = useState(allTasks);

  const myPostedTasks = useMemo(() => {
    return tasks.filter(task => task.createdBy === currentUser.id);
  }, [tasks, currentUser.id]);

  const handleTaskCreated = useCallback((newTask: Task) => {
    // In a real app, you would likely refetch or revalidate data.
    // Here we're just updating the local state to reflect the change.
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold font-headline tracking-tight">Your Posted Tasks</h2>
        <CreateTaskForm currentUser={currentUser} onTaskCreated={handleTaskCreated} />
      </div>
      <TaskList tasks={myPostedTasks} currentUser={currentUser} users={users}/>
    </div>
  );
}
