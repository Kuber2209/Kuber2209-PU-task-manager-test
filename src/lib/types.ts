export type UserRole = 'JPT' | 'Associate';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: 'Open' | 'In Progress' | 'Completed';
  createdBy: string; // userId of JPT
  assignedTo: string[]; // userIds of Associates
  requiredAssociates: number;
  createdAt: string;
  completedAt?: string;
  messages?: Message[];
}
