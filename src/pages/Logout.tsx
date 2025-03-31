
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
      } catch (error) {
        console.error("Logout error:", error);
        toast({
          title: "Error logging out",
          description: "An error occurred while logging out.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    performLogout();
  }, [navigate, toast, signOut]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Logging out...</h2>
        <p className="text-gray-500">Please wait while we log you out.</p>
      </div>
    </div>
  );
};

export default Logout;
