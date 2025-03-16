
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
        <div className="relative w-24 h-24 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-100 shadow-inner animate-pulse-slow">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <span className="sr-only">404</span>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold border-2 border-white">
            !
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent mb-2">
          Page Not Found
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-nexhr-primary to-purple-600 mx-auto mb-4 rounded-full"></div>
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
