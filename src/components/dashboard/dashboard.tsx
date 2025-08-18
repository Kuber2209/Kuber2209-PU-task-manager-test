'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { users } from '@/lib/data';
import { Header } from './header';
import { JptDashboard } from './jpt-dashboard';
import { AssociateDashboard } from './associate-dashboard';
import { AllProfilesDashboard } from './all-profiles-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);

  const handleUserChange = (userId: string) => {
    const newUser = users.find(u => u.id === userId);
    if (newUser) {
      setCurrentUser(newUser);
    }
  };

  const isJPT = currentUser.role === 'JPT';
  const associates = users.filter(u => u.role === 'Associate');

  // Determine a safe default tab for the current user type
  const defaultTab = isJPT ? "my-tasks" : "available-tasks";

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header users={users} currentUser={currentUser} onUserChange={handleUserChange} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue={defaultTab} className="w-full" key={currentUser.id}>
          <TabsList className="grid w-full grid-cols-2 md:w-fit md:grid-cols-3">
            {isJPT ? (
               <TabsTrigger value="my-tasks">My Posted Tasks</TabsTrigger>
            ) : (
              <>
                <TabsTrigger value="available-tasks">Available Tasks</TabsTrigger>
                <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
              </>
            )}
            <TabsTrigger value="all-profiles">Team Logs</TabsTrigger>
          </TabsList>
          
          {isJPT ? (
            <TabsContent value="my-tasks">
                <JptDashboard currentUser={currentUser} />
            </TabsContent>
          ) : (
            <>
              <TabsContent value="available-tasks">
                <AssociateDashboard view="available" currentUser={currentUser} />
              </TabsContent>
              <TabsContent value="my-tasks">
                <AssociateDashboard view="my-tasks" currentUser={currentUser} />
              </TabsContent>
            </>
          )}

          <TabsContent value="all-profiles">
            <AllProfilesDashboard associates={associates} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
