import React, { useEffect, useState } from "react";
import { Users, Trash2, Shield, GraduationCap, User, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import { useUserAuth } from "../../../context/AuthContext";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { user: currentUser } = useUserAuth();

  // Fetch all users
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

  useEffect(() => { fetchUsers(); }, []);

  const adminCount = users.filter(u => u.role === 'admin').length;

  // Handle role change
  const handleMakeRole = async (targetUser, role) => {
    if (targetUser.email === currentUser.email && role !== 'admin') {
      if (adminCount <= 1) {
        Swal.fire("Action Blocked", "You are the only Admin. Add another Admin first.", "error");
        return;
      }
    }
    const token = localStorage.getItem("access-token");
    try {
      const res = await fetch(`http://localhost:5000/users/role/${targetUser._id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        Swal.fire("Success", `${targetUser.name} is now a ${role}`, "success");
        fetchUsers();
      }
    } catch (error) {
      console.error("Role change failed", error);
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  // Handle delete user
  const handleDelete = (targetUser) => {
    Swal.fire({
      title: `Delete ${targetUser.name}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("access-token");
        try {
          const res = await fetch(`http://localhost:5000/users/${targetUser._id}`, {
            method: "DELETE",
            headers: { authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.deletedCount > 0) {
            Swal.fire("Deleted!", "User has been deleted.", "success");
            fetchUsers();
          }
        } catch (error) {
          console.error("Delete failed", error);
          Swal.fire("Error", "Failed to delete user", "error");
        }
      }
    });
  };

  // Open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      photoURL: user.photoURL || "",
      status: user.status || "inactive"
    });
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`http://localhost:5000/users/update/${editingUser.email}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        Swal.fire("Success", "User updated successfully", "success");
        setEditingUser(null);
        fetchUsers();
      } else {
        Swal.fire("Info", "No changes were made", "info");
      }
    } catch (error) {
      console.error("Edit failed:", error);
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users /> Manage Users
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50 uppercase text-xs">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => {
              const isMe = currentUser.email === item.email;
              return (
                <tr key={item._id} className={isMe ? "bg-blue-50/30" : ""}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10">
                          <img src={item.photoURL || "https://placehold.co/100"} alt="Avatar" />
                        </div>
                      </div>
                      <div>{item.name} {isMe && "(You)"}</div>
                    </div>
                  </td>
                  <td>{item.email}</td>
                  <td>
                    <span className={`badge ${item.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                      {item.status || 'inactive'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      item.role === 'admin' ? 'badge-error' : item.role === 'tutor' ? 'badge-primary' : 'badge-ghost'
                    }`}>{item.role}</span>
                  </td>
                  <td className="flex gap-2 justify-center">
                    <button onClick={() => handleEditClick(item)} className="btn btn-xs btn-outline btn-info tooltip" data-tip="Edit User">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleMakeRole(item, 'admin')} disabled={item.role==='admin'} className="btn btn-xs btn-outline btn-error">
                      <Shield size={14} />
                    </button>
                    <button onClick={() => handleMakeRole(item, 'tutor')} disabled={item.role==='tutor' || isMe} className="btn btn-xs btn-outline btn-primary">
                      <GraduationCap size={14} />
                    </button>
                    <button onClick={() => handleMakeRole(item, 'student')} disabled={item.role==='student' || (isMe && adminCount <= 1)} className="btn btn-xs btn-outline btn-ghost">
                      <User size={14} />
                    </button>
                    {!isMe && <button onClick={() => handleDelete(item)} className="btn btn-xs btn-error">
                      <Trash2 size={14} />
                    </button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button onClick={() => setEditingUser(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit {editingUser.name}</h2>
            <form className="space-y-3" onSubmit={handleEditSubmit}>
              <div>
                <label className="block text-sm font-semibold">Name</label>
                <input type="text" className="w-full border px-3 py-2 rounded" value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold">Email</label>
                <input type="email" className="w-full border px-3 py-2 rounded" value={editForm.email} onChange={e=>setEditForm({...editForm, email:e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold">Phone</label>
                <input type="text" className="w-full border px-3 py-2 rounded" value={editForm.phone} onChange={e=>setEditForm({...editForm, phone:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold">Profile Image URL</label>
                <input type="text" className="w-full border px-3 py-2 rounded" value={editForm.photoURL} onChange={e=>setEditForm({...editForm, photoURL:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold">Status</label>
                <select className="w-full border px-3 py-2 rounded" value={editForm.status} onChange={e=>setEditForm({...editForm, status:e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={()=>setEditingUser(null)} className="btn btn-sm btn-outline">Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
