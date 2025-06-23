
import React, { useState, useEffect } from 'react';
import { TodoList } from './TodoList';
import { TodoInput } from './TodoInput';
import { TodoHeader } from './TodoHeader';
import { apiService, Todo } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      });
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
        description: "Task has been moved to your archive.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <TodoHeader 
        onLogout={onLogout} 
        completedCount={completedCount}
        totalCount={totalCount}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <TodoInput onAddTodo={handleAddTodo} />
          </div>
          
          <div className="p-6">
            <TodoList
              todos={todos}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        {totalCount > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {totalCount - completedCount} pending • {completedCount} completed • Limit: 20 active todos
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
