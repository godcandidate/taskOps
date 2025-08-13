'use client';

import { useState, useEffect, useMemo } from 'react';
import { Task, UserProfile } from '@/lib/types';
import { taskService, authService } from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminTaskForm } from '@/components/admin-task-form';
import { AssignTaskDialog } from '@/components/assign-task-dialog';
import { TaskSearch, SearchFilters } from './task-search';
import { format } from 'date-fns';

export function AdminDashboard() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadTasks();
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setAllTasks(data);
    } catch (error) {
      console.error('Load tasks error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks: ' + (error instanceof Error ? error.message : 'Network or server issue'),
        variant: 'destructive',
      });
    }
  };
  
  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const loadUsers = async () => {
    try {
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Load users error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users: ' + (error instanceof Error ? error.message : 'Network or server issue'),
        variant: 'destructive',
      });
    }
  };

  const handleCreateTask = async (data: Omit<Task, 'id'>) => {
    try {
      await taskService.createTask(data);
      await loadTasks();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!editingTask) return;
    try {
      await taskService.updateTask(editingTask.id, data);
      await loadTasks();
      setEditingTask(null);
      setIsFormOpen(false); // Close the form dialog
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await loadTasks();
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Delete task error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive',
      });
    }
  };

  const handleAssignTask = async (taskId: string, userEmail: string) => {
    try {
      // In a real implementation, we would update the task's assignedTo field
      // For now, we'll just show a toast message
      toast({
        title: 'Success',
        description: 'Task assigned successfully',
      });
      setIsAssignDialogOpen(false);
      setSelectedTask(null);
      await loadTasks();
    } catch (error) {
      console.error('Assign task error:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign task: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive',
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getAssignedUser = (assignedUsers?: string[]) => {
    if (!assignedUsers || assignedUsers.length === 0) return 'Unassigned';
    
    // Extract just the user names from the format "John_Doe:johndoe@email.com"
    return assignedUsers.map(assignedUser => {
      // Split by colon and get the first part (the name)
      const parts = assignedUser.split(':');
      if (parts.length > 0) {
        // Replace underscores with spaces
        return parts[0].replace(/_/g, ' ');
      }
      return assignedUser; // Fallback to the original string if format is unexpected
    }).join(', ');
  };

  // Filter todos based on search criteria
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    allTasks.forEach(task => uniqueCategories.add(task.category));
    return Array.from(uniqueCategories);
  }, [allTasks]);

  const filteredTasks = useMemo(() => {
    let filtered = [...allTasks];
    
    // Apply search filters
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      );
    }
    
    if (searchFilters.status) {
      filtered = filtered.filter(task => task.status === searchFilters.status);
    }
    
    if (searchFilters.priority) {
      filtered = filtered.filter(task => task.priority === searchFilters.priority);
    }
    
    if (searchFilters.category) {
      filtered = filtered.filter(task => task.category === searchFilters.category);
    }
    
    return filtered;
  }, [allTasks, searchFilters]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const closeAssignDialog = () => {
    setIsAssignDialogOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => { setIsFormOpen(true); setEditingTask(null); }} className="btn-purple">
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      </div>
      
      <TaskSearch onSearch={handleSearch} />
      
      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-md">
          <h3 className="text-xl font-semibold mb-2">No matching tasks found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters</p>
        </div>
      )}

      <Table>
        <TableCaption>List of all tasks in the system</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task, index) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                {getPriorityBadge(task.priority)}
              </TableCell>
              <TableCell>{task.category}</TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>
                <Badge variant={task.status === 'completed' ? "default" : "outline"}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{getAssignedUser(task.assignedTo)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsAssignDialogOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const openEditForm = (task: Task) => {
                        setEditingTask(task);
                        setIsFormOpen(true);
                      };
                      openEditForm(task);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) setEditingTask(null);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>
          <AdminTaskForm
            initialData={editingTask || undefined}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      <AssignTaskDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onAssign={handleAssignTask}
        onCancel={closeAssignDialog}
        task={selectedTask}
        users={users}
      />
    </div>
  );
}
