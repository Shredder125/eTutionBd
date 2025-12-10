import React, { useEffect, useState } => "react";
import { Users, Shield, Trash2, ShieldCheck, User, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch ALL users from the backend (Requires Admin Token)
  const fetchUsers = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem("access-token");
        
        // This is the correct Admin endpoint to fetch ALL users: GET /users
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            headers: { authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
            // Handle 403 Forbidden if user is not admin
            if (res.status === 403) {
                 Swal.fire("Access Denied", "You do not have permission to manage users.", "error");
                 setUsers([]);
                 return;
            }
            throw new Error('Failed to fetch users.');
        }

        const data = await res.json();
        if (Array.isArray(data)) {
            setUsers(data);
        } else {
            setUsers([]);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire("Error", "Could not load users. Check server connection.", "error");
    } finally {
        setLoading(false);
    }
  };

  // Function to change a user's role (e.g., Make Admin)
  const handleRoleUpdate = async (userId, newRole, userName) => {
    const action = newRole === 'admin' ? 'Make Admin' : `Change Role to ${newRole}`;
    
    if (!window.confirm(`Are you sure you want to ${action} for ${userName}?`)) return;

    try {
        const token = localStorage.getItem("access-token");
        
        // Backend endpoint: PATCH /users/role/:id
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/role/${userId}`, {
            method: 'PATCH',
            headers: { 
                'content-type': 'application/json',
                authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ role: newRole }) // Send the new role
        });
        const data = await res.json();
        
        if(data.modifiedCount > 0){
            Swal.fire("Success", `${userName}'s role updated to ${newRole}!`, "success");
            fetchUsers(); // Refresh the list
        }
    } catch (error) {
        console.error("Error updating role:", error);
        Swal.fire("Error", "Failed to update role.", "error");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) return (
    <div className="p-10 text-center">
        <Loader2 className="animate-spin h-10 w-10 mx-auto text-primary"/>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="text-primary"/> Manage All Users ({users.length})
      </h1>
      
      {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <User className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-500 font-medium">No users found in the database.</p>
          </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="table w-full">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wide">
                    <tr>
                        <th className="py-4 pl-6">Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0">
                            <td className="font-bold text-gray-800 pl-6">{user.name || "N/A"}</td>
                            <td className="text-sm text-gray-600">{user.email}</td>
                            <td>
                                {user.role === 'admin' ? 
                                    <span className="badge badge-primary badge-outline gap-1 text-primary border-primary bg-primary/10"><ShieldCheck size={12}/> Admin</span> : 
                                    user.role === 'tutor' ?
                                    <span className="badge badge-warning badge-outline gap-1 text-yellow-700 border-yellow-500 bg-yellow-100/50">Tutor</span> :
                                    <span className="badge badge-ghost text-gray-500 border-gray-300 bg-gray-100">Student</span>
                                }
                            </td>
                            <td>
                                {user.role !== 'admin' && (
                                    <button 
                                        onClick={() => handleRoleUpdate(user._id, 'admin', user.name)} 
                                        className="btn btn-xs btn-primary text-white shadow-md shadow-primary/20"
                                        title="Grant Admin Privileges"
                                    >
                                        <Shield size={14}/> Make Admin
                                    </button>
                                )}
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

export default AllUsers;