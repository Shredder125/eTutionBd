import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, MapPin, DollarSign, Layers, FileText, Loader2, Save } from "lucide-react";

const UpdateTuition = () => {
  const { id } = useParams(); // Get the ID from the URL
  const { user } = useUserAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`http://localhost:5000/tuitions/${id}`, {
            headers: { authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // 2. Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
        const token = localStorage.getItem('access-token');
        const response = await fetch(`http://localhost:5000/tuitions/update/${id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (result.modifiedCount > 0) {
            alert("Updated Successfully!");
            navigate("/dashboard/my-tuitions");
        }
    } catch (error) {
        console.error(error);
    } finally {
        setUpdating(false);
    }
  };

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <EditIcon /> Edit Tuition Post
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-base-200 p-6 md:p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Subject</span></label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="input input-bordered w-full pl-10" required />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Class / Grade</span></label>
              <div className="relative">
                <Layers className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select name="classGrade" value={formData.classGrade} onChange={handleChange} className="select select-bordered w-full pl-10" required>
                  <option value="Class 1-5">Class 1-5</option>
                  <option value="Class 6-8">Class 6-8</option>
                  <option value="SSC / O-Level">SSC / O-Level</option>
                  <option value="HSC / A-Level">HSC / A-Level</option>
                  <option value="University">University</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Location</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="input input-bordered w-full pl-10" required />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Monthly Budget</span></label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="input input-bordered w-full pl-10" required />
              </div>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium">Description</span></label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered h-24 w-full pl-10"></textarea>
            </div>
          </div>

          <button type="submit" disabled={updating} className="btn btn-primary w-full text-white">
            {updating ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Post</>}
          </button>

        </form>
      </div>
    </div>
  );
};

// Simple Icon component for the header
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export default UpdateTuition;