
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SF</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-purple-gradient">SpaceFriends</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/friends" className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md transition-colors">
                    Friends
                  </Link>
                  <Link to="/profile" className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md transition-colors">
                    Profile
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={logout}
                    className="text-foreground/80 hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md transition-colors">
                    Login
                  </Link>
                  <Link to="/register">
                    <Button className="bg-purple-gradient hover:opacity-90 transition-opacity">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu button - simplified for this example */}
            <button className="p-2 rounded-md text-foreground hover:text-primary">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
