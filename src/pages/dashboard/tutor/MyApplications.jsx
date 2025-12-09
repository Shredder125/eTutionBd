import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../../context/AuthContext";
import { Briefcase, Clock, CheckCircle, XCircle, MapPin, DollarSign, Loader2 } from "lucide-react";

const MyApplications = () => {
  const { user } = useUserAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const token = localStorage.getItem("access-token");
        // Use the new route we just added
        const res = await fetch(`http://localhost:5000/applications/tutor/${user.email}`, {
            headers: { authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchMyApplications();
  }, [user]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="text-primary" /> My Applications
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track the status of your tuition applications.</p>
      </div>

      {applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">You haven't applied to any tuitions yet.</p>
          </div>
      ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden">
                
                {/* Status Bar */}
                <div className={`absolute left-0 top-0 h-full w-1 ${
                    app.status === 'approved' ? 'bg-green-500' : 
                    app.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>

                <div className="pl-2">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{app.tuitionData?.subject}</h3>
                        <div className={`badge font-bold py-3 border-0 ${
                            app.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {app.status.toUpperCase()}
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                        <MapPin size={14} /> {app.tuitionData?.location}
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm text-gray-600 border border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1"><DollarSign size={14}/> Expected Salary:</span>
                            <span className="font-bold text-primary">৳ {app.expectedSalary}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Your Experience:</span>
                            <span className="font-bold">{app.experience}</span>
                        </div>
                    </div>

                    <div className="mt-4">
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
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default MyApplications;