import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-serif font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <p className="mb-8 text-sm text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
