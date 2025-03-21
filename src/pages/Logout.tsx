
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Logout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate logout
    setTimeout(() => {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    }, 500);
  }, [navigate, toast]);

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
