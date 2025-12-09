import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, DollarSign, BookOpen, AlertCircle, X, Loader2 } from "lucide-react";
import Swal from "sweetalert2"; // For the confirmation popup

const MyTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for the form (Add/Edit)
  const [editItem, setEditItem] = useState(null); // If null, we are adding. If set, we are editing.
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    location: "",
    budget: "",
    days: "",
    description: "" // Added extra field
  });

  // 1. FETCH MY TUITIONS
  const fetchMyTuitions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access-token");
      // Assuming you store user info in localStorage or Context. 
      // For now, let's decode or grab email from storage/context. 
      // REPLACE THIS with your actual user email source.
      const userEmail = "mark.lopez@example.com"; // HARDCODED FOR DEMO. Use user.email from context!

      const res = await fetch(`http://localhost:5000/my-tuitions/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTuitions(data);
    } catch (error) {
      console.error("Error fetching tuitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTuitions();
  }, []);

  // 2. HANDLE FORM INPUT
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. OPEN MODAL (ADD vs EDIT)
  const openModal = (tuition = null) => {
    if (tuition) {
      // EDIT MODE: Pre-fill data
      setEditItem(tuition);
      setFormData({
        subject: tuition.subject,
        class: tuition.class,
        location: tuition.location,
        budget: tuition.budget,
        days: tuition.days,
        description: tuition.description || ""
      });
    } else {
      // ADD MODE: Reset form
      setEditItem(null);
      setFormData({ subject: "", class: "", location: "", budget: "", days: "", description: "" });
    }
    setIsModalOpen(true);
  };

  // 4. SUBMIT FORM (CREATE OR UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access-token");
    const userEmail = "mark.lopez@example.com"; // REPLACE with context user.email

    try {
      if (editItem) {
        // --- UPDATE EXISTING ---
        const res = await fetch(`http://localhost:5000/tuitions/update/${editItem._id}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          Swal.fire("Updated!", "Your tuition post has been updated.", "success");
          fetchMyTuitions(); // Refresh list
          setIsModalOpen(false);
        }
      } else {
        // --- CREATE NEW ---
        const payload = { ...formData, email: userEmail, status: "pending" };
        const res = await fetch("http://localhost:5000/tuitions", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          Swal.fire("Posted!", "Your tuition request is pending approval.", "success");
          fetchMyTuitions(); // Refresh list
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. DELETE TUITION
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
        const token = localStorage.getItem("access-token");
        const res = await fetch(`http://localhost:5000/tuitions/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
          setTuitions(tuitions.filter(t => t._id !== id)); // Remove locally
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-12 px-6 font-sans text-neutral-200">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Tuition Posts</h1>
            <p className="text-neutral-400">Manage your posted tuition requests.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="btn btn-primary bg-purple-600 hover:bg-purple-700 text-white border-none gap-2"
          >
            <Plus size={18} /> Post Tuition
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-500 h-10 w-10" />
          </div>
        )}

        {/* LIST OF TUITIONS */}
        {!isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((item) => (
              <div key={item._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                    ${item.status === 'approved' ? 'bg-green-500/10 text-green-500' 
                    : item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' 
                    : 'bg-red-500/10 text-red-500'}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{item.subject}</h3>
                <p className="text-purple-400 font-medium text-sm mb-4">{item.class}</p>

                <div className="space-y-2 text-sm text-neutral-400 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} /> {item.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} /> {item.budget} BDT
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} /> {item.days}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-800">
                  <button 
                    onClick={() => openModal(item)}
                    className="flex-1 btn btn-sm btn-outline border-neutral-700 hover:bg-neutral-800 text-neutral-300 gap-2"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-sm btn-outline border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500 gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && tuitions.length === 0 && (
           <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800">
             <AlertCircle className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
             <h3 className="text-xl font-bold text-white">No Posts Yet</h3>
             <p className="text-neutral-500 mb-6">You haven't posted any tuition requests.</p>
             <button onClick={() => openModal()} className="btn btn-primary btn-sm">Post Your First Tuition</button>
           </div>
        )}

        {/* --- MODAL (CREATE / EDIT) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6">
                {editItem ? "Update Tuition Post" : "Post New Tuition"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-xs text-neutral-400">Subject</label>
                    <input name="subject" value={formData.subject} onChange={handleInputChange} required className="input input-bordered bg-neutral-950 border-neutral-800 text-white focus:border-purple-500" placeholder="e.g. Math" />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs text-neutral-400">Class/Grade</label>
                    <input name="class" value={formData.class} onChange={handleInputChange} required className="input input-bordered bg-neutral-950 border-neutral-800 text-white focus:border-purple-500" placeholder="e.g. Class 10" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-xs text-neutral-400">Location</label>
                  <input name="location" value={formData.location} onChange={handleInputChange} required className="input input-bordered bg-neutral-950 border-neutral-800 text-white focus:border-purple-500" placeholder="e.g. Dhanmondi, Dhaka" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-xs text-neutral-400">Budget (BDT)</label>
                    <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} required className="input input-bordered bg-neutral-950 border-neutral-800 text-white focus:border-purple-500" placeholder="e.g. 5000" />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs text-neutral-400">Days per week</label>
                    <input name="days" value={formData.days} onChange={handleInputChange} required className="input input-bordered bg-neutral-950 border-neutral-800 text-white focus:border-purple-500" placeholder="e.g. 3 days" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-xs text-neutral-400">Description (Optional)</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="textarea textarea-bordered bg-neutral-950 border-neutral-800 text-white focus:border-purple-500 h-24" placeholder="Any specific requirements..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 text-white mt-4 border-none"
                >
                  {isSubmitting ? "Saving..." : editItem ? "Update Post" : "Submit Post"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyTuitions;