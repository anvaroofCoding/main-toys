import { useEffect, useState } from "react";
import DesktopNavbar from "./navbar-desktop";
import MobileNavbar from "./navbar-mobile";

const ResponsiveNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <MobileNavbar />
  ) : (
    <div className="w-full">
      <DesktopNavbar />
      <div className="h-20 w-full "></div>
    </div>
  );
};

export default ResponsiveNavbar;
