import React, { useState, useMemo } from 'react';
import { EventNode, TimelineScale, Holiday } from '../types';
import { HOLIDAY_DATA } from '../constants';
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
  selectedHolidayCategories: string[];
}

const getIconForHoliday = (holiday: Holiday): string => {
  const category = holiday.category;
  switch (category) {
    // Civil (Flags)
    case 'US': return '🇺🇸';
    case 'Canada': return '🇨🇦';
    case 'Mexico': return '🇲🇽';
    case 'UK': return '🇬🇧';
    case 'EU': return '🇪🇺';
    case 'China': return '🇨🇳';
    case 'India': return '🇮🇳';
    // Religious
    case 'Christian': return '✝️';
    case 'Jewish': return '✡️';
    case 'Muslim': return '☪️';
    case 'Hindu': return '🕉️';
    default: return '⭐';
  }
};

const TimelineMarker: React.FC<{ label: string; isToday?: boolean, align?: 'left' | 'center' | 'right' }> = ({ label, isToday = false, align = 'center' }) => {
  const circleClasses = isToday
    ? 'bg-wha-blue border-primary ring-2 ring-wha-blue/50'
    : 'bg-tertiary border-secondary';
  const textColor = isToday ? 'text-wha-blue font-bold' : 'text-primary';

  let spanClasses = 'absolute top-full pt-2 text-xs uppercase tracking-wider whitespace-nowrap ';
  if (align === 'left') {
    spanClasses += ' left-0';
  } else if (align === 'right') {
    spanClasses += ' right-0';
  } else {
    spanClasses += ' left-1/2 -translate-x-1/2';
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${circleClasses}`}>
        <div className="w-2 h-2 bg-primary rounded-full" />
      </div>
      <span className={`${spanClasses} ${textColor}`}>{label}</span>
    </div>
  );
};

export const TimelineView: React.FC<TimelineViewProps> = ({ events, currentDate, scale, selectedHolidayCategories }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const { startDate, endDate } = useMemo(() => {
    let start: Date, end: Date;
    switch (scale) {
      case 'week':
        start = getStartOfWeek(currentDate);
        end = getEndOfWeek(currentDate);
        break;
      case 'quarter':
        start = getStartOfQuarter(currentDate);
        end = getEndOfQuarter(currentDate);
        break;
      case 'year':
        start = getStartOfYear(currentDate);
        end = getEndOfYear(currentDate);
        break;
      case 'month':
      default:
        start = getStartOfMonth(currentDate);
        end = getEndOfMonth(currentDate);
        break;
    }
    return { startDate: start, endDate: end };
  }, [currentDate, scale]);
  
  const todayDate = new Date();
  
  const startDateMs = startDate.getTime();
  const endDateMs = endDate.getTime();
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
  
  const { visibleEvents, religiousHolidays, civilHolidays } = useMemo(() => {
    const visibleEvents = events.filter(event => {
      const eventDateMs = new Date(event.when.timestamp).getTime();
      return eventDateMs >= startDateMs && eventDateMs <= endDateMs;
    });

    const holidaysToDisplay = selectedHolidayCategories.flatMap(category => HOLIDAY_DATA[category] || []);

    const visibleHolidays = holidaysToDisplay.filter(holiday => {
        const holidayDateMs = holiday.date.getTime();
        return holidayDateMs >= startDateMs && holidayDateMs <= endDateMs;
    });

    return {
      visibleEvents,
      religiousHolidays: visibleHolidays.filter(h => h.type === 'religious'),
      civilHolidays: visibleHolidays.filter(h => h.type === 'civil'),
    };
  }, [events, selectedHolidayCategories, startDateMs, endDateMs]);


  return (
    <div className="bg-secondary border border-primary rounded-lg p-8 w-full mt-4">
      <div className="relative w-full h-48">
        
        {/* Today Marker Vertical Line */}
        {isTodayVisible && (
          <div
            className="absolute top-0 bottom-0 w-px bg-wha-blue/70 z-0"
            style={{ left: `${todayPositionPercent}%` }}
            aria-hidden="true"
          />
        )}
        
        <div className="absolute top-1/2 -translate-y-1/2 left-2.5 right-2.5 h-2 bg-blue-500/50 rounded-full z-10">
            <div className="h-full bg-blue-500 rounded-full"></div>
        </div>

        {/* Container for markers above the line */}
        <div className="absolute top-0 left-0 w-full h-full z-20">
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
                        {activeTooltip === event.id && (
                           <div className="absolute bottom-full mb-2 w-56 bg-tertiary text-primary text-xs rounded-md shadow-lg p-2 z-20 pointer-events-none">
                                <p className="font-bold text-sm">{event.what.name}</p>
                                {event.what.description && <p className="text-secondary mt-1">{event.what.description}</p>}
                            </div>
                        )}
                        <div className="w-3 h-3 bg-wha-blue rounded-full border-2 border-secondary cursor-pointer"/>
                    </div>
                );
            })}
        </div>

        {/* Tier 1: Religious Holidays */}
        {religiousHolidays.map(holiday => {
          const position = getPositionPercent(holiday.date);
          return (
            <div
              key={`${holiday.name}-religious-${holiday.date.getTime()}`}
              className="absolute top-1/2 h-full"
              style={{ left: `${position}%`, zIndex: 20 }}
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 h-8 w-px bg-secondary" />
              <div
                className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-default"
                title={`${holiday.name} (${holiday.category})`}
              >
                <span className="text-lg leading-none" aria-hidden="true">{getIconForHoliday(holiday)}</span>
                <span className="text-xs text-secondary whitespace-nowrap">{holiday.name}</span>
              </div>
            </div>
          );
        })}

        {/* Tier 2: Civil Holidays */}
        {civilHolidays.map(holiday => {
          const position = getPositionPercent(holiday.date);
          return (
            <div
              key={`${holiday.name}-civil-${holiday.date.getTime()}`}
              className="absolute top-1/2 h-full"
              style={{ left: `${position}%`, zIndex: 20 }}
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 h-20 w-px bg-secondary" />
              <div
                className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-default"
                title={`${holiday.name} (${holiday.category})`}
              >
                <span className="text-lg leading-none" aria-hidden="true">{getIconForHoliday(holiday)}</span>
                <span className="text-xs text-secondary whitespace-nowrap">{holiday.name}</span>
              </div>
            </div>
          );
        })}


        {/* Markers ON the line (Start, End, Today) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-30">
            <div className="absolute top-1/2 -translate-y-1/2" style={{left: '0%'}}>
                <TimelineMarker label={formatDate(startDate)} align="left"/>
            </div>
            
            {isTodayVisible && (
                <div className="absolute top-1/2 -translate-y-1/2" style={{left: `${todayPositionPercent}%`, transform: 'translateX(-50%)'}}>
                    <TimelineMarker label={"Today " + formatDate(todayDate)} isToday />
                </div>
            )}

            <div className="absolute top-1/2 -translate-y-1/2" style={{left: '100%', transform: 'translateX(-100%)'}}>
                 <TimelineMarker label={formatDate(endDate)} align="right"/>
            </div>
        </div>

      </div>
    </div>
  );
};