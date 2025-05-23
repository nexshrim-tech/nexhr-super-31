
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onToggleForm: () => void;
}

export const LoginForm = ({ onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-gray-500" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="example@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="flex items-center">
            <Lock className="h-4 w-4 mr-2 text-gray-500" />
            Password
          </Label>
          <a
            href="/forgot-password"
            className="text-xs text-nexhr-primary hover:underline transition-all duration-300"
          >
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={() => setRememberMe(!rememberMe)}
          className="data-[state=checked]:bg-nexhr-primary data-[state=checked]:border-nexhr-primary"
        />
        <Label
          htmlFor="remember"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember me
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full group transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Sign in"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onToggleForm}
            className="text-nexhr-primary hover:underline transition-all duration-300 font-medium"
            disabled={isLoading}
            type="button"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
};
