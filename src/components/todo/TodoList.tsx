
import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/services/api';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  isLoading: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({ 
  todos, 
  onToggleTodo, 
  onDeleteTodo, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Circle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Start by adding your first task above. Stay organized and productive!
        </p>
      </div>
    );
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
      
      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Circle className="h-4 w-4 text-orange-500" />
            <h3 className="text-sm font-medium text-gray-700">
              Pending ({activeTodos.length})
            </h3>
          </div>
          <div className="space-y-2">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onDelete={onDeleteTodo}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <h3 className="text-sm font-medium text-gray-700">
              Completed ({completedTodos.length})
            </h3>
          </div>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onDelete={onDeleteTodo}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
