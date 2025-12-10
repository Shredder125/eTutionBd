import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Edit, Trash2, MapPin, CheckCircle, Clock, XCircle } from "lucide-react";

const MyTuitions = () => {
  const { user } = useUserAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTuitions = async () => {
    try {
      if (!user?.email) return;
      const token = localStorage.getItem('access-token');
      const response = await fetch(`http://localhost:5000/my-tuitions/${user.email}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setTuitions(data);
      } else {
        setTuitions([]);
      }
    } catch (error) {
      setTuitions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem('access-token');
      const res = await fetch(`http://localhost:5000/tuitions/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.deletedCount > 0) {
        setTuitions(tuitions.filter((t) => t._id !== id));
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMyTuitions();
  }, [user]);

  if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">My Tuition Posts</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your active tuition requests</p>
        </div>
        <Link to="/dashboard/post-tuition" className="btn btn-primary text-white shadow-lg">
           + Post New Tuition
        </Link>
      </div>

      {tuitions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
             <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No Posts Yet</h3>
          <p className="text-gray-500 mb-6">You haven't posted any tuition requests.</p>
          <Link to="/dashboard/post-tuition" className="btn btn-outline btn-primary btn-sm">Create First Post</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="py-4 pl-6">Subject Info</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tuitions.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                  <td className="pl-6">
                    <div className="font-bold text-gray-800 text-lg">{item.subject}</div>
                    <div className="badge badge-ghost badge-sm text-gray-500 mt-1 font-normal">
                      {item.classGrade}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                      <MapPin size={16} className="text-gray-400" /> {item.location || "Mumbai, India"}
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-primary text-lg">
                       ₹ {item.budget}
                    </div>
                    <span className="text-xs text-gray-400">/month</span>
                  </td>
                  <td>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        item.status === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : item.status === "rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                      {item.status === 'approved' && <CheckCircle size={12} />}
                      {item.status === 'rejected' && <XCircle size={12} />}
                      {item.status === 'pending' && <Clock size={12} />}
                      {(item.status || "pending").toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        className="btn btn-square btn-sm btn-ghost text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        title="Edit Post"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-square btn-sm btn-ghost text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
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

export default MyTuitions;
