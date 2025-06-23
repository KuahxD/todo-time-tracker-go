
import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/services/api';
import { CheckCircle2, ListTodo, Loader2 } from 'lucide-react';

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
          <ListTodo className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Start organizing your day by adding your first task above. You can manage up to 20 active todos.
        </p>
      </div>
    );
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <ListTodo className="h-4 w-4 mr-2" />
            Active Tasks ({activeTodos.length})
          </h3>
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
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
            Completed ({completedTodos.length})
          </h3>
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
