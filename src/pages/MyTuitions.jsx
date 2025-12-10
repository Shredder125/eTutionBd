import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, DollarSign, BookOpen, AlertCircle, X, Loader2, Layers } from "lucide-react";
import Swal from "sweetalert2";
import { useUserAuth } from "../../context/AuthContext";

const MyTuitions = () => {
  const { user } = useUserAuth();
  const [tuitions, setTuitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    classGrade: "",
    location: "",
    budget: "",
    description: ""
  });

  const fetchMyTuitions = async () => {
    try {
      if (!user?.email) return;
      setIsLoading(true);
      const token = localStorage.getItem("access-token");
      const res = await fetch(`http://localhost:5000/my-tuitions/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setTuitions(data);
      else setTuitions([]);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTuitions();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (tuition = null) => {
    if (tuition) {
      setEditItem(tuition);
      setFormData({
        subject: tuition.subject,
        classGrade: tuition.classGrade,
        location: tuition.location,
        budget: tuition.budget,
        description: tuition.description || ""
      });
    } else {
      setEditItem(null);
      setFormData({ subject: "", classGrade: "", location: "", budget: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access-token");
    const payload = { 
        ...formData, 
        budget: parseInt(formData.budget),
        studentName: user.displayName,
        studentEmail: user.email,
        studentPhoto: user.photoURL
    };

    try {
      if (editItem) {
        const res = await fetch(`http://localhost:5000/tuitions/update/${editItem._id}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Updated!', text: 'Your tuition post has been updated.', timer: 1500, showConfirmButton: false });
          fetchMyTuitions();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("http://localhost:5000/tuitions", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Posted!', text: 'Your tuition request is live.', timer: 1500, showConfirmButton: false });
          fetchMyTuitions();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            const token = localStorage.getItem("access-token");
            const res = await fetch(`http://localhost:5000/tuitions/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
            Swal.fire("Deleted!", "Your post has been deleted.", "success");
            setTuitions(tuitions.filter(t => t._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-200 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Tuition Posts</h1>
            <p className="text-gray-500 mt-1">Manage and track your active tuition requests.</p>
          </div>
          <button onClick={() => openModal()} className="btn btn-primary text-white shadow-lg gap-2">
            <Plus size={20} /> Post New Tuition
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {!isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((item) => (
              <div key={item._id} className="card bg-white shadow-sm border border-base-300 hover:shadow-md transition-all group">
                <div className="card-body p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`badge font-bold py-3 
                      ${item.status === 'approved' ? 'badge-success text-white' 
                      : item.status === 'rejected' ? 'badge-error text-white' 
                      : 'badge-warning text-white'}`}>
                      {(item.status || 'pending').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="card-title text-xl text-gray-800">{item.subject}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                     <Layers size={14} /> {item.classGrade}
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-primary" /> 
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign size={18} className="text-primary" /> 
                      <span className="font-bold text-gray-800">{item.budget} INR</span> / month
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-auto pt-4 border-t border-base-200">
                    <button onClick={() => openModal(item)} className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50 gap-2">
                      <Edit size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 gap-2">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && tuitions.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
             <div className="bg-base-200 p-5 rounded-full mb-4">
                <AlertCircle className="h-10 w-10 text-gray-400" />
             </div>
             <h3 className="text-xl font-bold text-gray-700">No Posts Yet</h3>
             <p className="text-gray-500 mb-6 mt-1">You haven't posted any tuition requests.</p>
             <button onClick={() => openModal()} className="btn btn-primary btn-sm px-6">Create Your First Post</button>
           </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {editItem ? <Edit size={20} className="text-primary"/> : <Plus size={20} className="text-primary"/>}
                    {editItem ? "Update Tuition Post" : "Post New Tuition"}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">
                    <X size={20} />
                  </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label text-xs font-semibold text-gray-500 uppercase">Subject</label>
                            <div className="relative">
                                <BookOpen size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                                <input name="subject" value={formData.subject} onChange={handleInputChange} required className="input input-bordered w-full pl-10 focus:input-primary" placeholder="e.g. Mathematics" />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-semibold text-gray-500 uppercase">Class/Grade</label>
                             <div className="relative">
                                <Layers size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                                <select name="classGrade" value={formData.classGrade} onChange={handleInputChange} required className="select select-bordered w-full pl-10 focus:select-primary">
                                    <option value="" disabled>Select Class</option>
                                    <option value="Class 1-5">Class 1-5</option>
                                    <option value="Class 6-8">Class 6-8</option>
                                    <option value="CBSE / ICSE">CBSE / ICSE</option>
                                    <option value="State Board">State Board</option>
                                    <option value="University">University</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label text-xs font-semibold text-gray-500 uppercase">Location</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                            <input name="location" value={formData.location} onChange={handleInputChange} required className="input input-bordered w-full pl-10 focus:input-primary" placeholder="e.g. Mumbai, Delhi" />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label text-xs font-semibold text-gray-500 uppercase">Monthly Budget (INR)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                            <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} required className="input input-bordered w-full pl-10 focus:input-primary" placeholder="e.g. 5000" />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label text-xs font-semibold text-gray-500 uppercase">Description (Optional)</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} className="textarea textarea-bordered w-full h-24 focus:textarea-primary" placeholder="Specific requirements (e.g., 3 days a week)..."></textarea>
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full text-white font-bold">
                            {isSubmitting ? <span className="loading loading-spinner"></span> : editItem ? "Save Changes" : "Submit Post"}
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyTuitions;
