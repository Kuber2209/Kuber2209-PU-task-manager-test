
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User as UserIcon, Calendar, Tag, Users, Check, Send } from 'lucide-react';
import type { Task, User, Message } from '@/lib/types';
import { tasks as allTasks, users } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, formatDistanceToNow } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/dashboard/header';
import { Separator } from '@/components/ui/separator';

const statusStyles: { [key: string]: string } = {
  'Open': 'bg-primary/10 text-primary border-primary/20',
  'In Progress': 'bg-accent/10 text-accent border-accent/20',
  'Completed': 'bg-green-500/10 text-green-600 border-green-500/20',
};

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const taskId = params.id as string;

  // For this mock app, we need a way to manage current user across pages.
  // In a real app, this would come from a global context or session.
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [task, setTask] = useState<Task | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const foundTask = allTasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
    } else {
      // Handle not found, maybe redirect
      router.push('/dashboard');
    }
  }, [taskId, router]);

  const handleUserChange = (userId: string) => {
    const newUser = users.find(u => u.id === userId);
    if (newUser) {
      setCurrentUser(newUser);
    }
  };

  if (!task) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p>Loading task...</p>
      </div>
    );
  }

  const createdBy = users.find(u => u.id === task.createdBy);
  const assignedAssociates = users.filter(u => task.assignedTo.includes(u.id));

  const isUserAssigned = task.assignedTo.includes(currentUser.id);
  const isJPTCreator = task.createdBy === currentUser.id;
  const canView = isUserAssigned || isJPTCreator;

  if (!canView) {
      return (
          <div className="flex min-h-screen w-full flex-col">
              <Header users={users} currentUser={currentUser} onUserChange={handleUserChange} />
              <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
                  <h1 className="text-2xl font-bold">Access Denied</h1>
                  <p>You are not authorized to view this task.</p>
                  <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
              </main>
          </div>
      )
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const message: Message = {
      id: `msg_${Math.random().toString(36).substring(2, 9)}`,
      userId: currentUser.id,
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    const updatedTask = { ...task, messages: [...(task.messages || []), message] };
    const taskIndex = allTasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      allTasks[taskIndex] = updatedTask;
      setTask(updatedTask); // Update local state to re-render
      setNewMessage('');
      toast({ title: 'Message sent!' });
    }
  };

  const handleCompleteTask = () => {
    const updatedTask = { ...task, status: 'Completed' as const, completedAt: new Date().toISOString() };
    const taskIndex = allTasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
        allTasks[taskIndex] = updatedTask;
        setTask(updatedTask);
        toast({ title: 'Task Marked as Complete!', description: 'Great job!'});
    }
  };
  
  const canComplete = currentUser.role === 'Associate' && task.status === 'In Progress' && isUserAssigned;


  return (
    <div className="flex min-h-screen w-full flex-col">
       <Header users={users} currentUser={currentUser} onUserChange={handleUserChange} />
       <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="font-headline text-2xl mb-2">{task.title}</CardTitle>
                <Badge variant="outline" className={`whitespace-nowrap ${statusStyles[task.status]}`}>{task.status}</Badge>
              </div>
              <CardDescription className="text-base">{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Tag className="w-4 h-4 mr-2" />
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map(tag => <Badge variant="secondary" key={tag}>{tag}</Badge>)}
                  </div>
                </div>
                 <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </div>
                {createdBy && (
                  <div className="flex items-center text-muted-foreground">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Posted by {createdBy.name}
                  </div>
                )}
                 <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {task.assignedTo.length} / {task.requiredAssociates} associates assigned
                </div>
              </div>
              {task.completedAt && (
                <div className="flex items-center text-sm text-green-600">
                    <Check className="w-4 h-4 mr-2" />
                    Completed on {format(new Date(task.completedAt), 'PPP')}
                </div>
              )}
            </CardContent>
            <CardFooter>
                {assignedAssociates.length > 0 && (
                    <div className="w-full">
                        <p className="text-sm font-medium mb-2">Assigned Team:</p>
                        <div className="flex flex-wrap gap-2">
                            {assignedAssociates.map(associate => (
                                <TooltipProvider key={associate.id}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Avatar className="h-9 w-9">
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
            </CardFooter>
          </Card>

          <Separator className="my-8" />

          {/* Collaboration Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
               <h3 className="text-xl font-bold font-headline mb-4">Collaboration Thread</h3>
               <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {(task.messages || []).length === 0 ? (
                                <p className="text-muted-foreground text-center">No messages yet. Start the conversation!</p>
                            ) : (
                                (task.messages || []).map(message => {
                                    const sender = users.find(u => u.id === message.userId);
                                    const isCurrentUser = sender?.id === currentUser.id;
                                    return (
                                        <div key={message.id} className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : ''}`}>
                                             {!isCurrentUser && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={sender?.avatar} />
                                                    <AvatarFallback>{sender?.name.slice(0,2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={`p-3 rounded-lg max-w-sm ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                <p className="text-sm font-bold">{sender?.name}</p>
                                                <p className="text-sm">{message.text}</p>
                                                <p className="text-xs opacity-70 mt-1 text-right">{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</p>
                                            </div>
                                             {isCurrentUser && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={sender?.avatar} />
                                                    <AvatarFallback>{sender?.name.slice(0,2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-4 border-t">
                       {task.status !== 'Completed' ? (
                        <div className="w-full flex gap-2">
                             <Textarea 
                                placeholder="Type your message here..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                       ) : (
                           <p className="text-center text-muted-foreground w-full">This task is complete. The chat is now read-only.</p>
                       )}
                    </CardFooter>
               </Card>
            </div>
            
            <div className="space-y-6">
                <h3 className="text-xl font-bold font-headline">Actions</h3>
                {canComplete && (
                  <Card>
                    <CardHeader>
                        <CardTitle>Complete Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Once you're sure all requirements are met, you can mark this task as completed.</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleCompleteTask}>
                            <Check className="mr-2 h-4 w-4" /> Mark as Complete
                        </Button>
                    </CardFooter>
                  </Card>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>Shared Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center py-4">Document sharing is not yet implemented.</p>
                    </CardContent>
                </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
