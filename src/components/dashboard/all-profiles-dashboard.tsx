'use client';

import type { User } from '@/lib/types';
import { tasks as allTasks } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface AllProfilesDashboardProps {
  associates: User[];
}

export function AllProfilesDashboard({ associates }: AllProfilesDashboardProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold font-headline tracking-tight mb-4">Team Task Logs</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {associates.map(associate => (
          <UserProfile key={associate.id} associate={associate} />
        ))}
      </div>
    </div>
  );
}

function UserProfile({ associate }: { associate: User }) {
  const completedTasks = allTasks.filter(task => task.assignedTo.includes(associate.id) && task.status === 'Completed');
  
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={associate.avatar} alt={associate.name} />
          <AvatarFallback>{associate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="font-headline">{associate.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{completedTasks.length} tasks completed</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h4 className="font-semibold">Completed Tasks Log:</h4>
          {completedTasks.length > 0 ? (
            <ul className="space-y-3">
              {completedTasks.slice(0, 5).map(task => ( // Show latest 5
                <li key={task.id} className="text-sm p-3 bg-secondary/50 rounded-md">
                  <p className="font-medium">{task.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.map(tag => <Badge variant="secondary" key={tag}>{tag}</Badge>)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No completed tasks yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
