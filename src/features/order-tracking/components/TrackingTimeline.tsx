import React from 'react';
import type { TrackingCheckpoint } from '../types/orderTracking';
import { Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface TrackingTimelineProps {
  history: TrackingCheckpoint[];
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="text-gray-500 text-sm">No status history available yet.</p>;
  }

  const reversedHistory = [...history].reverse();

  return (
    <div className="relative border-l-2 border-primary/30 ml-4 space-y-6 py-2">
      {reversedHistory.map((item, idx) => {
        const isLatest = idx === 0;

        return (
          <div key={idx} className="relative pl-6">
            <div
              className={`absolute -left-[17px] top-0 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${
                isLatest
                  ? 'border-primary text-primary shadow-sm ring-4 ring-primary/10'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800/80 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isLatest
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {item.status.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                {item.description}
              </p>

              {item.location && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <MapPin className="w-3 h-3 text-primary/70" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackingTimeline;
