
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';

interface SignupProps {
  onAuth: (token: string) => void;
  onToggle: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onAuth, onToggle }) => {
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

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.signup({ username, password });
      onAuth(response.token);
      toast({
        title: "Account created!",
        description: "Welcome to TodoFlow! You're now signed up and logged in.",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
          <UserPlus className="h-6 w-6 text-purple-600" />
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Choose a username"
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
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Create a password (min 6 characters)"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <button
            onClick={onToggle}
            className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
            disabled={isLoading}
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
