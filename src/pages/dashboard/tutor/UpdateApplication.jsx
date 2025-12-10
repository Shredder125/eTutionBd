import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const UpdateApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [experience, setExperience] = useState("");

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Application not found");
      const data = await res.json();
      setApplication(data);
      setExpectedSalary(data.expectedSalary || "");
      setExperience(data.experience || "");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Application not found.", "error");
      navigate("/dashboard/my-applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center p-10">
      <Loader2 className="animate-spin text-primary h-10 w-10" />
    </div>
  );

  if (!application) return null;

  if (application.status !== "pending") {
    return (
      <div className="text-center p-10">
        <p className="text-red-500 font-bold">
          This application cannot be edited because it has already been {application.status}.
        </p>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expectedSalary, experience }),
      });

      const result = await res.json();
      if (res.ok) {
        Swal.fire("Success", "Application updated successfully.", "success");
        navigate("/dashboard/my-applications");
      } else {
        Swal.fire("Error", result.message || "Failed to update application.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update application.", "error");
    }
  };

  const handleWithdraw = async () => {
    Swal.fire({
      title: "Withdraw Application?",
      text: "This will permanently delete your application. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Withdraw",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("access-token");
          const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
            method: "DELETE",
            headers: { authorization: `Bearer ${token}` },
          });
          const data = await res.json();

          if (data.deletedCount > 0) {
            Swal.fire("Withdrawn!", "Your application has been deleted.", "success");
            navigate("/dashboard/my-applications");
          } else {
            Swal.fire("Error", "Failed to withdraw application.", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to withdraw application.", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Update Your Application</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Expected Salary (₹)</label>
          <input
            type="number"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Your Experience (years)</label>
          <input
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Update Application</button>
          <button
            type="button"
            onClick={handleWithdraw}
            className="btn btn-error"
          >
            Withdraw Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateApplication;
