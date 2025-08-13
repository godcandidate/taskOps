'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TodoFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoFormProps {
  initialData?: Partial<TodoFormData>;
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
}

export function TodoForm({ initialData, onSubmit, onCancel }: TodoFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );

  const { register, handleSubmit, setValue } = useForm<TodoFormData>({
    defaultValues: initialData,
  });

  const onSubmitForm = (data: TodoFormData) => {
    onSubmit({
      ...data,
      date: date?.toISOString() || new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input placeholder="Title" {...register('title')} />
      <Textarea placeholder="Description" {...register('description')} />
      
      <Select
        onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}
        defaultValue={initialData?.priority}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => setValue('category', value)}
        defaultValue={initialData?.category}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="work">Work</SelectItem>
          <SelectItem value="personal">Personal</SelectItem>
          <SelectItem value="shopping">Shopping</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a due date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Toggle for Active Status */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="active"
          {...register('active')} // Register the field
          defaultChecked={initialData?.active ?? true}
          className="h-4 w-4"
        />
        <label htmlFor="active" className="text-sm text-muted-foreground">
          Active
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Todo
        </Button>
      </div>
    </form>
  );
}
