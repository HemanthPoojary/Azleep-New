
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const RedirectToLanding = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect the user if they access the root path directly
    // This is helpful for when we deploy to app.azleep.ai
    if (location.pathname === "/" && window.location.hostname.includes("app.azleep.ai")) {
      navigate("/app/dashboard");
    }
  }, [location.pathname, navigate]);

  return null;
};
