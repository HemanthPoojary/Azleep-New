
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-night p-4">
      <header className="w-full p-4">
        <Logo />
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="sleep-card max-w-md text-center">
          <h1 className="mb-4 text-4xl font-bold text-azleep-text">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">
            Oops! The page you're looking for is missing
          </p>
          <Button asChild className="bg-azleep-primary hover:bg-azleep-primary/90">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
