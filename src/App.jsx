import { Outlet } from "react-router-dom";
import FloatingCallButton from "./components/fixedButton";
import ResponsiveNavbar from "./shared/navbar-responsive";

const App = () => {
  return (
    <div>
      <ResponsiveNavbar />
      <Outlet />
      <FloatingCallButton />
    </div>
  );
};

export default App;
