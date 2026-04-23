import React from 'react';

const typeToY = { off_duty: 20, sleeper: 40, driving: 60, on_duty: 80 };
const typeToColor = {
  off_duty: '#94a3b8',
  sleeper: '#facc15',
  driving: '#ef4444',
  on_duty: '#3b82f6',
};

const LogGrid = ({ logs }) => {
  // 🔴 Global guard
  if (!Array.isArray(logs) || logs.length === 0) return null;

  return (
    <div className="glass p-6 rounded-2xl shadow-xl w-full flex flex-col gap-8">
      <h3 className="text-xl font-semibold mb-2">
        Driver Daily Logs (HOS)
      </h3>

      {logs.map((log, dayIndex) => {
        // 🔴 Guard each log
        const segments = Array.isArray(log?.segments) ? log.segments : [];
        if (segments.length === 0) return null;

        let currentX = 0;
        const segmentsRender = [];
        const verticalLinesRender = [];

        segments.forEach((seg, i) => {
          // 🔴 Safe values
          const hours = Number(seg?.hours || 0);
          const type = seg?.type;

          if (!typeToY[type]) return;

          const startX = (currentX / 24) * 100;
          const width = (hours / 24) * 100;
          const y = typeToY[type];

          // Horizontal segment
          segmentsRender.push(
            <line
              key={`h-${dayIndex}-${i}`}
              x1={`${startX}%`}
              y1={`${y}%`}
              x2={`${startX + width}%`}
              y2={`${y}%`}
              stroke={typeToColor[type]}
              strokeWidth="3"
            />
          );

          // Vertical transition line
          if (i > 0) {
            const prevType = segments[i - 1]?.type;
            const prevY = typeToY[prevType];

            if (prevY !== undefined) {
              verticalLinesRender.push(
                <line
                  key={`v-${dayIndex}-${i}`}
                  x1={`${startX}%`}
                  y1={`${prevY}%`}
                  x2={`${startX}%`}
                  y2={`${y}%`}
                  stroke={typeToColor[type]}
                  strokeWidth="3"
                />
              );
            }
          }

          currentX += hours;
        });

        return (
          <div key={dayIndex} className="relative w-full">
            <h4 className="text-sm text-slate-400 mb-2 uppercase font-medium">
              Day {log?.day ?? dayIndex + 1}
            </h4>

            <div className="flex w-full h-[120px]">
              {/* Labels */}
              <div className="w-12 h-full flex flex-col justify-between text-[10px] font-bold text-slate-500 py-1 border-r border-slate-700 uppercase">
                <div style={{ top: '20%', position: 'relative', transform: 'translateY(-50%)' }}>OFF</div>
                <div style={{ top: '40%', position: 'relative', transform: 'translateY(-50%)' }}>SB</div>
                <div style={{ top: '60%', position: 'relative', transform: 'translateY(-50%)' }}>DRV</div>
                <div style={{ top: '80%', position: 'relative', transform: 'translateY(-50%)' }}>ON</div>
              </div>

              {/* Grid */}
              <div className="flex-1 h-full relative">
                {/* Vertical grid lines */}
                {[...Array(25)].map((_, i) => (
                  <div
                    key={`grid-${i}`}
                    className={`absolute top-0 bottom-0 border-l ${
                      i % 4 === 0
                        ? 'border-slate-700/80'
                        : 'border-slate-800/50'
                    }`}
                    style={{ left: `${(i / 24) * 100}%` }}
                  >
                    {i % 4 === 0 && i !== 24 && (
                      <span className="absolute -top-4 text-[9px] text-slate-600 -translate-x-1/2">
                        {i === 0 ? 'MID' : i === 12 ? 'NOON' : i}
                      </span>
                    )}
                  </div>
                ))}

                {/* Horizontal state lines */}
                {[20, 40, 60, 80].map((y, i) => (
                  <div
                    key={`h-grid-${i}`}
                    className="absolute left-0 right-0 border-t border-slate-800/80"
                    style={{ top: `${y}%` }}
                  />
                ))}

                {/* Graph */}
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  {verticalLinesRender}
                  {segmentsRender}
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LogGrid;