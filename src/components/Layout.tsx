
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Gift, Settings, PanelRight } from "lucide-react";
import Logo from "./Logo";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3">
        <div className="container flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border shrink-0 hidden md:block">
          <nav className="p-4 space-y-2">
            <Link to="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/tasks">
              <Button
                variant={isActive("/tasks") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Gift className="h-4 w-4 mr-2" />
                PTC Tasks
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant={isActive("/admin") ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </nav>
        </aside>

        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background z-10">
          <div className="grid grid-cols-3 gap-1 p-2">
            <Link to="/dashboard" className="flex justify-center">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                className="w-full"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tasks" className="flex justify-center">
              <Button
                variant={isActive("/tasks") ? "default" : "ghost"}
                size="sm"
                className="w-full"
              >
                <Gift className="h-4 w-4" />
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex justify-center">
                <Button
                  variant={isActive("/admin") ? "default" : "ghost"}
                  size="sm"
                  className="w-full"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
          <div className="container max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
