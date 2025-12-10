import React from "react";
import { useUserAuth } from "../context/AuthContext"; 
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // or use your SVG component

const SocialLogin = () => {
    const { googleSignIn } = useUserAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            // ✅ THE MISSING PIECE: Save user to MongoDB
            const userInfo = {
                name: user.displayName,
                email: user.email,
                role: "student", // Default role for Google Logins
                photoURL: user.photoURL
            };

            await fetch(`${import.meta.env.VITE_API_URL}/users`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(userInfo)
            });

            // Navigate after saving
            navigate(from, { replace: true });

        } catch (error) {
            console.error("Google Sign In Error:", error);
        }
    };

    return (
        <button 
            onClick={handleGoogleSignIn} 
            type="button"
            className="group w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all shadow-md border border-gray-200"
        >
            <FcGoogle size={24} />
            Continue with Google
        </button>
    );
};

export default SocialLogin;