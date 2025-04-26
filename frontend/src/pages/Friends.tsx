
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FriendCard from "@/components/friends/FriendCard";
import { Friend } from "@/types";

// Mock friends data for demo purposes
const MOCK_FRIENDS: Friend[] = [
  {
    id: "1",
    email: "astro@space.com",
    displayName: "AstroWanderer",
    avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    stats: { wins: 36, losses: 15, gamesPlayed: 51, winRate: 71 },
    status: "online",
    friendSince: new Date("2024-10-15"),
  },
  {
    id: "2",
    email: "cosmic@space.com",
    displayName: "CosmicDrifter",
    avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    stats: { wins: 42, losses: 30, gamesPlayed: 72, winRate: 58 },
    status: "online",
    friendSince: new Date("2024-09-22"),
  },
  {
    id: "3",
    email: "nebula@space.com",
    displayName: "NebulaNinja",
    stats: { wins: 28, losses: 12, gamesPlayed: 40, winRate: 70 },
    status: "away",
    friendSince: new Date("2024-11-05"),
  },
];

const Friends = () => {
  const { user } = useAuth();
  const [friends] = useState<Friend[]>(MOCK_FRIENDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequest, setFriendRequest] = useState("");
  
  const filteredFriends = friends.filter((friend) =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddFriend = () => {
    if (friendRequest) {
      toast({
        title: "Friend request sent",
        description: `A friend request has been sent to ${friendRequest}`,
      });
      setFriendRequest("");
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-space-gradient flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Friends</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="space-card mb-8 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl">Friends List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {filteredFriends.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredFriends.map((friend) => (
                          <FriendCard key={friend.id} friend={friend} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No friends found.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-8">
                <Card className="space-card animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <CardHeader>
                    <CardTitle className="text-xl">Add Friend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Add a friend using their display name.
                      </p>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Display name"
                          value={friendRequest}
                          onChange={(e) => setFriendRequest(e.target.value)}
                        />
                        <Button
                          className="bg-purple-gradient"
                          onClick={handleAddFriend}
                          disabled={!friendRequest}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="space-card animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <CardHeader>
                    <CardTitle className="text-xl">Friend Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary font-medium">
                            SS
                          </div>
                          <div>
                            <p className="font-medium">StarSeeker</p>
                            <p className="text-xs text-muted-foreground">42 games played</p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm" className="text-xs">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary font-medium">
                            GR
                          </div>
                          <div>
                            <p className="font-medium">GalaxyRider</p>
                            <p className="text-xs text-muted-foreground">28 games played</p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm" className="text-xs">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary font-medium">
                            OS
                          </div>
                          <div>
                            <p className="font-medium">OrbitSurfer</p>
                            <p className="text-xs text-muted-foreground">16 games played</p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm" className="text-xs">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Friends;
