import React, { useEffect, useState } from "react";
import { Users, BookOpen, FileText, DollarSign, TrendingUp } from "lucide-react";
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
        const res = await fetch("http://localhost:5000/admin-stats", {
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

  // Card Component for consistency
  const StatCard = ({ title, count, icon: Icon, color, prefix = "" }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">
            {prefix}
            <CountUp end={count} duration={2.5} separator="," />
        </h3>
      </div>
      <div className={`p-4 rounded-full ${color} bg-opacity-10 text-white`}>
        <Icon size={24} className={`text-${color.split('-')[1]}-600`} /> 
        {/* Note: Tailwind needs full classes sometimes, but let's try dynamic first or hardcode specific colors below if needed */}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-primary" /> Reports & Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-1">Overview of platform performance and revenue.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-primary">
                    ৳ <CountUp end={stats.revenue} duration={2} separator="," />
                </h3>
            </div>
            <div className="p-4 rounded-full bg-primary/10 text-primary">
                <DollarSign size={24} />
            </div>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-800">
                    <CountUp end={stats.users} duration={2} />
                </h3>
            </div>
            <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                <Users size={24} />
            </div>
        </div>

        {/* Total Tuitions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Tuition Posts</p>
                <h3 className="text-3xl font-bold text-gray-800">
                    <CountUp end={stats.tuitions} duration={2} />
                </h3>
            </div>
            <div className="p-4 rounded-full bg-purple-100 text-purple-600">
                <BookOpen size={24} />
            </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Applications</p>
                <h3 className="text-3xl font-bold text-gray-800">
                    <CountUp end={stats.applications} duration={2} />
                </h3>
            </div>
            <div className="p-4 rounded-full bg-orange-100 text-orange-600">
                <FileText size={24} />
            </div>
        </div>
      </div>

      {/* Simple Visual Representation (Bar-like) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Platform Activity</h3>
        <div className="space-y-6">
            
            {/* Users Bar */}
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Registered Users</span>
                    <span className="text-sm font-bold text-gray-700">{stats.users}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
            </div>

            {/* Tuitions Bar (Relative to Users) */}
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Tuition Jobs Posted</span>
                    <span className="text-sm font-bold text-gray-700">{stats.tuitions}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" 
                        style={{ width: `${(stats.tuitions / (stats.users || 1)) * 100}%` }}>
                    </div>
                </div>
            </div>

            {/* Applications Bar (Relative to Tuitions) */}
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Total Applications</span>
                    <span className="text-sm font-bold text-gray-700">{stats.applications}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" 
                         style={{ width: `${(stats.applications / (stats.tuitions || 1)) * 100}%` }}>
                    </div>
                </div>
            </div>
            
        </div>
      </div>

    </div>
  );
};

export default AdminStats;