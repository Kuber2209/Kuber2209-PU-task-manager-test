'use client';

import { useState, useMemo } from 'react';
import type { User, Task } from '@/lib/types';
import { tasks as allTasks, users } from '@/lib/data';
import { TaskList } from './task-list';

interface AssociateDashboardProps {
  view: 'available' | 'my-tasks';
  currentUser: User;
}

export function AssociateDashboard({ view, currentUser }: AssociateDashboardProps) {
  // This state management is temporary for the mock data setup.
  // In a real app, you'd use revalidatePath or similar to refresh data.
  const [tasks, setTasks] = useState(allTasks);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  
  const tasksToDisplay = useMemo(() => {
    if (view === 'available') {
      return tasks.filter(task => task.status === 'Open' && task.assignedTo.length < task.requiredAssociates);
    } else { // my-tasks
      return tasks.filter(task => task.assignedTo.includes(currentUser.id));
    }
  }, [tasks, view, currentUser.id]);

  const title = view === 'available' ? 'Available Tasks' : 'My Tasks';
  
  return (
    <div>
      <h2 className="text-2xl font-bold font-headline tracking-tight mb-4">{title}</h2>
      <TaskList tasks={tasksToDisplay} currentUser={currentUser} users={users} onTaskUpdate={handleTaskUpdate} />
    </div>
  );
}
