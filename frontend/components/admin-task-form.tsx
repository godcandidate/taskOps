"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/api-service";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, UserProfile } from "@/lib/types";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const taskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" }),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().min(1, { message: "Category is required" }),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  assignedTo: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface AdminTaskFormProps {
  initialData?: Task;
  onSubmit: (data: Omit<Task, "id">) => void;
  onCancel: () => void;
}

export function AdminTaskForm({
  initialData,
  onSubmit,
  onCancel,
}: AdminTaskFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialData?.dueDate ? new Date(initialData.dueDate) : undefined
  );
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await authService.getAllUsers();
        // Filter to only show regular users, not admins
        const regularUsers = data.filter((user) => user.role === "user");
        setUsers(regularUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    loadUsers();
  }, []);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      priority: initialData?.priority || "medium",
      category: initialData?.category || "",
      dueDate: initialData?.dueDate || "",
      status: initialData?.status || "pending",
      assignedTo: initialData?.assignedTo || [],
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    // The assignedTo field is already correctly formatted in the format ["John_Doe:johndoe@email.com"]
    // when the user selects a user from the dropdown, so we can just pass it directly
    
    // Ensure we're passing a valid Task object (minus the id)
    const taskData: Omit<Task, "id"> = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate,
      status: data.status,
      assignedTo: data.assignedTo
    };
    
    onSubmit(taskData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Work, Personal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? field.value : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate) {
                        // Format the date as "Saturday, 25th May 2025"
                        const formattedDate = format(
                          newDate,
                          "EEEE, do MMMM yyyy"
                        );
                        field.onChange(formattedDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === "unassigned") {
                    // Handle unassigned case
                    field.onChange([]);
                    setSelectedUser(null);
                  } else {
                    // Find the selected user
                    const user = users.find(
                      (u) => String(u.id) === String(value)
                    );
                    if (user) {
                      // Store the selected user for display
                      setSelectedUser(user);

                      // Format the assignedTo value correctly for the backend
                      const firstName = user.firstName || "";
                      const lastName = user.lastName || "";
                      let userName = "";

                      if (firstName && lastName) {
                        userName = `${firstName}_${lastName}`;
                      } else if (firstName) {
                        userName = firstName;
                      } else if (lastName) {
                        userName = lastName;
                      } else {
                        userName = user.email.split("@")[0];
                      }

                      // Set the formatted value in the form
                      const formattedValue = `${userName}:${user.email}`;
                      field.onChange([formattedValue]);
                    }
                  }
                }}
                defaultValue={
                  initialData?.assignedTo?.[0] ? "assigned" : "unassigned"
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user">
                      {selectedUser
                        ? selectedUser.firstName && selectedUser.lastName
                          ? `${selectedUser.firstName} ${selectedUser.lastName}`
                          : selectedUser.email
                        : initialData?.assignedTo?.[0]
                        ? // Display the assigned user from initial data
                          initialData.assignedTo[0]
                            .split(":")[0]
                            .replace(/_/g, " ")
                        : "Unassigned"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="btn-purple">
            {initialData ? "Update" : "Create"} Task
          </Button>
        </div>
      </form>
    </Form>
  );
}
