import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Mail, Lock, User, Home, Phone, Building2, Users, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "company">("personal");
  
  const [name, setName] = useState("");
  
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (email && password) {
        const userData: Record<string, any> = {
          full_name: name,
          role: activeTab === 'company' ? 'admin' : 'employee'
        };
        
        if (activeTab === 'company') {
          userData.company_name = companyName;
          userData.company_size = companySize;
          userData.phone_number = phoneNumber;
          userData.company_address = companyAddress;
        }
        
        console.log("Signup data:", userData);
        
        await signUp(email, password, userData);
        
        toast({
          title: "Sign up initiated",
          description: "Please check your email for verification",
        });
        
        resetForm();
      } else {
        toast({
          title: "Sign up failed",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setCompanyName("");
    setPhoneNumber("");
    setCompanySize("");
    setCompanyAddress("");
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    resetForm();
    setPasswordError("");
    setRememberMe(false);
    setActiveTab("personal");
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
              <form onSubmit={handleSignUp} className="space-y-4">
                <Tabs 
                  value={activeTab} 
                  onValueChange={(v) => setActiveTab(v as "personal" | "company")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="personal" className="text-sm">
                      <User className="h-4 w-4 mr-2" />
                      Personal Account
                    </TabsTrigger>
                    <TabsTrigger value="company" className="text-sm">
                      <Building2 className="h-4 w-4 mr-2" />
                      Company Account
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-4">
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="name" className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Full Name <span className="text-red-500 ml-1">*</span>
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
                  </TabsContent>
                  
                  <TabsContent value="company" className="space-y-4">
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="name" className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Full Name <span className="text-red-500 ml-1">*</span>
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
                    
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="companyName" className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        Company Name <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Acme Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="phoneNumber" className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="companySize" className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        Company Size
                      </Label>
                      <Select value={companySize} onValueChange={setCompanySize}>
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501+">501+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="companyAddress" className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-gray-500" />
                        Company Address
                      </Label>
                      <Textarea
                        id="companyAddress"
                        placeholder="123 Business St, Suite 101, City, State, ZIP"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        className="transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent resize-none h-20"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    Email <span className="text-red-500 ml-1">*</span>
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
                  <Label htmlFor="password" className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-gray-500" />
                    Password <span className="text-red-500 ml-1">*</span>
                  </Label>
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
                
                <div className="space-y-2">
                  <Label 
                    htmlFor="confirmPassword" 
                    className={`flex items-center ${passwordError ? "text-red-500" : ""}`}
                  >
                    <Lock className={`h-4 w-4 mr-2 ${passwordError ? "text-red-500" : "text-gray-500"}`} />
                    Confirm Password <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (password && e.target.value) {
                        validatePassword();
                      }
                    }}
                    required
                    className={`transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent ${
                      passwordError ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {passwordError && (
                    <div className="flex items-center text-xs text-red-500 mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {passwordError}
                    </div>
                  )}
                </div>
                
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="link"
                        className="text-xs text-nexhr-primary p-0 h-auto font-normal"
                      >
                        What happens after I sign up?
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-semibold">After signing up:</h4>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>You'll receive a verification email</li>
                          <li>Click the link in the email to verify your account</li>
                          <li>You'll be able to log in to NexHR</li>
                          <li>You can customize your HR system and add employees</li>
                        </ol>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full group transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Create Account"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            ) : (
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
                    <Link
                      to="/forgot-password"
                      className="text-xs text-nexhr-primary hover:underline transition-all duration-300"
                    >
                      Forgot password?
                    </Link>
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
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button 
                onClick={toggleForm} 
                className="text-nexhr-primary hover:underline transition-all duration-300 font-medium"
                disabled={isLoading}
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
