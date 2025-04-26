
import { Friend } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FriendCardProps {
  friend: Friend;
}

const FriendCard = ({ friend }: FriendCardProps) => {
  const { displayName, status, avatar, stats, friendSince } = friend;
  
  const handleRemoveFriend = () => {
    toast({
      title: "Friend removed",
      description: `${displayName} has been removed from your friends list.`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card className="space-card h-full">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <UserAvatar 
            src={avatar} 
            name={displayName} 
            status={status}
            size="md"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg truncate">{displayName}</h3>
            <p className="text-sm text-muted-foreground">
              Friends since {formatDate(friendSince)}
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="bg-card/50 rounded-md p-2">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="font-semibold">{stats.winRate}%</p>
          </div>
          <div className="bg-card/50 rounded-md p-2">
            <p className="text-xs text-muted-foreground">Games</p>
            <p className="font-semibold">{stats.gamesPlayed}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={handleRemoveFriend}
          >
            Remove Friend
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
