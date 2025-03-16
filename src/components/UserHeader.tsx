
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
  title?: string;
}

const UserHeader = ({ title }: UserHeaderProps) => {
  const today = new Date();
  const formattedDate = format(today, "EEE, d MMMM");

  return (
    <div className="flex justify-between items-center p-4 mb-6 border-b bg-gradient-to-r from-white to-gray-50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-nexhr-primary/20 transition-all duration-300 hover:ring-nexhr-primary/50">
          <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
          <AvatarFallback className="bg-gradient-to-br from-nexhr-primary to-purple-600 text-white">AD</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-lg font-medium">Hi There, <span className="font-semibold text-nexhr-primary">Admin</span></div>
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
          {title && (
            <div className="text-base font-medium mt-1 bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
              {title}
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
            className="pl-9 pr-4 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nexhr-primary/20 w-56 transition-all duration-300 hover:border-nexhr-primary/30 focus:border-nexhr-primary/50 bg-white/80 backdrop-blur-sm"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative hover:bg-nexhr-primary/10 transition-colors group">
          <Bell className="h-5 w-5 group-hover:text-nexhr-primary transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm"></span>
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
