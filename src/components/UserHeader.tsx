
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Bell, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserHeaderProps {
  title?: string;
}

const UserHeader = ({ title }: UserHeaderProps) => {
  const today = new Date();
  const formattedDate = format(today, "EEE, d MMMM");
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center p-3 sm:p-4 mb-4 sm:mb-6 border-b bg-gradient-to-r from-white to-gray-50 shadow-md rounded-b-lg transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-md ring-2 ring-nexhr-primary/20 transition-all duration-300 hover:ring-nexhr-primary/50">
            <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
            <AvatarFallback className="bg-gradient-to-br from-nexhr-primary to-purple-600 text-white">AD</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500 ring-2 ring-white"></span>
          </span>
        </div>
        <div className="flex flex-col">
          <div className="text-base sm:text-lg font-medium">Hi There, <span className="font-semibold text-nexhr-primary">Admin</span></div>
          <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
            {formattedDate}
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-nexhr-primary/60 ml-1"></span>
            <span className="text-xs text-nexhr-primary/80 font-medium">Online</span>
          </div>
          {title && (
            <div className="text-sm sm:text-base font-medium mt-1 bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent animate-fade-in flex items-center">
              {title}
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 ml-1 text-yellow-400 animate-pulse-slow" />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nexhr-primary/20 w-56 transition-all duration-300 hover:border-nexhr-primary/30 focus:border-nexhr-primary/50 bg-white/80 backdrop-blur-sm"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative hover:bg-nexhr-primary/10 transition-colors group">
          <Bell className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} group-hover:text-nexhr-primary transition-colors`} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm"></span>
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
