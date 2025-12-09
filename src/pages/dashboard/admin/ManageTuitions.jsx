import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../../context/AuthContext";
import { CheckCircle, XCircle, Shield, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

const ManageTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Data (Pending, Approved, Rejected)
  const fetchAllTuitions = async () => {
    try {
      const token = localStorage.getItem("access-token");
      // FIX 1: Replace localhost URL with /api
      const res = await fetch("/api/tuitions/admin/all", {
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

  // 2. Handle Status Update (Approve/Reject)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("access-token");
      // FIX 2: Replace localhost URL with /api
      const res = await fetch(`/api/tuitions/status/${id}`, {
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
        fetchAllTuitions(); // Refresh the list
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
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th>Subject & Student</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tuitions.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0">
                    <td>
                      <div className="font-bold text-gray-800">{item.subject}</div>
                      <div className="text-xs text-gray-500">
                        {item.studentName || item.studentEmail}
                      </div>
                    </td>
                    <td>{item.location}</td>
                    <td className="font-bold text-primary">৳ {item.budget}</td>
                    <td>
                        <div className={`badge font-bold py-3 border-0 ${
                            item.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            item.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {(item.status || "pending").toUpperCase()}
                        </div>
                    </td>
                    <td>
                        <div className="flex justify-center gap-2">
                            <button 
                                onClick={() => handleStatusChange(item._id, 'approved')}
                                className="btn btn-sm btn-circle btn-ghost text-green-600 hover:bg-green-50 tooltip"
                                data-tip="Approve"
                                disabled={item.status === 'approved'}
                            >
                                <CheckCircle size={20} />
                            </button>
                            <button 
                                onClick={() => handleStatusChange(item._id, 'rejected')}
                                className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-50 tooltip"
                                data-tip="Reject"
                                disabled={item.status === 'rejected'}
                            >
                                <XCircle size={20} />
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