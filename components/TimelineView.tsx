import React, { useState, useMemo } from 'react';
import { EventNode, TimelineScale, Holiday, Project, WhatType } from '../types';
import { HOLIDAY_DATA } from '../constants';
import { 
    getStartOfWeek, getEndOfWeek,
    getStartOfMonth, getEndOfMonth,
    getStartOfQuarter, getEndOfQuarter,
    getStartOfYear, getEndOfYear
} from '../utils/dateUtils';
import { MilestoneIcon, DeadlineIcon, CheckpointIcon } from './icons';

interface TimelineViewProps {
  events: EventNode[];
  projects: Project[];
  currentDate: Date;
  scale: TimelineScale;
  selectedHolidayCategories: string[];
}

const projectColorStyles: Record<string, { bg: string, border: string }> = {
    blue:   { bg: 'bg-blue-500',   border: 'border-blue-700' },
    green:  { bg: 'bg-green-500',  border: 'border-green-700' },
    pink:   { bg: 'bg-pink-500',   border: 'border-pink-700' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-700' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-700' },
    yellow: { bg: 'bg-yellow-500', border: 'border-yellow-700' },
};
const defaultColorStyle = projectColorStyles.blue;


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
  const circleSize = isToday ? 'w-6 h-6' : 'w-5 h-5';
  
  const todayCircleClasses = 'bg-gradient-to-br from-blue-400 to-wha-blue border-blue-300 shadow-[0_0_12px_2px_rgba(59,130,246,0.6)]';
  const defaultCircleClasses = 'bg-tertiary border-secondary';
  const circleClasses = isToday ? todayCircleClasses : defaultCircleClasses;

  const dotClasses = 'bg-background-primary';

  const textColor = isToday ? 'text-wha-blue font-bold' : 'text-secondary';

  let labelContainerClasses = 'absolute top-full mt-2 w-max ';
  if (align === 'left') {
    labelContainerClasses += 'left-0';
  } else if (align === 'right') {
    labelContainerClasses += 'right-0 text-right';
  } else {
    labelContainerClasses += 'left-1/2 -translate-x-1/2 text-center';
  }

  return (
    <div className="relative"> {/* Positioning context for the label */}
      {/* This div IS the marker that gets centered */}
      <div className={`rounded-full border-2 flex items-center justify-center ${circleSize} ${circleClasses}`}>
        <div className={`w-2 h-2 rounded-full ${dotClasses}`} />
      </div>
      
      {/* The label is positioned absolutely, so it doesn't affect vertical alignment */}
      <div className={labelContainerClasses}>
        <span className={`text-xs uppercase tracking-wider ${textColor}`}>{label}</span>
      </div>
    </div>
  );
};

