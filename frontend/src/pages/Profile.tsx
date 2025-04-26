
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/profile/ProfileForm";

const Profile = () => {
  return (
    <div className="min-h-screen bg-space-gradient flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
            
            <div className="grid grid-cols-1 gap-8">
              <Card className="space-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
              
              <Card className="space-card animate-fade-in" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <CardTitle className="text-xl">Account Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-card/50 p-4 rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Games Played</p>
                      <p className="text-2xl font-bold mt-1">60</p>
                    </div>
                    <div className="bg-card/50 p-4 rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Wins</p>
                      <p className="text-2xl font-bold mt-1 text-green-500">42</p>
                    </div>
                    <div className="bg-card/50 p-4 rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Losses</p>
                      <p className="text-2xl font-bold mt-1 text-destructive">18</p>
                    </div>
                    <div className="bg-card/50 p-4 rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-2xl font-bold mt-1 text-primary">70%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="space-card animate-fade-in" style={{ animationDelay: "300ms" }}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Friends</CardTitle>
                  <a href="/friends" className="text-sm text-primary hover:underline">
                    View All
                  </a>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You have 3 friends
                  </p>
                  <div className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
                          alt="AstroWanderer"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="status-indicator status-online"></span>
                      </div>
                      <p className="text-xs mt-2">AstroWanderer</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901"
                          alt="CosmicDrifter"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="status-indicator status-online"></span>
                      </div>
                      <p className="text-xs mt-2">CosmicDrifter</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-medium">
                          NN
                        </div>
                        <span className="status-indicator status-away"></span>
                      </div>
                      <p className="text-xs mt-2">NebulaNinja</p>
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

export default Profile;
