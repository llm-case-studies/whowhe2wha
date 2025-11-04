import React from 'react';
import { EventNode, TimelineScale } from '../types';

interface TimelineViewProps {
  events: EventNode[];
  currentDate: Date;
  scale: TimelineScale;
}

// A generic marker component for the timeline.
const TimelineMarker: React.FC<{ label: string; isToday?: boolean }> = ({ label, isToday = false }) => {
  // Today's marker is blue and prominent, others are neutral gray
  const circleClasses = isToday
    ? 'bg-wha-blue border-primary ring-2 ring-wha-blue/50'
    : 'bg-tertiary border-secondary';
  const textColor = isToday ? 'text-wha-blue font-bold' : 'text-primary';

  return (
    <div className="flex flex-col items-center">
      {/* The circle marker that the line goes through */}
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${circleClasses}`}>
        <div className="w-2 h-2 bg-primary rounded-full" />
      </div>
      {/* The label below the marker */}
      <span className={`absolute top-full pt-2 text-xs uppercase tracking-wider whitespace-nowrap ${textColor}`}>{label}</span>
    </div>
  );
};

export const TimelineView: React.FC<TimelineViewProps> = ({ events, currentDate, scale }) => {
  // Hardcoded dates as per the request
  const startDate = new Date('2025-10-24T00:00:00Z');
  const endDate = new Date('2025-11-24T00:00:00Z');
  const todayDate = new Date('2025-11-04T00:00:00Z');

  // Calculate the position of "today" on the timeline
  const totalDuration = endDate.getTime() - startDate.getTime();
  const todayOffset = todayDate.getTime() - startDate.getTime();
  // Ensure we don't divide by zero if start and end dates are the same
  const todayPositionPercent = totalDuration > 0 ? (todayOffset / totalDuration) * 100 : 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-secondary border border-primary rounded-lg p-8 w-full mt-4">
      <div className="relative w-full h-12">
        
        {/* The main timeline route/bar, positioned between the centers of the end markers */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2.5 right-2.5 h-2 bg-blue-500/50 rounded-full">
            <div className="h-full bg-blue-500 rounded-full"></div>
        </div>

        {/* Markers are placed in a container that sits on top of the line */}
        <div className="absolute top-1/2 left-0 w-full">
            {/* Start Marker */}
            <div className="absolute -translate-y-1/2" style={{left: '0%'}}>
                <TimelineMarker label={formatDate(startDate)} />
            </div>
            
            {/* Today Marker */}
            <div className="absolute -translate-y-1/2" style={{left: `${todayPositionPercent}%`, transform: 'translateX(-50%)'}}>
                <TimelineMarker label={"Today " + formatDate(todayDate)} isToday />
            </div>

            {/* End Marker */}
            <div className="absolute -translate-y-1/2" style={{left: '100%', transform: 'translateX(-100%)'}}>
                 <TimelineMarker label={formatDate(endDate)} />
            </div>
        </div>

      </div>
    </div>
  );
};
