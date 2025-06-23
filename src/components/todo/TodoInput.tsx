
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';

interface TodoInputProps {
  onAddTodo: (body: string) => Promise<void>;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTodo(input.trim());
      setInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <div className="flex-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="text-base h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          disabled={isSubmitting}
          maxLength={200}
        />
      </div>
      <Button 
        type="submit" 
        disabled={!input.trim() || isSubmitting}
        className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Plus className="h-5 w-5 mr-2" />
            Add Task
          </>
        )}
      </Button>
    </form>
  );
};