const PointEventMarker: React.FC<{event: EventNode, colorStyle: {bg: string, border: string}}> = ({ event, colorStyle }) => {
    const commonClasses = `w-4 h-4 ${colorStyle.bg}`;
    switch(event.what.whatType) {
        case WhatType.Milestone:
            return <MilestoneIcon className={commonClasses} />;
        case WhatType.Deadline:
            return <DeadlineIcon className={commonClasses} />;
        case WhatType.Checkpoint:
            return <CheckpointIcon className={commonClasses} />;
        case WhatType.Appointment:
        default:
             return <div className={`w-3 h-3 ${colorStyle.bg} rounded-full border-2 ${colorStyle.border} cursor-pointer`} />;
    }
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events, projects, currentDate, scale, selectedHolidayCategories }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  
  const projectColorMap = useMemo(() => 
      new Map(projects.map(p => [p.id, p.color])),
  [projects]);

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
  
  const { periodEvents, pointEvents, religiousHolidays, civilHolidays } = useMemo(() => {
    const visibleEvents = events.filter(event => {
      const eventDateMs = new Date(event.when.timestamp).getTime();
      const eventEndDateMs = event.endWhen ? new Date(event.endWhen.timestamp).getTime() : eventDateMs;
      return eventEndDateMs >= startDateMs && eventDateMs <= endDateMs;
    });

    const holidaysToDisplay = selectedHolidayCategories.flatMap(category => HOLIDAY_DATA[category] || []);
    const visibleHolidays = holidaysToDisplay.filter(holiday => {
        const holidayDateMs = holiday.date.getTime();
        return holidayDateMs >= startDateMs && holidayDateMs <= endDateMs;
    });
    
    return {
      periodEvents: visibleEvents.filter(e => e.what.whatType === WhatType.Period && e.endWhen),
      pointEvents: visibleEvents.filter(e => e.what.whatType !== WhatType.Period),
      religiousHolidays: visibleHolidays.filter(h => h.type === 'religious'),
      civilHolidays: visibleHolidays.filter(h => h.type === 'civil'),
    };
  }, [events, selectedHolidayCategories, startDateMs, endDateMs]);

  const renderTooltip = (event: EventNode) => (
    <div className="absolute bottom-full mb-2 w-56 bg-tertiary text-primary text-xs rounded-md shadow-lg p-2 z-30 pointer-events-none">
      <p className="font-bold text-sm">{event.what.name}</p>
      {event.what.description && <p className="text-secondary mt-1">{event.what.description}</p>}
    </div>
  );

  return (
    <div className="bg-secondary border border-primary rounded-lg p-8 w-full mt-4">
      <div className="relative w-full h-48">
        
        {isTodayVisible && (
          <div
            className="absolute top-0 bottom-0 w-px bg-wha-blue/70 z-0"
            style={{ left: `${todayPositionPercent}%` }}
            aria-hidden="true"
          />
        )}
        
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-tertiary" />

        {/* Container for Period Events (bars) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-10 z-10">
            {periodEvents.map(event => {
                const startPercent = getPositionPercent(new Date(event.when.timestamp));
                const endPercent = getPositionPercent(new Date(event.endWhen!.timestamp));
                const widthPercent = Math.max(0.5, endPercent - startPercent);
                const colorStyle = projectColorStyles[projectColorMap.get(event.projectId) || 'blue'] || defaultColorStyle;
                const isHovered = activeTooltip === event.id;
                
                return (
                    <div
                        key={event.id}
                        className="absolute h-5"
                        style={{ left: `${startPercent}%`, width: `${widthPercent}%`, top: `calc(50% - 10px)`}}
                         onMouseEnter={() => setActiveTooltip(event.id)}
                         onMouseLeave={() => setActiveTooltip(null)}
                    >
                         {isHovered && renderTooltip(event)}
                         <div className={`w-full h-full ${colorStyle.bg} opacity-70 hover:opacity-100 rounded flex items-center justify-start px-2 overflow-hidden transition-opacity`}>
                             <span className="text-white text-xs font-medium truncate">{event.what.name}</span>
                         </div>
                    </div>
                );
            })}
        </div>


        {/* Container for Point Events (dots, icons) */}
        <div className="absolute top-0 left-0 w-full h-full z-20">
            {pointEvents.map(event => {
                const position = getPositionPercent(new Date(event.when.timestamp));
                const colorStyle = projectColorStyles[projectColorMap.get(event.projectId) || 'blue'] || defaultColorStyle;
                const isHovered = activeTooltip === event.id;
                return (
                    <div 
                        key={event.id}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${position}%`, top: 'calc(50% - 28px)', transform: 'translateX(-50%)' }}
                        onMouseEnter={() => setActiveTooltip(event.id)}
                        onMouseLeave={() => setActiveTooltip(null)}
                    >
                        {isHovered && renderTooltip(event)}
                        <PointEventMarker event={event} colorStyle={colorStyle} />
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
              style={{ left: `${position}%`, zIndex: 5 }}
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
              style={{ left: `${position}%`, zIndex: 5 }}
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
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-30 pointer-events-none">
            <div className="absolute top-1/2 -translate-y-1/2" style={{left: '0%'}}>
                <TimelineMarker label={formatDate(startDate)} align="left"/>
            </div>
            
            {isTodayVisible && (
                <div 
                  className="absolute top-1/2" 
                  style={{
                    left: `${todayPositionPercent}%`, 
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                    <TimelineMarker label={"Today " + formatDate(todayDate)} isToday />
                </div>
            )}

            <div 
              className="absolute top-1/2" 
              style={{
                left: '100%', 
                transform: 'translate(-100%, -50%)'
              }}
            >
                 <TimelineMarker label={formatDate(endDate)} align="right"/>
            </div>
        </div>

      </div>
    </div>
  );
};