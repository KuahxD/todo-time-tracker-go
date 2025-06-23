
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Loader2, User } from 'lucide-react';

interface LoginProps {
  onAuth: (token: string) => void;
  onToggle: () => void;
}

export const Login: React.FC<LoginProps> = ({ onAuth, onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.login({ username, password });
      onAuth(response.token);
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUsername('demo');
    setPassword('demo123');
    toast({
      title: "Demo credentials loaded",
      description: "You can now click 'Sign In' or create this demo user if it doesn't exist yet.",
    });
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
          <LogIn className="h-6 w-6 text-blue-600" />
          Welcome Back
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
            disabled={isLoading}
          >
            <User className="mr-2 h-4 w-4" />
            Use Demo Credentials
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button
            onClick={onToggle}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            disabled={isLoading}
          >
            Sign up
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 text-center">
            💡 Click "Use Demo Credentials" then "Sign up" if this is your first time, or "Sign In" if you've used the demo before.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
