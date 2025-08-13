import { Calendar, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { Todo } from '@/lib/types';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface TodoCardProps {
  todo: Todo;
  formattedDate: string; // Accept the formatted date as a prop
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, active: boolean) => void;
}

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export function TodoCard({ todo, formattedDate, onEdit, onDelete, onToggleComplete }: TodoCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleComplete(todo.id, todo.active)}
          >
            {todo.active ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
          <span className={!todo.active ? 'line-through text-muted-foreground' : ''}>
            {todo.title}
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{todo.category}</Badge>
          <Badge className={priorityColors[todo.priority]}>{todo.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${todo.active ? 'text-muted-foreground' : ''}`}>
          {todo.description}
        </p>
        {/* Render the formatted date inside the CardContent */}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span> {/* Display the formatted date */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button size="icon" variant="ghost" onClick={() => onEdit(todo)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onDelete(todo.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
