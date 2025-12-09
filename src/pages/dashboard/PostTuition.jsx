import React, { useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, MapPin, DollarSign, Layers, FileText, Loader2, CheckCircle } from "lucide-react";

const PostTuition = () => {
  const { user } = useUserAuth(); 
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePostTuition = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const subject = form.subject.value;
    const classGrade = form.classGrade.value;
    const location = form.location.value;
    const budget = form.budget.value;
    const description = form.description.value;

    const newTuition = {
      studentName: user?.displayName,
      studentEmail: user?.email,
      studentPhoto: user?.photoURL,
      subject,
      classGrade,
      location,
      budget: parseInt(budget),
      description,
    };

    try {
      // ✅ FIX: Get the Custom Token from Local Storage
      const token = localStorage.getItem('access-token');

      if (!token) {
        alert("Authentication token missing. Please logout and login again.");
        setLoading(false);
        return;
      }

      // 2. Send Data to Your Backend
      const response = await fetch("http://localhost:5000/tuitions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`, // Sending the correct token
        },
        body: JSON.stringify(newTuition),
      });

      const data = await response.json();

      if (data.insertedId) {
        setSuccess(true);
        form.reset();
        setTimeout(() => navigate("/dashboard/my-tuitions"), 2000);
      } else {
        // Handle backend errors (like forbidden access)
        alert(data.message || "Failed to post tuition");
      }
    } catch (error) {
      console.error("Error posting tuition:", error);
      alert("Failed to post tuition. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Tuition Posted Successfully!</h2>
        <p className="text-gray-500 mt-2">Admins will review your post shortly.</p>
        <button onClick={() => setSuccess(false)} className="mt-6 btn btn-outline btn-sm">Post Another</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-primary" /> Post New Tuition
        </h1>
        <p className="text-gray-500 text-sm mt-1">Fill out the form below to find the perfect tutor.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-base-200 p-6 md:p-8">
        <form onSubmit={handlePostTuition} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Subject</span></label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input type="text" name="subject" placeholder="e.g. Mathematics, English" className="input input-bordered w-full pl-10 focus:input-primary" required />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Class / Grade</span></label>
              <div className="relative">
                <Layers className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select name="classGrade" className="select select-bordered w-full pl-10 focus:select-primary" required defaultValue="">
                  <option value="" disabled>Select Class</option>
                  <option value="Class 1-5">Class 1-5</option>
                  <option value="Class 6-8">Class 6-8</option>
                  <option value="SSC / O-Level">SSC / O-Level</option>
                  <option value="HSC / A-Level">HSC / A-Level</option>
                  <option value="University">University</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Location</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input type="text" name="location" placeholder="e.g. Dhanmondi, Dhaka" className="input input-bordered w-full pl-10 focus:input-primary" required />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Monthly Budget (BDT)</span></label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input type="number" name="budget" placeholder="e.g. 5000" className="input input-bordered w-full pl-10 focus:input-primary" required />
              </div>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium">Description / Requirements</span></label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea name="description" className="textarea textarea-bordered h-24 w-full pl-10 focus:textarea-primary" placeholder="Describe your requirements..." required></textarea>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full text-white font-bold text-lg shadow-lg"
            >
              {loading ? (
                <> <Loader2 className="animate-spin mr-2" /> Posting... </>
              ) : (
                "Post Tuition Request"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostTuition;