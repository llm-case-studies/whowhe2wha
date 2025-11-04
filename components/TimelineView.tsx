import React, { useState } from 'react';
import { EventNode, TimelineScale } from '../types';
import { MOCK_HOLIDAYS } from '../constants';
import { StarIcon } from './icons';
import { 
    getStartOfWeek, getEndOfWeek,
    getStartOfMonth, getEndOfMonth,
    getStartOfQuarter, getEndOfQuarter,
    getStartOfYear, getEndOfYear
} from '../utils/dateUtils';

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
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  // Dynamic Date Range Calculation based on scale
  let startDate: Date;
  let endDate: Date;

  switch (scale) {
    case 'week':
      startDate = getStartOfWeek(currentDate);
      endDate = getEndOfWeek(currentDate);
      break;
    case 'quarter':
      startDate = getStartOfQuarter(currentDate);
      endDate = getEndOfQuarter(currentDate);
      break;
    case 'year':
      startDate = getStartOfYear(currentDate);
      endDate = getEndOfYear(currentDate);
      break;
    case 'month':
    default:
      startDate = getStartOfMonth(currentDate);
      endDate = getEndOfMonth(currentDate);
      break;
  }
  
  const todayDate = new Date();
  
  const startDateMs = startDate.getTime();
  const endDateMs = endDate.getTime();

  // Calculate the total duration of the timeline
  const totalDuration = endDateMs - startDateMs;

  const getPositionPercent = (date: Date) => {
    if (totalDuration <= 0) return 0;
    const position = ((date.getTime() - startDateMs) / totalDuration) * 100;
    return Math.max(0, Math.min(100, position));
  };
  
  const isTodayVisible = todayDate.getTime() >= startDateMs && todayDate.getTime() <= endDateMs;
  const todayPositionPercent = isTodayVisible ? getPositionPercent(todayDate) : -1;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric' });
  };
  
  const visibleEvents = events.filter(event => {
    const eventDateMs = new Date(event.when.timestamp).getTime();
    return eventDateMs >= startDateMs && eventDateMs <= endDateMs;
  });

  const visibleHolidays = MOCK_HOLIDAYS.filter(holiday => {
      const holidayDateMs = holiday.date.getTime();
      return holidayDateMs >= startDateMs && holidayDateMs <= endDateMs;
  });

  return (
    <div className="bg-secondary border border-primary rounded-lg p-8 w-full mt-4">
      <div className="relative w-full h-24">
        
        {/* The main timeline route/bar, positioned between the centers of the end markers */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2.5 right-2.5 h-2 bg-blue-500/50 rounded-full">
            <div className="h-full bg-blue-500 rounded-full"></div>
        </div>

        {/* Container for all markers */}
        <div className="absolute top-0 left-0 w-full h-full">

            {/* Event Markers (Above) with Tooltips */}
            {visibleEvents.map(event => {
                const position = getPositionPercent(new Date(event.when.timestamp));
                return (
                    <div 
                        key={event.id}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${position}%`, bottom: 'calc(50% + 6px)', transform: 'translateX(-50%)' }}
                        onMouseEnter={() => setActiveTooltip(event.id)}
                        onMouseLeave={() => setActiveTooltip(null)}
                    >
                        {/* Tooltip */}
                        {activeTooltip === event.id && (
                           <div className="absolute bottom-full mb-2 w-56 bg-tertiary text-primary text-xs rounded-md shadow-lg p-2 z-20 pointer-events-none">
                                <p className="font-bold text-sm">{event.what.name}</p>
                                {event.what.description && <p className="text-secondary mt-1">{event.what.description}</p>}
                            </div>
                        )}
                        {/* Marker Circle */}
                        <div className="w-3 h-3 bg-wha-blue rounded-full border-2 border-secondary cursor-pointer"/>
                    </div>
                );
            })}

            {/* Holiday Markers (Below) */}
            {visibleHolidays.map(holiday => {
                const position = getPositionPercent(holiday.date);
                return (
                    <div 
                        key={holiday.name}
                        className="absolute"
                        style={{ left: `${position}%`, top: 'calc(50% + 6px)', transform: 'translateX(-50%)' }}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 text-morning flex items-center justify-center">
                               <StarIcon />
                            </div>
                            <span className="text-xs text-morning whitespace-nowrap mt-1">{holiday.name}</span>
                        </div>
                    </div>
                );
            })}
        </div>


        {/* Markers ON the line (Start, End, Today) */}
        <div className="absolute top-1/2 left-0 w-full">
            {/* Start Marker */}
            <div className="absolute -translate-y-1/2" style={{left: '0%'}}>
                <TimelineMarker label={formatDate(startDate)} />
            </div>
            
            {/* Today Marker */}
            {isTodayVisible && (
                <div className="absolute -translate-y-1/2" style={{left: `${todayPositionPercent}%`, transform: 'translateX(-50%)'}}>
                    <TimelineMarker label={"Today " + formatDate(todayDate)} isToday />
                </div>
            )}

            {/* End Marker */}
            <div className="absolute -translate-y-1/2" style={{left: '100%', transform: 'translateX(-100%)'}}>
                 <TimelineMarker label={formatDate(endDate)} />
            </div>
        </div>

      </div>
    </div>
  );
};