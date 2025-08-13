"use client";

import { useState, useEffect, useMemo } from "react";
import { Task } from "@/lib/types";
import { taskService } from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, PenSquare } from "lucide-react";
import { StatusChangeDialog } from "./status-change-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskSearch, SearchFilters } from "./task-search";
import { format } from "date-fns";

export function UserDashboard() {
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState<
    "pending" | "in-progress" | "completed" | null
  >(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadUserTasks = async () => {
    try {
      if (user?.email) {
        const data = await taskService.getUserTasks(user.email);
        setUserTasks(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  type TaskStatus = "pending" | "in-progress" | "completed";

  const openStatusDialog = (task: Task, newStatus: TaskStatus) => {
    setSelectedTask(task);
    setNewStatus(newStatus);
    setIsStatusDialogOpen(true);
  };

  const handleStatusChange = async (
    taskId: string,
    status: "pending" | "in-progress" | "completed"
  ) => {
    try {
      await taskService.updateTask(taskId, { status });
      await loadUserTasks();
      setIsStatusDialogOpen(false);
      setSelectedTask(null);
      setNewStatus(null);
      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    userTasks.forEach((task) => uniqueCategories.add(task.category));
    return Array.from(uniqueCategories);
  }, [userTasks]);

  const filteredTasks = useMemo(() => {
    let filtered = [...userTasks];

    // Apply search filters
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query)
      );
    }

    if (searchFilters.status) {
      filtered = filtered.filter(
        (task) => task.status === searchFilters.status
      );
    }

    if (searchFilters.priority) {
      filtered = filtered.filter(
        (task) => task.priority === searchFilters.priority
      );
    }

    if (searchFilters.category) {
      filtered = filtered.filter(
        (task) => task.category === searchFilters.category
      );
    }

    return filtered;
  }, [userTasks, searchFilters]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "";
    }
  };

  const formatStatus = (status: string): string => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (userTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-semibold mb-2">No Tasks Assigned</h2>
        <p className="text-muted-foreground">
          You don't have any tasks assigned to you yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskSearch onSearch={handleSearch} />

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-md">
          <h3 className="text-xl font-semibold mb-2">
            No matching tasks found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters
          </p>
        </div>
      )}

      <Table>
        <TableCaption>Your assigned tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Current Status</TableHead>
            <TableHead>Change Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task, index) => (
            <TableRow
              key={task.id}
              className={task.status === "completed" ? "opacity-60" : ""}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell className="max-w-md">
                <div className="whitespace-normal break-words line-clamp-3 hover:line-clamp-none transition-all duration-200 cursor-pointer">
                  {task.description}
                </div>
              </TableCell>
              <TableCell>{getPriorityBadge(task.priority)}</TableCell>
              <TableCell>{task.category}</TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span
                    className={`capitalize font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {formatStatus(task.status)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  onValueChange={(value: TaskStatus) =>
                    openStatusDialog(task, value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Status Change Confirmation Dialog */}
      <StatusChangeDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onStatusChange={handleStatusChange}
        task={selectedTask}
        initialStatus={newStatus}
      />
    </div>
  );
}
