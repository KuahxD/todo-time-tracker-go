
import React, { useState, useEffect } from 'react';
import { TodoList } from './TodoList';
import { TodoInput } from './TodoInput';
import { apiService, Todo } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TodoAppProps {
  token: string;
  onLogout: () => void;
}

export const TodoApp: React.FC<TodoAppProps> = ({ token, onLogout }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await apiService.getTodos(token);
      setTodos(fetchedTodos || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      });
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (body: string) => {
    try {
      const newTodo = await apiService.createTodo(token, { body, completed: false });
      setTodos(prev => [newTodo, ...prev]);
      toast({
        title: "Todo added",
        description: "Your new task has been created successfully.",
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add todo",
        variant: "destructive",
      });
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await apiService.updateTodo(token, id);
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, completed: true } : todo
        )
      );
      toast({
        title: "Task completed",
        description: "Great job! Keep up the momentum.",
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await apiService.deleteTodo(token, id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Todo removed",
        description: "Task has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Todo Gopher</h1>
            <p className="text-sm text-gray-600">Manage your tasks efficiently</p>
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Stats */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>
              {totalCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Add Todo Form */}
          <div className="p-6 border-b">
            <TodoInput onAddTodo={handleAddTodo} />
          </div>

          {/* Todo List */}
          <div className="p-6">
            <TodoList
              todos={todos}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
