
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-night p-4 text-center">
      <div className="sleep-card max-w-md">
        <h1 className="mb-4 text-4xl font-bold text-azleep-text">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Oops! The page you're looking for is missing
        </p>
        <Button asChild className="bg-azleep-primary hover:bg-azleep-primary/90">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
