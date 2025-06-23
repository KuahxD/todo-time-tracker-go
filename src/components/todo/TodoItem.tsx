
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
    <div className={`group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
      todo.completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      <button
        onClick={handleToggle}
        disabled={todo.completed || isToggling}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        } ${isToggling ? 'animate-pulse' : ''}`}
      >
        {todo.completed ? (
          <Check className="h-3 w-3" />
        ) : (
          <Circle className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm transition-all duration-200 ${
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
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
