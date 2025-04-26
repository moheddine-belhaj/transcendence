
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-space-gradient flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Space stars background effect */}
            <div className="absolute h-2 w-2 bg-white rounded-full top-[10%] left-[25%] animate-pulse-slow"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-[30%] left-[80%] animate-pulse-slow"></div>
            <div className="absolute h-3 w-3 bg-white rounded-full top-[40%] left-[10%] animate-pulse-slow"></div>
            <div className="absolute h-2 w-2 bg-white rounded-full top-[70%] left-[60%] animate-pulse-slow"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-[85%] left-[20%] animate-pulse-slow"></div>
            <div className="absolute h-2 w-2 bg-white rounded-full top-[20%] left-[40%] animate-pulse-slow"></div>
          </div>
          
          <div className="max-w-3xl mx-auto z-10 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Connect with Friends{" "}
              <span className="bg-clip-text text-transparent bg-purple-gradient">Across the Cosmos</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover new friends, share experiences, and explore the universe together with our space-themed social platform.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-purple-gradient">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-purple-gradient">
                      Join the Cosmos
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Already a Space Explorer?
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-10">
            <div className="space-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M17 11l-5-5-5 5"></path>
                  <path d="M17 18l-5-5-5 5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Find Friends</h3>
              <p className="text-muted-foreground">Connect with like-minded space enthusiasts from around the world.</p>
            </div>
            
            <div className="space-card p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Chat Instantly</h3>
              <p className="text-muted-foreground">Communicate in real-time with your cosmic connections.</p>
            </div>
            
            <div className="space-card p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  <path d="M19.5 12.572 12 20l-3-3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Join Games</h3>
              <p className="text-muted-foreground">Play exciting space-themed games with your new friends.</p>
            </div>
          </div>
        </section>
        
        <footer className="bg-card border-t border-border py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">
              © 2025 SpaceFriends. All rights reserved. Find friends across the cosmos.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
