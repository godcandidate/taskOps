'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, X, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type SearchFilters = {
  query?: string;
  title?: string;
  priority?: 'low' | 'medium' | 'high' | '';
  category?: string;
  status?: 'pending' | 'in-progress' | 'completed' | '';
  date?: Date | null;
};

interface TaskSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export function TaskSearch({ onSearch }: TaskSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    title: '',
    priority: '',
    category: '',
    status: '',
    date: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, title: e.target.value });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    // Convert 'all' value to empty string for filtering logic
    const processedValue = value === 'all' ? '' : value;
    setFilters({ ...filters, [key]: processedValue });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      title: '',
      priority: '',
      category: '',
      status: '',
      date: null,
    });
    onSearch({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.title || ''}
            onChange={handleInputChange}
            className="pl-8"
          />
          {filters.title && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => handleFilterChange('title', '')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-muted' : ''}
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button onClick={handleSearch} className="btn-purple">
          Search
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-card">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={filters.priority || ''}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Any priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Any category"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.date && "text-muted-foreground"
                  )}
                >
                  {filters.date ? (
                    format(filters.date, "PPP")
                  ) : (
                    <span>Any date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.date || undefined}
                  onSelect={(date) => handleFilterChange('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-1 md:col-span-4 flex justify-end">
            <Button variant="outline" onClick={handleReset} className="w-full md:w-auto">
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
