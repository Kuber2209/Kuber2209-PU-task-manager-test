'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Wand2, Minus } from 'lucide-react';
import type { User, Task } from '@/lib/types';
import { suggestTaskTags } from '@/ai/flows/suggest-task-tags';
import { tasks as allTasks } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const taskSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  tags: z.array(z.string()).min(1, 'At least one tag is required.'),
  requiredAssociates: z.number().min(1, 'At least one associate is required.'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
  currentUser: User;
  onTaskCreated: (task: Task) => void;
}

export function CreateTaskForm({ currentUser, onTaskCreated }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      requiredAssociates: 1,
    },
  });

  const tags = watch('tags');
  const description = watch('description');
  const requiredAssociates = watch('requiredAssociates');

  const handleSuggestTags = async () => {
    if (!description || description.length < 10) {
      toast({
        variant: 'destructive',
        title: 'Description too short',
        description: 'Please provide a longer description to suggest tags.',
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestTaskTags({ taskDescription: description });
      const newTags = [...new Set([...tags, ...result.tags])];
      setValue('tags', newTags.slice(0, 5)); // Limit to 5 tags
    } catch (error) {
      console.error('Error suggesting tags:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not suggest tags at this time.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setValue('tags', [...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };
  
  const onSubmit = (data: TaskFormData) => {
    const newTask: Task = {
      id: `task_${Math.random().toString(36).substring(2, 9)}`,
      ...data,
      status: 'Open',
      createdBy: currentUser.id,
      assignedTo: [],
      createdAt: new Date().toISOString(),
    };
    // Mutate mock data for demo
    allTasks.unshift(newTask);
    onTaskCreated(newTask);
    toast({
      title: 'Task Created!',
      description: `The task "${data.title}" has been posted.`,
    });
    setOpen(false);
    setValue('title', '');
    setValue('description', '');
    setValue('tags', []);
    setValue('requiredAssociates', 1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="font-headline">Create a New Task</DialogTitle>
            <DialogDescription>
              Fill in the details below to post a new task for associates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} className="min-h-[120px]" />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                    <Input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
                        placeholder="Add a tag and press Enter"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>Add</Button>
                    <Button type="button" variant="ghost" size="icon" onClick={handleSuggestTags} disabled={isSuggesting} aria-label="Suggest Tags">
                        {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    </Button>
                </div>
                {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="group relative pr-5 cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                            {tag}
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100">&times;</span>
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredAssociates">Number of Associates</Label>
              <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => setValue('requiredAssociates', Math.max(1, requiredAssociates - 1))}>
                      <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                      id="requiredAssociates" 
                      type="number" 
                      className="w-16 text-center"
                      {...register('requiredAssociates', { valueAsNumber: true })}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => setValue('requiredAssociates', requiredAssociates + 1)}>
                      <Plus className="h-4 w-4" />
                  </Button>
              </div>
              {errors.requiredAssociates && <p className="text-sm text-destructive">{errors.requiredAssociates.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
