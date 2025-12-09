import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { Check, X, User, DollarSign, BookOpen, Clock, AlertCircle } from "lucide-react";

const AppliedTutors = () => {
  const { user } = useUserAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch received applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!user?.email) return;
        const token = localStorage.getItem("access-token");
        
        const res = await fetch(`http://localhost:5000/applications/received/${user.email}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (Array.isArray(data)) {
            setApplications(data);
        } else {
            setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  // Handle Reject
  const handleReject = async (id) => {
    if (!window.confirm("Reject this tutor? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`http://localhost:5000/applications/reject/${id}`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        // Update UI locally
        setApplications(prev => prev.map(app => 
            app._id === id ? { ...app, status: 'rejected' } : app
        ));
      }
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };

  // Handle Approve (Placeholder for Payment)
  const handleApprove = (app) => {
    alert(`This will redirect to payment for ${app.tutorName}. (Feature coming in next step)`);
  };

  if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
           <User className="text-primary" /> Tutor Applications
        </h1>
        <p className="text-gray-500 text-sm mt-1">Review tutors who applied to your posts.</p>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
           <div className="bg-gray-50 p-4 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
           </div>
           <p className="text-gray-500 font-medium">No tutors have applied to your posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
              
              {/* Status Banner */}
              <div className={`absolute top-0 left-0 w-1 h-full 
                ${app.status === 'approved' ? 'bg-green-500' : app.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
              </div>

              {/* Header: Subject & Tutor Name */}
              <div className="pl-2">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{app.tutorName}</h3>
                        <p className="text-sm text-gray-500">{app.tutorEmail}</p>
                    </div>
                    <span className={`badge border-0 font-bold ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        app.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        'bg-red-100 text-red-700'
                    }`}>
                        {app.status.toUpperCase()}
                    </span>
                </div>

                <div className="bg-base-100 p-3 rounded-lg space-y-2 mb-4 border border-base-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <BookOpen size={16} className="text-primary" /> 
                        Applied for: <span className="font-bold text-gray-900">{app.tuitionData?.subject || "Unknown Post"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <DollarSign size={16} className="text-green-600" /> 
                        Expected Salary: <span className="font-bold text-gray-900">৳ {app.expectedSalary}</span>
                    </div>
                </div>
              </div>

              {/* Actions */}
              {app.status === 'pending' && (
                  <div className="flex gap-3 mt-2 pl-2">
                    <button 
                        onClick={() => handleReject(app._id)}
                        className="btn btn-outline btn-error btn-sm flex-1 gap-2"
                    >
                        <X size={16} /> Reject
                    </button>
                    <button 
                        onClick={() => handleApprove(app)}
                        className="btn btn-primary btn-sm flex-1 text-white gap-2"
                    >
                        <Check size={16} /> Accept
                    </button>
                  </div>
              )}
              
              {app.status === 'rejected' && (
                  <p className="text-center text-red-500 text-sm font-medium mt-2 bg-red-50 py-2 rounded-lg">Application Rejected</p>
              )}
               {app.status === 'approved' && (
                  <p className="text-center text-green-600 text-sm font-bold mt-2 bg-green-50 py-2 rounded-lg flex items-center justify-center gap-2">
                      <Check size={16}/> Hired Successfully
                  </p>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedTutors;