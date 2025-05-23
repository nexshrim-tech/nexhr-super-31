
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Unauthorized = () => {
  const { signOut, userRole } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldAlert className="h-16 w-16 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          {userRole === 'employee' 
            ? "You don't have permission to access this page. This feature might require a higher subscription plan or specific permissions."
            : "You don't have permission to access this page. This feature may not be included in your current subscription plan."}
        </p>
        
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button
            onClick={handleGoHome}
            className="flex items-center gap-2 bg-nexhr-primary hover:bg-nexhr-primary/90"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
