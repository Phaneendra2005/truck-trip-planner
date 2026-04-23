import React from 'react';

const SummaryPanel = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="glass p-6 rounded-2xl shadow-xl w-full h-full flex flex-col justify-center">
      <h3 className="text-lg font-medium text-slate-400 mb-4 uppercase tracking-wider text-center">
        Trip Summary
      </h3>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Distance */}
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <div className="text-3xl font-bold tracking-tight text-white mb-1">
            {summary.distance || "0 mi"}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-widest">
            Total Distance
          </div>
        </div>

        {/* Duration */}
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <div className="text-3xl font-bold tracking-tight text-white mb-1">
            {summary.duration || "0 hr"}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-widest">
            Est. Drive Time
          </div>
        </div>

      </div>

      <div className="mt-6 text-sm text-center text-slate-500">
        Results include mandatory 11-hour driving limits, 14-hour on-duty window adherence, and required rest breaks based on US Hours of Service (HOS) rules.
      </div>
    </div>
  );
};

export default SummaryPanel;