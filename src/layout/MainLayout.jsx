import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
    return (
        <div>
            {/* Navbar is fixed, so no padding needed here inside the nav component, 
                but we add padding-top to the content below so it doesn't hide behind navbar */}
            <Navbar />
            
            <div className="pt-16 min-h-[calc(100vh-68px)]">
                <Outlet />
            </div>
            
            <Footer />
            <Toaster />
        </div>
    );
};

export default MainLayout;