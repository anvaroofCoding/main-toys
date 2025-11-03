import { Outlet } from "react-router-dom";
import FloatingCallButton from "./components/fixedButton";
import Footer from "./shared/footer";
import ResponsiveNavbar from "./shared/navbar-responsive";

const App = () => {
  return (
    <div>
      <ResponsiveNavbar />
      <Outlet />
      <FloatingCallButton />
      <Footer />
    </div>
  );
};

export default App;
