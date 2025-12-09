import React, { useEffect, useState } from "react";
import { Users, Trash2, Shield, GraduationCap, User, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";
import { useUserAuth } from "../../../context/AuthContext";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useUserAuth();

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch("http://localhost:5000/users", {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 1. Calculate how many admins exist
  const adminCount = users.filter(u => u.role === 'admin').length;

  // Handle Role Change
  const handleMakeRole = async (targetUser, role) => {
    // SECURITY CHECK: If I am changing my own role to non-admin...
    if (targetUser.email === currentUser.email && role !== 'admin') {
        if (adminCount <= 1) {
            Swal.fire("Action Blocked", "You are the only Admin. You must make someone else an Admin before you can leave.", "error");
            return;
        }
    }

    const token = localStorage.getItem("access-token");
    const res = await fetch(`http://localhost:5000/users/role/${targetUser._id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: role })
    });
    const data = await res.json();
    if (data.modifiedCount > 0) {
        Swal.fire("Success", `${targetUser.name} is now a ${role}`, "success");
        fetchUsers();
    }
  };

  // Handle Delete
  const handleDelete = (targetUser) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const token = localStorage.getItem("access-token");
            const res = await fetch(`http://localhost:5000/users/${targetUser._id}`, {
                method: "DELETE",
                headers: { authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.deletedCount > 0) {
                Swal.fire("Deleted!", "User has been deleted.", "success");
                fetchUsers();
            }
        }
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="text-primary" /> Manage Users
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50 uppercase text-xs">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => {
                const isMe = currentUser.email === item.email;
                
                return (
                  <tr key={item._id} className={`hover:bg-gray-50 ${isMe ? "bg-blue-50/30" : ""}`}>
                    <td>
                        <div className="flex items-center gap-3">
                            <div className="avatar">
                                <div className="mask mask-squircle w-10 h-10">
                                    <img src={item.photoURL || "https://placehold.co/100"} alt="Avatar" />
                                </div>
                            </div>
                            <div className="font-bold">
                                {item.name} 
                                {isMe && <span className="ml-2 text-xs text-blue-500">(You)</span>}
                            </div>
                        </div>
                    </td>
                    <td>{item.email}</td>
                    <td>
                        <span className={`badge ${
                            item.role === 'admin' ? 'badge-error text-white' : 
                            item.role === 'tutor' ? 'badge-primary text-white' : 'badge-ghost'
                        }`}>
                            {item.role}
                        </span>
                    </td>
                    <td>
                        <div className="flex justify-center gap-2">
                            {/* Make Admin Button */}
                            <button 
                                onClick={() => handleMakeRole(item, 'admin')}
                                disabled={item.role === 'admin'} // Can't make admin if already admin
                                className="btn btn-xs btn-outline btn-error tooltip"
                                data-tip="Make Admin"
                            >
                                <Shield size={14} />
                            </button>

                            {/* Make Tutor Button */}
                            <button 
                                onClick={() => handleMakeRole(item, 'tutor')}
                                // Disabled if already tutor OR if it is ME (Super admin cannot demote to tutor directly)
                                disabled={item.role === 'tutor' || isMe} 
                                className="btn btn-xs btn-outline btn-primary tooltip"
                                data-tip="Make Tutor"
                            >
                                <GraduationCap size={14} />
                            </button>
                            
                            {/* Make Student (Reset / Leave Admin) */}
                            <button 
                                onClick={() => handleMakeRole(item, 'student')}
                                // Disabled if already student OR (if it is Me AND I am the last admin)
                                disabled={item.role === 'student' || (isMe && adminCount <= 1)}
                                className="btn btn-xs btn-outline btn-ghost tooltip"
                                data-tip={isMe && adminCount <= 1 ? "Must add another admin first" : "Make Student"}
                            >
                                <User size={14} />
                            </button>

                            {/* Delete Button: HIDDEN IF IT IS YOU */}
                            {!isMe && (
                                <button 
                                    onClick={() => handleDelete(item)}
                                    className="btn btn-xs btn-square btn-error text-white ml-2 tooltip"
                                    data-tip="Delete User"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;