import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../../context/AuthContext";
import { DollarSign, TrendingUp, Calendar, User, Loader2, CreditCard } from "lucide-react";

const TutorRevenue = () => {
  const { user } = useUserAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/tutor-history/${user.email}`, {
          headers: { authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPayments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if(user?.email) fetchRevenue();
  }, [user]);

  const totalEarnings = payments.reduce((sum, item) => sum + item.price, 0);

  if (loading) return <div className="p-10 text-center flex justify-center"><Loader2 className="animate-spin text-primary h-10 w-10"/></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-primary" /> Revenue History
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track your total earnings from tuitions in India.</p>
      </div>

      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-10 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-primary-content/80 font-medium mb-1">Total Lifetime Earnings</p>
            <h2 className="text-5xl font-bold tracking-tight">₹ {totalEarnings}</h2>
        </div>
        <div className="p-4 bg-white/20 rounded-full relative z-10 backdrop-blur-sm">
            <DollarSign size={40} />
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <CreditCard size={18} className="text-gray-400"/>
            <h3 className="font-bold text-gray-800">Transaction History</h3>
        </div>
        
        {payments.length === 0 ? (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                <DollarSign size={48} className="text-gray-200 mb-2" />
                <p>No income records found yet.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th>Student Details</th>
                            <th>Amount</th>
                            <th>Transaction ID</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((pay) => (
                            <tr key={pay._id} className="hover:bg-gray-50 transition-colors">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{pay.studentName || "Student"}</div>
                                            <div className="text-xs text-gray-400">{pay.studentEmail || pay.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                                        + ₹{pay.price}
                                    </div>
                                </td>
                                <td className="font-mono text-xs text-gray-500">{pay.transactionId}</td>
                                <td className="text-gray-500">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} /> 
                                        {new Date(pay.date).toLocaleDateString("en-IN")}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default TutorRevenue;
