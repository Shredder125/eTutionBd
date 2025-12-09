import React, { useState } from 'react';
import { Clock, Users, Briefcase, Mail, Phone, Calendar, Sparkles, MoreHorizontal, Send } from 'lucide-react';

const TutorCard = ({ tutor }) => {
  const { name, role, experience, studentEnrollments, tuitionSchedule, email, phone } = tutor;

  // 1. Image Finder
  const imageUrl = tutor.profileImage || tutor.image || tutor.img || tutor.photo || tutor.avatar || tutor.url;

  // 2. State for broken links
  const [imageError, setImageError] = useState(false);

  // LOGIC: Limit Schedule
  const MAX_SCHEDULE_ITEMS = 2;
  const displayedSchedule = tuitionSchedule?.slice(0, MAX_SCHEDULE_ITEMS) || []; 
  const remainingSlots = (tuitionSchedule?.length || 0) - MAX_SCHEDULE_ITEMS;

  // LOGIC: Initials
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : "??";

  return (
    <div className="group relative w-full max-w-[22rem] h-full min-h-[540px] flex flex-col bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-indigo-500/20 pb-2">
      
      {/* HEADER */}
      <div className="relative h-40 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 p-6 shrink-0">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl rotate-45 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="max-w-[70%]">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-bold backdrop-blur-md uppercase tracking-wider shadow-sm mb-3 border border-white/10">
              <Sparkles size={10} className="text-yellow-300" /> {role}
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight truncate" title={name}>
              {name}
            </h2>
          </div>

          {/* AVATAR */}
          <div className="h-14 w-14 rounded-2xl bg-white/95 backdrop-blur-xl text-indigo-700 flex items-center justify-center font-black text-lg shadow-lg ring-4 ring-white/20 overflow-hidden relative">
            {imageUrl && !imageError ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="select-none">{initials}</span>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="px-6 -mt-8 relative z-20 shrink-0">
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-2xl p-3 shadow-md border border-slate-50 flex flex-col items-center justify-center text-center">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg mb-1">
              <Briefcase size={16} strokeWidth={2} />
            </div>
            <p className="text-xl font-black text-slate-800">{experience || 0}+</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Years</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-3 shadow-md border border-slate-50 flex flex-col items-center justify-center text-center">
             <div className="p-1.5 bg-violet-50 text-violet-600 rounded-lg mb-1">
               <Users size={16} strokeWidth={2} />
             </div>
            <p className="text-xl font-black text-slate-800">{studentEnrollments || 0}</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Students</p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6 pt-6 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <Calendar size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Availability</h3>
          </div>
          
          <div className="space-y-2 pl-2">
            {displayedSchedule.map((slot, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                   <span className="font-semibold text-slate-700">{slot.day}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                  <Clock size={12} />
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
            ))}

            {remainingSlots > 0 && (
              <div className="pt-1 flex justify-center">
                 <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    <MoreHorizontal size={12} /> +{remainingSlots} more days
                 </span>
              </div>
            )}

            {(!displayedSchedule || displayedSchedule.length === 0) && (
              <p className="text-xs text-slate-400 italic pl-4">No schedule available</p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="space-y-2 mb-4">
            <div className="group/item flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" title={email}>
              <div className="shrink-0 p-1.5 bg-slate-100 text-slate-500 rounded-md group-hover/item:text-blue-600 group-hover/item:bg-blue-50 transition-colors">
                 <Mail size={14} />
              </div>
              <span className="text-xs font-medium text-slate-600 truncate w-full">{email}</span>
            </div>
            <div className="group/item flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="shrink-0 p-1.5 bg-slate-100 text-slate-500 rounded-md group-hover/item:text-green-600 group-hover/item:bg-green-50 transition-colors">
                 <Phone size={14} />
              </div>
              <span className="text-xs font-medium text-slate-600">{phone}</span>
            </div>
          </div>
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group/btn">
            Apply Now
            <Send size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;