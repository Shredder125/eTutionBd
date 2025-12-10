import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Shield, AlertCircle, MapPin, DollarSign, Calendar } from "lucide-react";
import Swal from "sweetalert2";

const ManageTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Data
  const fetchAllTuitions = async () => {
    try {
      const token = localStorage.getItem("access-token");
      // ✅ FIX: Use Environment Variable
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tuitions/admin/all`, {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
          setTuitions(data);
      } else {
          setTuitions([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTuitions();
  }, []);

  // 2. Handle Status Update
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tuitions/status/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      
      if (data.modifiedCount > 0) {
        Swal.fire({
            icon: 'success',
            title: `Marked as ${newStatus}`,
            showConfirmButton: false,
            timer: 1500
        });
        fetchAllTuitions(); // Refresh
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="text-primary" /> Manage Tuitions
        </h1>
        <p className="text-gray-500 text-sm mt-1">Admin Control Panel: Approve or reject student posts.</p>
      </div>

      {tuitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500 font-medium">No tuition posts found.</p>
          </div>
      ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="table w-full">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wide">
                <tr>
                  <th className="py-4 pl-6">Subject & Student</th>
                  <th>Details</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tuitions.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors">
                    <td className="pl-6">
                      <div className="font-bold text-gray-800 text-lg">{item.subject}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Posted by: <span className="font-medium text-gray-700">{item.studentName || item.studentEmail}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <MapPin size={12} className="text-primary"/> {item.location}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Calendar size={12} className="text-primary"/> {item.daysPerWeek} Days/Week
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="flex items-center gap-1 font-bold text-gray-800">
                            <DollarSign size={14} className="text-green-600" /> {item.budget}
                        </div>
                    </td>
                    <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            item.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                            item.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                            {(item.status || "pending").toUpperCase()}
                        </span>
                    </td>
                    <td>
                        <div className="flex justify-center gap-2">
                            <button 
                                onClick={() => handleStatusChange(item._id, 'approved')}
                                className="btn btn-sm btn-square btn-outline btn-success tooltip"
                                data-tip="Approve"
                                disabled={item.status === 'approved'}
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button 
                                onClick={() => handleStatusChange(item._id, 'rejected')}
                                className="btn btn-sm btn-square btn-outline btn-error tooltip"
                                data-tip="Reject"
                                disabled={item.status === 'rejected'}
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
    </div>
  );
};

export default ManageTuitions;