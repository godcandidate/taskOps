import axios from "axios";
import { LoginCredentials, RegisterData, UserProfile, Task } from "./types";

// Add type definition for the global window object with APP_CONFIG
declare global {
  interface Window {
    APP_CONFIG?: {
      AUTH_API_URL: string;
      TASK_API_URL: string;
    };
  }
}

// Base URLs for the APIs - use runtime config if available, fall back to env vars
const AUTH_API_URL = typeof window !== 'undefined' && window.APP_CONFIG 
  ? window.APP_CONFIG.AUTH_API_URL 
  : process.env.NEXT_PUBLIC_AUTH_API_URL;

const TASK_API_URL = typeof window !== 'undefined' && window.APP_CONFIG 
  ? window.APP_CONFIG.TASK_API_URL 
  : process.env.NEXT_PUBLIC_TASK_API_URL;

// Create axios instances with default configs
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const taskApi = axios.create({
  baseURL: TASK_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth Service
export const authService = {
  // Register a new user
  signup: async (userData: RegisterData): Promise<UserProfile> => {
    try {
      const response = await authApi.post("/signup", userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // Login a user
  signin: async (credentials: LoginCredentials): Promise<UserProfile> => {
    try {
      const response = await authApi.post("/signin", credentials);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  },

  // Get all users
  getAllUsers: async (): Promise<UserProfile[]> => {
    try {
      const response = await authApi.get("/users");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },
};

// Task Service
export const taskService = {
  // Get all tasks (for admin dashboard)
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const response = await taskApi.get("/tasks");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch tasks");
    }
  },

  // Get tasks for a specific user
  getUserTasks: async (email: string): Promise<Task[]> => {
    try {
      const response = await taskApi.get(`/tasks/user?email=${email}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user tasks"
      );
    }
  },

  // Create a new task
  createTask: async (taskData: Omit<Task, "id">): Promise<Task> => {
    try {
      const response = await taskApi.post("/create/", taskData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create task");
    }
  },

  // Update an existing task
  updateTask: async (
    taskId: string,
    taskData: Partial<Task>
  ): Promise<Task> => {
    try {
      // Use PATCH for status updates, PUT for other updates
      if (Object.keys(taskData).length === 1 && "status" in taskData) {
        // For status changes, use PATCH /tasks?id=taskId
        const response = await taskApi.patch(`/tasks?id=${taskId}`, taskData);
        return response.data.data;
      } else {
        // For other updates, use PUT /tasks/taskId
        const response = await taskApi.put(`/tasks?id=${taskId}`, taskData);
        return response.data.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update task");
    }
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      await taskApi.delete(`/tasks?id=${taskId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete task");
    }
  },
};
