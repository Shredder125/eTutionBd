import React, { useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { User, Mail, Camera, Save, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

const Profile = () => {
  const { user } = useUserAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update Firebase Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL
      });

      // 2. Update Database Record
      const token = localStorage.getItem("access-token");
      const res = await fetch(`http://localhost:5000/users/update/${user.email}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, photoURL })
      });
      
      const data = await res.json();

      if (data.modifiedCount > 0 || res.ok) {
        Swal.fire("Success", "Profile updated successfully!", "success");
        // Optional: Force reload to see changes immediately in navbar
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-primary" /> My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        
        {/* Left: Avatar Preview */}
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
            <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={photoURL || "https://placehold.co/100"} alt="Avatar" />
                </div>
            </div>
            <p className="text-xs text-gray-400 text-center">Preview of your profile picture</p>
        </div>

        {/* Right: Form */}
        <form onSubmit={handleUpdate} className="flex-1 space-y-4">
            
            <div className="form-control">
                <label className="label"><span className="label-text font-medium">Full Name</span></label>
                <div className="relative">
                    <User size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full pl-10 focus:input-primary"
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-medium">Email (Read Only)</span></label>
                <div className="relative">
                    <Mail size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input 
                        type="text" 
                        value={user?.email} 
                        disabled 
                        className="input input-bordered w-full pl-10 bg-gray-50" 
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-medium">Photo URL</span></label>
                <div className="relative">
                    <Camera size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input 
                        type="text" 
                        value={photoURL} 
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="input input-bordered w-full pl-10 focus:input-primary"
                    />
                </div>
                <label className="label">
                    <span className="label-text-alt text-gray-400">Paste a direct image link here.</span>
                </label>
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary text-white w-full gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;