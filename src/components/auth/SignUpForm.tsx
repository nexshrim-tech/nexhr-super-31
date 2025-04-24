
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Building2, Phone, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

interface SignUpFormProps {
  onToggleForm: () => void;
}

export const SignUpForm = ({ onToggleForm }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [activeTab, setActiveTab] = useState<"personal" | "company">("personal");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { toast } = useToast();
  const { signUp } = useAuth();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
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
    setPasswordError("");
    setError("");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
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
      if (email && password && name) {
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
        
        console.log("About to sign up with user data:", userData);
        await signUp(email, password, userData);
        
        resetForm();
        onToggleForm();
      } else {
        toast({
          title: "Sign up failed",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      )}
      
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
          <div className="space-y-2">
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
          <div className="space-y-2">
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
          
          <div className="space-y-2">
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
              required={activeTab === 'company'}
              className="transition-all duration-300 focus:ring-2 focus:ring-nexhr-primary focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
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
          
          <div className="space-y-2">
            <Label htmlFor="companySize" className="flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-gray-500" />
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
          
          <div className="space-y-2">
            <Label htmlFor="companyAddress" className="flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-gray-500" />
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

      <Button 
        type="submit" 
        className="w-full group transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Create Account"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onToggleForm}
            className="text-nexhr-primary hover:underline transition-all duration-300 font-medium"
            disabled={isLoading}
            type="button"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};
