'use client';

import type { User } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase } from 'lucide-react';

interface HeaderProps {
  users: User[];
  currentUser: User;
  onUserChange: (userId: string) => void;
}

export function Header({ users, currentUser, onUserChange }: HeaderProps) {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10">
      <div className="flex items-center gap-3">
        <Briefcase className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-headline text-foreground">TaskTracker BPHC</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <p className="text-sm text-muted-foreground hidden md:block">Viewing as:</p>
        <Select onValueChange={onUserChange} value={currentUser.id}>
          <SelectTrigger className="w-auto min-w-[180px] gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <SelectValue placeholder="Select user" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name} ({user.role})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
