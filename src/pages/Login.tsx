
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 relative">
      <div className="fixed top-4 left-4 z-50">
        <Link to="/landing">
          <Button 
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            size="lg"
          >
            <Home className="h-5 w-5" />
            Back to Landing Page
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-md space-y-8 animate-fade-in relative">
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
            {isSignUp ? (
              <SignUpForm onToggleForm={toggleForm} />
            ) : (
              <LoginForm onToggleForm={toggleForm} />
            )}
          </CardContent>
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
