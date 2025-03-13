
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your authentication logic here
    if (email && password) {
      toast({
        title: "Login successful",
        description: "Welcome to NexHR!",
      });
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your sign up logic here
    if (name && email && password) {
      toast({
        title: "Sign up successful",
        description: "Welcome to NexHR! Please check your email to verify your account.",
      });
      navigate("/");
    } else {
      toast({
        title: "Sign up failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    // Reset form fields
    setName("");
    setEmail("");
    setPassword("");
    setRememberMe(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
              NEX<span className="font-normal">HR</span>
            </div>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? "Sign up to get started with NexHR" : "Sign in to your account to continue"}
          </p>
        </div>
        
        <Card className="w-full shadow-lg border-t-4 border-t-nexhr-primary transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">{isSignUp ? "Sign up" : "Sign in"}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Enter your information to create an account" 
                : "Enter your email and password to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="name" className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent"
                  />
                </div>
              )}
              
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
                  {!isSignUp && (
                    <Link
                      to="/forgot-password"
                      className="text-xs text-nexhr-primary hover:underline transition-all duration-300"
                    >
                      Forgot password?
                    </Link>
                  )}
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
              
              {!isSignUp && (
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
              )}
              
              <Button 
                type="submit" 
                className="w-full group transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                {isSignUp ? "Create Account" : "Sign in"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button 
                onClick={toggleForm} 
                className="text-nexhr-primary hover:underline transition-all duration-300 font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center text-sm text-gray-600 animate-fade-in" style={{animationDelay: "0.3s"}}>
          By continuing, you agree to our 
          <a href="#" className="text-nexhr-primary hover:underline ml-1">Terms of Service</a>
          <span className="mx-1">and</span>
          <a href="#" className="text-nexhr-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
