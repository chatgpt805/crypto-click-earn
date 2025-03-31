
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Logo />
      
      <h1 className="mt-8 text-4xl font-bold">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">Oops! Page not found</p>
      
      <p className="mt-2 text-center text-muted-foreground max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Button asChild className="mt-8">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
