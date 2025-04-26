
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import UserAvatar from "@/components/ui/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-space-gradient flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground hidden md:inline">
                  Welcome back,
                </span>
                <div className="flex items-center space-x-2">
                  <UserAvatar 
                    src={user.avatar}
                    name={user.displayName}
                    status={user.status}
                  />
                  <span className="font-medium hidden md:inline">
                    {user.displayName}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <Card className="space-card animate-fade-in" style={{ animationDelay: "100ms" }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Games Played</p>
                      <h3 className="text-2xl font-bold mt-1">{user.stats.gamesPlayed}</h3>
                    </div>
                    <div className="bg-primary/20 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                        <path d="M19.5 12.572 12 20l-3-3"></path>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="space-card animate-fade-in" style={{ animationDelay: "200ms" }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Wins</p>
                      <h3 className="text-2xl font-bold mt-1">{user.stats.wins}</h3>
                    </div>
                    <div className="bg-green-500/20 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="space-card animate-fade-in" style={{ animationDelay: "300ms" }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Losses</p>
                      <h3 className="text-2xl font-bold mt-1">{user.stats.losses}</h3>
                    </div>
                    <div className="bg-destructive/20 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                        <polyline points="2 12 6 12 9 21 15 3 18 12 22 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="space-card animate-fade-in" style={{ animationDelay: "400ms" }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <h3 className="text-2xl font-bold mt-1">{user.stats.winRate}%</h3>
                    </div>
                    <div className="bg-primary/20 p-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="m2 4 3 12h14l3-12"></path>
                        <path d="m7 15 5 6 5-6"></path>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="space-card animate-fade-in" style={{ animationDelay: "500ms" }}>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-card/50 rounded-md">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                          <path d="M19.5 12.572 12 20l-3-3"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Won a match against StarGazer</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-card/50 rounded-md">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Added CosmicDrifter as a friend</p>
                        <p className="text-sm text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-card/50 rounded-md">
                      <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                          <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                          <path d="M19.5 12.572 12 20l-3-3"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Lost a match against NebulaNinja</p>
                        <p className="text-sm text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="space-card animate-fade-in" style={{ animationDelay: "600ms" }}>
                <CardHeader>
                  <CardTitle className="text-xl">Online Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-card/50 rounded-md">
                      <div className="flex items-center">
                        <UserAvatar
                          src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
                          name="AstroWanderer"
                          status="online"
                          size="sm"
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">AstroWanderer</p>
                          <p className="text-xs text-muted-foreground">In Game</p>
                        </div>
                      </div>
                      <button className="text-xs text-primary hover:underline">
                        Message
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card/50 rounded-md">
                      <div className="flex items-center">
                        <UserAvatar
                          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901"
                          name="CosmicDrifter"
                          status="online"
                          size="sm"
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">CosmicDrifter</p>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                      </div>
                      <button className="text-xs text-primary hover:underline">
                        Message
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card/50 rounded-md">
                      <div className="flex items-center">
                        <UserAvatar
                          name="NebulaNinja"
                          status="away"
                          size="sm"
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">NebulaNinja</p>
                          <p className="text-xs text-muted-foreground">Away</p>
                        </div>
                      </div>
                      <button className="text-xs text-primary hover:underline">
                        Message
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
