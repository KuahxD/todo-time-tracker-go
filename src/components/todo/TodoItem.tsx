
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Todo } from '@/services/api';
import { Check, Trash2, Circle } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    if (todo.completed || isToggling) return;
    setIsToggling(true);
    try {
      await onToggle(todo.id!);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(todo.id!);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`group flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${
      todo.completed 
        ? 'bg-green-50 border-green-200 opacity-75' 
        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      <button
        onClick={handleToggle}
        disabled={todo.completed || isToggling}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        } ${isToggling ? 'animate-pulse' : ''}`}
      >
        {todo.completed ? (
          <Check className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-all duration-200 ${
          todo.completed 
            ? 'line-through text-gray-500' 
            : 'text-gray-900'
        }`}>
          {todo.body}
        </p>
      </div>

      <Button
        onClick={handleDelete}
        variant="ghost"
        size="sm"
        disabled={isDeleting}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
