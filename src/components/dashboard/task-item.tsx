'use client';

import { Check, User as UserIcon, Calendar, Tag, Users, ArrowRight } from 'lucide-react';
import type { Task, User } from '@/lib/types';
import { tasks as allTasks } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface TaskItemProps {
  task: Task;
  currentUser: User;
  users: User[];
  onTaskUpdate?: (updatedTask: Task) => void;
}

const statusStyles: { [key: string]: string } = {
  'Open': 'bg-primary/10 text-primary border-primary/20',
  'In Progress': 'bg-accent/10 text-accent border-accent/20',
  'Completed': 'bg-green-500/10 text-green-600 border-green-500/20',
};

export function TaskItem({ task, currentUser, users, onTaskUpdate }: TaskItemProps) {
  const createdBy = users.find(u => u.id === task.createdBy);
  const assignedAssociates = users.filter(u => task.assignedTo.includes(u.id));

  const handleAcceptTask = () => {
    const newAssignedTo = [...task.assignedTo, currentUser.id];
    const newStatus = newAssignedTo.length === task.requiredAssociates ? 'In Progress' : task.status;
    const updatedTask = { ...task, status: newStatus, assignedTo: newAssignedTo };
    
    const taskIndex = allTasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) allTasks[taskIndex] = updatedTask;
    onTaskUpdate?.(updatedTask);
  };

  const handleCompleteTask = () => {
    const updatedTask = { ...task, status: 'Completed' as const, completedAt: new Date().toISOString() };
    const taskIndex = allTasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) allTasks[taskIndex] = updatedTask;
    onTaskUpdate?.(updatedTask);
  };

  const isUserAssigned = task.assignedTo.includes(currentUser.id);
  const canAccept = currentUser.role === 'Associate' && task.status === 'Open' && !isUserAssigned;
  const canComplete = currentUser.role === 'Associate' && task.status === 'In Progress' && isUserAssigned;
  const isJPTCreator = currentUser.role === 'JPT' && task.createdBy === currentUser.id;
  const canViewDetails = isUserAssigned || isJPTCreator;

  return (
    <Card className="flex flex-col h-full transition-shadow duration-300 hover:shadow-xl animate-in fade-in-50">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="font-headline text-lg mb-2">{task.title}</CardTitle>
            <Badge variant="outline" className={`whitespace-nowrap ${statusStyles[task.status]}`}>{task.status}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="w-4 h-4 mr-2" />
          <div className="flex flex-wrap gap-1">
            {task.tags.map(tag => <Badge variant="secondary" key={tag}>{tag}</Badge>)}
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
        </div>
        {createdBy && (
          <div className="flex items-center text-sm text-muted-foreground">
            <UserIcon className="w-4 h-4 mr-2" />
            Posted by {createdBy.name}
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          {task.assignedTo.length} / {task.requiredAssociates} associates assigned
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {assignedAssociates.length > 0 && (
            <div className="w-full">
                <p className="text-sm font-medium mb-2">Assigned to:</p>
                <div className="flex flex-wrap gap-2">
                    {assignedAssociates.map(associate => (
                         <TooltipProvider key={associate.id}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={associate.avatar} alt={associate.name} />
                                        <AvatarFallback>{associate.name.slice(0,2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{associate.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>
        )}
        <div className="w-full pt-4 border-t flex flex-col gap-2">
            {canAccept && <Button onClick={handleAcceptTask} className="w-full bg-accent hover:bg-accent/90">Accept Task</Button>}
            {canComplete && <Button onClick={handleCompleteTask} className="w-full"><Check className="mr-2 h-4 w-4" />Mark as Complete</Button>}
            {canViewDetails && (
              <Button asChild variant="outline" className="w-full">
                <Link href={`/task/${task.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
              </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
