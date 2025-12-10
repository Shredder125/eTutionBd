import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom"; 
import { 
  Briefcase, Clock, CheckCircle, XCircle, MapPin, 
  Loader2, Edit, Trash2 
} from "lucide-react";
import Swal from "sweetalert2"; 

const MyApplications = () => {
  const { user } = useUserAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const fetchMyApplications = async () => {
    try {
      if (!user?.email) return;
      const token = localStorage.getItem("access-token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/tutor/${user.email}`, {
        headers: { authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        setApplications([]);
        return;
      }
      
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchMyApplications();
  }, [user]);

  const handleWithdraw = async (id) => {
    Swal.fire({
      title: "Withdraw Application?",
      text: "This will permanently delete your application. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Withdraw"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("access-token");
          const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
            method: "DELETE",
            headers: { authorization: `Bearer ${token}` },
          });

          const result = await res.json();
          
          if (result.deletedCount > 0) {
            setApplications(prev => prev.filter(app => app._id !== id));
            Swal.fire("Withdrawn!", "Your application has been deleted.", "success");
          }
        } catch (error) {
          console.error("Error withdrawing:", error);
          Swal.fire("Error", "Failed to withdraw application.", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Briefcase className="text-primary" /> My Applications
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track the status of your tuition applications in India.</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">You haven't applied to any tuitions yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {applications.map((app) => {
            const isActionable = app.status !== 'approved' && app.status !== 'rejected';
            
            return (
              <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden">
                
                <div className={`absolute left-0 top-0 h-full w-1 ${
                  app.status === 'approved' ? 'bg-green-500' : 
                  app.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>

                <div className="pl-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{app.tuitionData?.subject || "Unknown Post"}</h3>
                    <div className={`badge font-bold py-3 border-0 ${
                      app.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                    <MapPin size={14} /> {app.tuitionData?.location || "Mumbai, India"}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm text-gray-600 border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">₹ Expected Salary:</span>
                      <span className="font-bold text-primary">₹ {app.expectedSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Experience:</span>
                      <span className="font-bold">{app.experience}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <div className="flex-1">
                      {app.status === 'approved' ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-2 rounded-lg justify-center text-sm">
                          <CheckCircle size={18} /> Application Accepted!
                        </div>
                      ) : app.status === 'rejected' ? (
                        <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 p-2 rounded-lg justify-center text-sm">
                          <XCircle size={18} /> Application Rejected
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-600 font-medium bg-yellow-50 p-2 rounded-lg justify-center text-sm">
                          <Clock size={18} /> Pending Approval
                        </div>
                      )}
                    </div>

                    {isActionable && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/dashboard/update-application/${app._id}`)}
                          className="btn btn-sm btn-square btn-outline btn-info tooltip tooltip-top"
                          data-tip="Edit Application"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          className="btn btn-sm btn-square btn-outline btn-error tooltip tooltip-top"
                          data-tip="Withdraw"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
