import React, { useEffect, useState } from "react";
import { Users, BookOpen, FileText, DollarSign, TrendingUp, Activity } from "lucide-react";
import CountUp from "react-countup";

const AdminStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    tuitions: 0,
    applications: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access-token");
        // ✅ FIX: Use Environment Variable
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin-stats`, {
          headers: { authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-primary" /> Reports & Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-1">Overview of platform performance and revenue.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-primary to-violet-600 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-white/80 text-sm font-medium mb-1">Total Revenue</p>
                <h3 className="text-4xl font-bold">
                    ৳ <CountUp end={stats.revenue} duration={2} separator="," />
                </h3>
            </div>
            <div className="absolute right-4 top-4 p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <DollarSign size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-all">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                    <CountUp end={stats.users} duration={2} />
                </h3>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
            </div>
        </div>

        {/* Total Tuitions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-all">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                    <CountUp end={stats.tuitions} duration={2} />
                </h3>
                <p className="text-gray-500 text-sm font-medium">Active Tuitions</p>
            </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-all">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                        <FileText size={24} />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                    <CountUp end={stats.applications} duration={2} />
                </h3>
                <p className="text-gray-500 text-sm font-medium">Applications Received</p>
            </div>
        </div>
      </div>

      {/* Visual Bars (Simple Chart) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Platform Activity</h3>
        <div className="space-y-6">
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">User Growth</span>
                    <span className="text-sm font-bold text-gray-700">{stats.users}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-500 h-3 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Post Conversion Rate (Apps/Post)</span>
                    <span className="text-sm font-bold text-gray-700">{((stats.applications / (stats.tuitions || 1)) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${Math.min(((stats.applications / (stats.tuitions || 1)) * 100), 100)}%` }}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;