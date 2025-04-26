
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (isMobile) return null;
  
  const isActive = (path: string) => location.pathname === path;
  
  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/friends", label: "Friends", icon: Users },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="w-60 h-[calc(100vh-4rem)] bg-sidebar border-r border-border hidden md:block">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6 px-2">Navigation</h2>
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(item.path)
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5",
                isActive(item.path) ? "text-primary" : "text-sidebar-foreground"
              )} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="px-2 py-4">
          <div className="text-xs text-sidebar-foreground/70">
            <p>© 2025 SpaceFriends</p>
            <p>Find friends across the cosmos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
