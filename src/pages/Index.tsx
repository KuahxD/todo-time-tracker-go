
import React, { useState, useEffect } from 'react';
import { Login } from '@/components/auth/Login';
import { Signup } from '@/components/auth/Signup';
import { TodoApp } from '@/components/todo/TodoApp';

const Index = () => {
  const [token, setToken] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleAuth = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  if (token) {
    return <TodoApp token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TodoFlow</h1>
          <p className="text-gray-600">Organize your tasks with elegance</p>
        </div>
        
        {showSignup ? (
          <Signup 
            onAuth={handleAuth} 
            onToggle={() => setShowSignup(false)} 
          />
        ) : (
          <Login 
            onAuth={handleAuth} 
            onToggle={() => setShowSignup(true)} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
