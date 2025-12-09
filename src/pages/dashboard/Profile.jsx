import React, { useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { User, Mail, Camera, Save, Loader2, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

const Profile = () => {
  const { user } = useUserAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || ""); // Used for pasting URL or final state
  const [imageFile, setImageFile] = useState(null); // State for the file selected by user
  const [loading, setLoading] = useState(false);

  // --- PLACEHOLDER UPLOAD FUNCTION (MUST BE REPLACED) ---
  const uploadImageToHost = async (file) => {
    // **
    // ** IMPORTANT: Replace this entire block with your actual Firebase Storage / ImgBB / Cloudinary logic.
    // ** This placeholder simulates a successful upload and returns a placeholder URL.
    // **
    Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while the image is processed.',
        didOpen: () => Swal.showLoading()
    });

    // --- SIMULATION ---
    return new Promise(resolve => {
        setTimeout(() => {
            const simulatedURL = `https://picsum.photos/300/300?random=${Date.now()}`;
            Swal.close();
            resolve(simulatedURL);
        }, 2500); // Simulate network delay
    });
  };

  // --- FORM SUBMISSION ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalPhotoURL = photoURL; // Start with existing or manually pasted URL

    try {
      // 1. Handle File Upload if a new file is selected
      if (imageFile) {
        finalPhotoURL = await uploadImageToHost(imageFile);
      }

      // 2. Update Firebase Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: finalPhotoURL
      });
      
      // 3. Update Database Record
      const token = localStorage.getItem("access-token");
      // CRITICAL: Changed localhost to /api for deployment readiness
      const res = await fetch(`/api/users/update/${user.email}`, { 
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, photoURL: finalPhotoURL })
      });
      
      const data = await res.json();

      if (data.modifiedCount > 0 || res.ok) {
        Swal.fire("Success", "Profile updated successfully!", "success");
        // Update local state and reload to see changes immediately in navbar
        setPhotoURL(finalPhotoURL); 
        setImageFile(null); // Clear selected file
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
    } else {
        setImageFile(null);
    }
  };


  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-primary" /> My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and profile picture.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        
        {/* Left: Avatar Preview */}
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
            <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {/* Preview the new selected file or the existing URL */}
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : photoURL || "https://placehold.co/100"} 
                      alt="Avatar" 
                    />
                </div>
            </div>
            {/* Display message if a file is ready to be uploaded */}
            {imageFile && (
                <span className="text-xs text-green-600 bg-green-50 p-2 rounded-lg flex items-center gap-1">
                    <UploadCloud size={14} /> Ready to upload: {imageFile.name}
                </span>
            )}
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
            
            {/* --- NEW FILE UPLOAD FIELD --- */}
            <div className="form-control pt-2">
                <label className="label"><span className="label-text font-medium">Upload New Photo</span></label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered file-input-primary w-full" 
                />
                <label className="label">
                    <span className="label-text-alt text-gray-400">If a file is selected, it will override the Photo URL field.</span>
                </label>
            </div>
            
            {/* --- OPTIONAL PHOTO URL INPUT --- */}
            <div className="form-control">
                <label className="label"><span className="label-text font-medium">Photo URL (Fallback)</span></label>
                <div className="relative">
                    <Camera size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input 
                        type="text" 
                        value={photoURL} 
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="Paste image link here"
                        // Disable if user has selected a file to force them to use the upload
                        disabled={!!imageFile} 
                        className={`input input-bordered w-full pl-10 focus:input-primary ${imageFile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                </div>
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