import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/AuthContext";
import { CreditCard, Calendar, CheckCircle, User, AlertCircle } from "lucide-react";

const PaymentHistory = () => {
  const { user } = useUserAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!user?.email) return;
        const token = localStorage.getItem("access-token");
        const res = await fetch(`http://localhost:5000/payments/my-history/${user.email}`, {
          headers: { authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPayments(data);
        } else {
          setPayments([]);
        }
      } catch (error) {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="text-primary" /> Payment History
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track all your tuition payments and transactions.</p>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-base-200 p-4 rounded-full mb-4">
             <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No payment records found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-4 pl-6">Tutor Name</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr key={pay._id} className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors">
                  <td className="pl-6">
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-neutral-100 text-neutral-400 rounded-full w-8">
                                <User size={16} />
                            </div>
                        </div>
                        <span className="font-bold text-gray-700">{pay.tutorName || "Unknown Tutor"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-primary">₹ {pay.price}</div>
                  </td>
                  <td>
                    <div className="badge badge-ghost font-mono text-xs text-gray-500 p-3">
                        {pay.transactionId}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                        <Calendar size={14} className="text-gray-400" /> 
                        {new Date(pay.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle size={12} /> Paid
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

export default PaymentHistory;
