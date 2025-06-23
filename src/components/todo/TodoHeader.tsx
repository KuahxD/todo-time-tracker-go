
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, CheckCircle2, Circle } from 'lucide-react';

interface TodoHeaderProps {
  onLogout: () => void;
  completedCount: number;
  totalCount: number;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({ 
  onLogout, 
  completedCount, 
  totalCount 
}) => {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">TodoFlow</h1>
            
            {totalCount > 0 && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{completedCount}</span>
                  <Circle className="h-4 w-4 text-gray-400" />
                  <span>{totalCount - completedCount}</span>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
