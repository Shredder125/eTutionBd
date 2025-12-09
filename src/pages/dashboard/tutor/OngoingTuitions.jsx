import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../../context/AuthContext";
import { Briefcase, CheckCircle, MapPin, DollarSign, Loader2 } from "lucide-react";

const OngoingTuitions = () => {
  const { user } = useUserAuth();
  const [ongoingTuitions, setOngoingTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOngoing = async () => {
      try {
        const token = localStorage.getItem("access-token");
        // Reuse the existing applications route and filter client-side
        const res = await fetch(`http://localhost:5000/applications/tutor/${user.email}`, {
            headers: { authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        // Filter for only 'approved' status
        const approvedTuitions = data.filter(app => app.status === 'approved');
        setOngoingTuitions(approvedTuitions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchOngoing();
  }, [user]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="text-green-500" /> Ongoing Tuitions
        </h1>
        <p className="text-gray-500 text-sm mt-1">Tuition jobs that have been accepted and paid by the student.</p>
      </div>

      {ongoingTuitions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">You do not have any ongoing tuitions yet.</p>
          </div>
      ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {ongoingTuitions.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-xl shadow-lg border border-green-200 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>

                <div className="pl-2">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-green-700">{app.tuitionData?.subject}</h3>
                        <div className="badge badge-success text-white font-bold py-3">
                            ACTIVE
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                        <MapPin size={14} /> {app.tuitionData?.location}
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg space-y-2 text-sm text-gray-600 border border-green-100">
                        <div className="flex justify-between items-center">
                            <span>Your Salary:</span>
                            <span className="font-bold text-primary">৳ {app.expectedSalary}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Student Email:</span>
                            <span className="font-bold">{app.tuitionData?.studentEmail}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-green-600 font-medium">
                        <CheckCircle size={18} /> Payment Confirmed
                    </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default OngoingTuitions;