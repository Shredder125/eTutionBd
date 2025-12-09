import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Filter, Loader2 } from "lucide-react"; 
import TutorCard from "../components/TutorCard";

const AllTutors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTutors = async () => {
      try {
        setIsLoading(true);
        
        // ✅ FIX: Use the specific endpoint for tutors
        const response = await fetch("http://localhost:5000/all-tutors"); 
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        
        // Backend now filters for us, so we just set the state
        if (Array.isArray(data)) {
            setTutors(data);
        } else {
            setTutors([]);
        }

      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError("Could not load tutors. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, []); 

  // Search Filter (Client Side)
  const filteredTutors = tutors.filter((tutor) =>
    tutor.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-purple-500/30">
      
      {/* --- HEADER --- */}
      <div className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
           <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
           <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your <span className="text-purple-500">Ideal Tutor</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Browse our extensive list of verified educators.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Search tutor by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-lg"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
               <span className="text-xs text-neutral-500 border border-neutral-700 px-2 py-1 rounded bg-neutral-800">
                 {filteredTutors.length} results
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- CARD GRID --- */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
            <p>Loading tutors...</p>
          </div>
        )}

        {/* Error Message */}
        {!isLoading && error && (
           <div className="text-center py-20 border border-red-900/30 rounded-3xl bg-red-900/10">
             <p className="text-red-400 font-bold">{error}</p>
           </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <>
            {filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor._id} tutor={tutor} />
                ))}
              </div>
            ) : (
              /* No Results Found */
              <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/20">
                <div className="inline-flex p-4 rounded-full bg-neutral-900 mb-4">
                  <Filter size={32} className="text-neutral-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No tutors found</h3>
                <p className="text-neutral-500">Try adjusting your search terms.</p>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
};

export default AllTutors;