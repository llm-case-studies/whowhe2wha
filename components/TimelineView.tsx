import React, { useState, useMemo, useRef, useEffect } from 'react';
import { EventNode, TimelineScale, Holiday, Project, WhatType } from '../types';
import { HOLIDAY_DATA } from '../constants';
import { MilestoneIcon, DeadlineIcon, CheckpointIcon } from './icons';

interface TimelineViewProps {
  events: EventNode[];
  projects: Project[];
  currentDate: Date;
  scale: TimelineScale;
  selectedHolidayCategories: string[];
  selectedProjectIds: number[];
  setTimelineDate: (date: Date) => void;
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
    case 'US': return '🇺🇸';
    case 'Canada': return '🇨🇦';
    case 'Mexico': return '🇲🇽';
    case 'UK': return '🇬🇧';
    case 'EU': return '🇪🇺';
    case 'China': return '🇨🇳';
    case 'India': return '🇮🇳';
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
    <div className="relative">
      <div className={`rounded-full border-2 flex items-center justify-center ${circleSize} ${circleClasses}`}>
        <div className={`w-2 h-2 rounded-full ${dotClasses}`} />
      </div>
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

const LANE_HEIGHT = 32; // pixels for each swimlane
const LANE_TOP_OFFSET = 45; // pixels from center line to the center of the first lane

export const TimelineView: React.FC<TimelineViewProps> = ({ events, projects, currentDate, scale, selectedHolidayCategories, selectedProjectIds, setTimelineDate }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ startX: 0, startDragDate: new Date() });
  
  const projectColorMap = useMemo(() => new Map(projects.map(p => [p.id, p.color])), [projects]);

  const selectedProjects = useMemo(() => 
    projects.filter(p => selectedProjectIds.includes(p.id)).sort((a, b) => a.id - b.id),
    [projects, selectedProjectIds]
  );
  
  const projectLaneMap = useMemo(() => 
    new Map(selectedProjects.map((p, index) => [p.id, index])),
    [selectedProjects]
  );

  const { startDate, endDate, totalDuration } = useMemo(() => {
    const msInDay = 24 * 60 * 60 * 1000;
    let durationMs: number;

    switch (scale) {
      case 'week': durationMs = 7 * msInDay; break;
      case 'month':
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        durationMs = daysInMonth * msInDay;
        break;
      case 'quarter': durationMs = 91.25 * msInDay; break;
      case 'year':
        const isLeap = new Date(currentDate.getFullYear(), 1, 29).getDate() === 29;
        durationMs = (isLeap ? 366 : 365) * msInDay;
        break;
      default: durationMs = 30 * msInDay;
    }

    const start = new Date(currentDate.getTime() - durationMs / 2);
    const end = new Date(currentDate.getTime() + durationMs / 2);
    
    return { startDate: start, endDate: end, totalDuration: durationMs };
  }, [currentDate, scale]);
  
  const todayDate = new Date();
  
  const startDateMs = startDate.getTime();
  const endDateMs = endDate.getTime();

  useEffect(() => {
    const handleGlobalMouseUp = () => isDragging && setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    if (isDragging) {
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    dragInfo.current = { startX: e.pageX, startDragDate: currentDate };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !timelineRef.current) return;
    e.preventDefault();
    const walk = e.pageX - dragInfo.current.startX;
    const timelineWidth = timelineRef.current.offsetWidth;
    if (timelineWidth === 0) return;
    const timeDeltaMs = (walk * totalDuration) / timelineWidth;
    const newDate = new Date(dragInfo.current.startDragDate.getTime() - timeDeltaMs);
    setTimelineDate(newDate);
  };

  const handleMouseUp = () => setIsDragging(false);

  const getPositionPercent = (date: Date) => {
    if (totalDuration <= 0) return 0;
    const position = ((date.getTime() - startDateMs) / totalDuration) * 100;
    return Math.max(0, Math.min(100, position));
  };
  
  const isTodayVisible = todayDate.getTime() >= startDateMs && todayDate.getTime() <= endDateMs;
  const todayPositionPercent = isTodayVisible ? getPositionPercent(todayDate) : -1;

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric' });
  
  const { periodEvents, pointEvents, religiousHolidays, civilHolidays } = useMemo(() => {
    const visibleEvents = events.filter(event => {
      if (!selectedProjectIds.includes(event.projectId)) return false;
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
  }, [events, selectedProjectIds, selectedHolidayCategories, startDateMs, endDateMs]);

  const renderTooltip = (event: EventNode) => (
    <div className="absolute bottom-full mb-2 w-56 bg-tertiary text-primary text-xs rounded-md shadow-lg p-2 z-30 pointer-events-none">
      <p className="font-bold text-sm">{event.what.name}</p>
      {event.what.description && <p className="text-secondary mt-1">{event.what.description}</p>}
    </div>
  );

  const containerHeight = 192 + (selectedProjects.length * LANE_HEIGHT);

  return (
    <div className="bg-secondary border border-primary rounded-lg p-8 w-full mt-4">
      <div className="flex w-full" style={{ height: `${containerHeight}px` }}>

        {/* Labels Area */}
        <div className="relative w-40 flex-shrink-0 border-r border-primary pr-2">
          {selectedProjects.map((project, index) => {
            const laneCenterTop = `calc(50% - ${LANE_TOP_OFFSET}px - ${index * LANE_HEIGHT}px)`;
            const colorStyle = projectColorStyles[project.color] || defaultColorStyle;
            return (
              <div key={project.id} className="absolute right-2 text-right w-full flex items-center justify-end" style={{ top: laneCenterTop, transform: 'translateY(-50%)' }}>
                 <p className="text-xs font-semibold text-primary truncate" title={project.name}>{project.name}</p>
                 <span className={`w-2 h-2 ${colorStyle.bg} rounded-full ml-2 flex-shrink-0`}></span>
              </div>
            );
          })}
        </div>
        
        {/* Timeline Area */}
        <div 
          ref={timelineRef}
          className="relative flex-grow h-full cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {isTodayVisible && <div className="absolute top-0 bottom-0 w-px bg-wha-blue/70 z-0" style={{ left: `${todayPositionPercent}%` }} />}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2.5 bg-wha-blue/50 rounded-full" />

          {/* Container for ALL Events (Points and Periods) */}
          <div className="absolute top-0 left-0 w-full h-full z-10">
              {/* Period Events */}
              {periodEvents.map(event => {
                  const laneIndex = projectLaneMap.get(event.projectId);
                  if (laneIndex === undefined) return null;

                  const startPercent = getPositionPercent(new Date(event.when.timestamp));
                  const endPercent = getPositionPercent(new Date(event.endWhen!.timestamp));
                  const widthPercent = Math.max(0.5, endPercent - startPercent);
                  const colorStyle = projectColorStyles[projectColorMap.get(event.projectId) || 'blue'] || defaultColorStyle;
                  const topPosition = `calc(50% - ${LANE_TOP_OFFSET}px - ${laneIndex * LANE_HEIGHT}px)`;
                  const isHovered = activeTooltip === event.id;
                  
                  return (
                      <div
                          key={event.id}
                          className="absolute h-6"
                          style={{ left: `${startPercent}%`, width: `${widthPercent}%`, top: topPosition, transform: 'translateY(-50%)' }}
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
              {/* Point Events */}
              {pointEvents.map(event => {
                  const laneIndex = projectLaneMap.get(event.projectId);
                  if (laneIndex === undefined) return null;

                  const position = getPositionPercent(new Date(event.when.timestamp));
                  const colorStyle = projectColorStyles[projectColorMap.get(event.projectId) || 'blue'] || defaultColorStyle;
                  const topPosition = `calc(50% - ${LANE_TOP_OFFSET}px - ${laneIndex * LANE_HEIGHT}px)`;
                  const isHovered = activeTooltip === event.id;
                  return (
                      <div 
                          key={event.id}
                          className="absolute flex flex-col items-center z-20"
                          style={{ left: `${position}%`, top: topPosition, transform: 'translate(-50%, -50%)' }}
                          onMouseEnter={() => setActiveTooltip(event.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                      >
                          {isHovered && renderTooltip(event)}
                          <PointEventMarker event={event} colorStyle={colorStyle} />
                      </div>
                  );
              })}
          </div>

          {/* Holiday Tiers (Below the line) */}
          {religiousHolidays.map(holiday => (
            <div key={`${holiday.name}-rel`} className="absolute top-1/2 h-full" style={{ left: `${getPositionPercent(holiday.date)}%`, zIndex: 5 }}>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 h-8 w-px bg-secondary" />
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-default" title={`${holiday.name}`}>
                <span className="text-lg leading-none">{getIconForHoliday(holiday)}</span>
                <span className="text-xs text-secondary whitespace-nowrap">{holiday.name}</span>
              </div>
            </div>
          ))}
          {civilHolidays.map(holiday => (
            <div key={`${holiday.name}-civ`} className="absolute top-1/2 h-full" style={{ left: `${getPositionPercent(holiday.date)}%`, zIndex: 5 }}>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 h-20 w-px bg-secondary" />
              <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-default" title={`${holiday.name}`}>
                <span className="text-lg leading-none">{getIconForHoliday(holiday)}</span>
                <span className="text-xs text-secondary whitespace-nowrap">{holiday.name}</span>
              </div>
            </div>
          ))}

          {/* Markers ON the line (Start, End, Today) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-30 pointer-events-none">
              <div className="absolute top-1/2 -translate-y-1/2" style={{left: '0%'}}>
                  <TimelineMarker label={formatDate(startDate)} align="left"/>
              </div>
              {isTodayVisible && (
                  <div className="absolute top-1/2" style={{ left: `${todayPositionPercent}%`, transform: 'translate(-50%, -50%)' }}>
                      <TimelineMarker label={"Today " + formatDate(todayDate)} isToday />
                  </div>
              )}
              <div className="absolute top-1/2" style={{ left: '100%', transform: 'translate(-100%, -50%)' }}>
                   <TimelineMarker label={formatDate(endDate)} align="right"/>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};