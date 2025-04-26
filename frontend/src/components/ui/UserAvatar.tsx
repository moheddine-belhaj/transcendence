
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserStatus } from "@/types";

interface UserAvatarProps {
  src?: string;
  name: string;
  status?: UserStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserAvatar = ({ 
  src, 
  name, 
  status, 
  size = "md", 
  className 
}: UserAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };
  
  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="bg-accent text-accent-foreground font-medium">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {status && (
        <span 
          className={cn(
            "status-indicator",
            {
              "status-online": status === "online",
              "status-offline": status === "offline",
              "status-away": status === "away",
            },
            {
              "w-2 h-2 border": size === "sm",
              "w-3 h-3 border-2": size === "md",
              "w-4 h-4 border-2": size === "lg"
            }
          )}
        />
      )}
    </div>
  );
};

export default UserAvatar;
