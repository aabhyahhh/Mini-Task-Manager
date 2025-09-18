// src/utils/types.ts
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";


export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

