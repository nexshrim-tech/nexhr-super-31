
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Bell, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface UserHeaderProps {
  title?: string;
}

// Sample notifications data
const notificationsData = [
  {
    id: 1,
    title: "New Leave Request",
    message: "John Doe has requested leave approval",
    time: "2 hours ago",
    read: false,
    type: "leave"
  },
  {
    id: 2,
    title: "Task Deadline Approaching",
    message: "Project XYZ design phase due tomorrow",
    time: "3 hours ago",
    read: false,
    type: "task"
  },
  {
    id: 3,
    title: "Attendance Report",
    message: "Weekly attendance report is available",
    time: "5 hours ago",
    read: true,
    type: "attendance"
  },
  {
    id: 4,
    title: "New Employee Added",
    message: "Sarah Johnson has been added to your team",
    time: "Yesterday",
    read: true,
    type: "employee"
  },
  {
    id: 5,
    title: "Document Approved",
    message: "Your leave document has been approved",
    time: "2 days ago",
    read: true,
    type: "document"
  }
];

const UserHeader = ({ title }: UserHeaderProps) => {
  const today = new Date();
  const formattedDate = format(today, "EEE, d MMMM");
  const isMobile = useIsMobile();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "leave": return "bg-purple-100 text-purple-800";
      case "task": return "bg-amber-100 text-amber-800";
      case "attendance": return "bg-emerald-100 text-emerald-800";
      case "employee": return "bg-blue-100 text-blue-800";
      case "document": return "bg-rose-100 text-rose-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-nexhr-primary/10 transition-colors group"
          onClick={() => setIsNotificationOpen(true)}
        >
          <Bell className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} group-hover:text-nexhr-primary transition-colors`} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm"></span>
          )}
        </Button>

        <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="text-left pb-4">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
                <Badge variant="outline" className="px-2 py-0.5">
                  {unreadCount} unread
                </Badge>
              </div>
              <SheetDescription className="flex justify-between items-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-nexhr-primary text-xs hover:text-nexhr-primary/80"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-rose-500 text-xs hover:text-rose-600"
                  onClick={clearAllNotifications}
                >
                  Clear all
                </Button>
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="space-y-4 mt-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg relative ${notification.read ? 'bg-gray-50' : 'bg-nexhr-primary/5 border-l-4 border-nexhr-primary'}`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        {notification.title}
                        <Badge className={`${getNotificationTypeColor(notification.type)} text-xs px-2 py-0.5`}>
                          {notification.type}
                        </Badge>
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-gray-200 absolute right-1 top-1"
                        onClick={() => clearNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[11px] text-gray-500">{notification.time}</span>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-6 px-2 text-nexhr-primary hover:text-nexhr-primary/80 hover:bg-nexhr-primary/10"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default UserHeader;
