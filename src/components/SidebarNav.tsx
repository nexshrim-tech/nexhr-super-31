
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  Users, 
  Home, 
  CalendarClock, 
  DollarSign, 
  CircleUser, 
  ReceiptText, 
  Files, 
  FileCog, 
  HelpCircle, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Building2, 
  Timer, 
  FileText,
  ShieldCheck,
  Briefcase,
  Bell,
  Computer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Define navigation menu items
  const mainNavItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Employees", path: "/all-employees" },
    { icon: CalendarClock, label: "Attendance", path: "/attendance" },
    { icon: DollarSign, label: "Salary", path: "/salary" },
    { icon: ReceiptText, label: "Expenses", path: "/expenses" },
    { icon: Files, label: "Documents", path: "/document-generator" },
    { icon: Bell, label: "Tasks & Reminders", path: "/tasks-reminders" },
    { icon: Timer, label: "Time Tracking", path: "/track" },
    { icon: Building2, label: "Department", path: "/department" },
    { icon: Briefcase, label: "Assets", path: "/assets" },
    { icon: MessageSquare, label: "Posts", path: "/posts" },
  ];

  const managementNavItems = [
    { icon: MessageSquare, label: "Messenger", path: "/messenger" },
    { icon: ShieldCheck, label: "Leave Management", path: "/leave-management" },
    { icon: Computer, label: "Help Desk", path: "/help-desk" },
    { icon: FileText, label: "Projects", path: "/project-management" },
    { icon: FileCog, label: "Meetings", path: "/meetings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const active = isActive(path);
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink to={path} className="w-full">
              <Button
                variant={active ? "default" : "ghost"}
                size="lg"
                className={cn(
                  "w-full justify-start gap-3 hover:bg-accent text-left font-normal",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isMobile ? "h-12 px-3" : "h-10 px-4"
                )}
              >
                <Icon className={cn("h-[1.2rem] w-[1.2rem]", active ? "text-primary" : "text-muted-foreground")} />
                <span>{label}</span>
              </Button>
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-accent text-foreground border-0">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 lg:relative",
        isMobile ? "w-[70px] items-center py-2" : "w-[240px] py-4 px-2"
      )}
    >
      <div className={cn("flex items-center justify-center py-3", isMobile ? "px-0" : "px-4 mb-2")}>
        <div className={cn("flex items-center", !isMobile && "gap-2")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <CircleUser className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isMobile && (
            <div className="text-xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
              NEX<span className="font-normal">HR</span>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex flex-1 flex-col gap-2 px-2">
        <div className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.path} icon={item.icon} label={item.label} path={item.path} />
          ))}
        </div>

        {!isMobile && <h3 className="mt-6 mb-2 px-4 text-sm font-semibold text-muted-foreground">Management</h3>}
        <Separator className="my-2" />

        <div className="flex flex-col gap-1">
          {managementNavItems.map((item) => (
            <NavItem key={item.path} icon={item.icon} label={item.label} path={item.path} />
          ))}
        </div>
      </ScrollArea>

      <div className={cn("mt-auto flex flex-col gap-1", isMobile ? "px-0" : "px-2", "pb-4")}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className={cn(
                  "w-full justify-start gap-3 hover:bg-accent text-left font-normal",
                  "text-muted-foreground",
                  isMobile ? "h-12 px-3" : "h-10 px-4"
                )}
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
                {!isMobile && <span>Settings</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-accent text-foreground border-0">
              Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className={cn(
                  "w-full justify-start gap-3 hover:bg-accent text-left font-normal hover:text-destructive",
                  "text-muted-foreground",
                  isMobile ? "h-12 px-3" : "h-10 px-4"
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
                {!isMobile && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-accent text-foreground border-0">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className={cn(
                  "w-full justify-start gap-3 hover:bg-accent text-left font-normal",
                  "text-muted-foreground",
                  isMobile ? "h-12 px-3" : "h-10 px-4"
                )}
                onClick={() => navigate("/help-desk")}
              >
                <HelpCircle className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
                {!isMobile && <span>Help</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-accent text-foreground border-0">
              Help
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};

export default SidebarNav;
