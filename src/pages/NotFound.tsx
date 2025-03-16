
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 bg-grid-pattern">
      <div className="text-center max-w-md w-full glass-effect bg-white/90 rounded-lg shadow-xl border border-gray-100 p-8 animate-scale-in">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-100 shadow-inner animate-pulse-slow">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <span className="sr-only">404</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-nexhr-primary to-purple-600 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 w-full transform hover:translate-y-[-2px]">
            <Home className="mr-2 h-5 w-5" />
            Return to Dashboard
          </Button>
        </Link>
        
        <div className="mt-6 text-sm text-gray-500">
          Error URL: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{location.pathname}</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
