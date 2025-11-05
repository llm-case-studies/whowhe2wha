import React, { useState, useMemo, useRef, useEffect } from 'react';
import { EventNode, TimelineScale, Holiday, Project, WhatType } from '../types';
import { HOLIDAY_DATA } from '../constants';
import { MilestoneIcon, DeadlineIcon, CheckpointIcon, ChevronsLeftIcon, ChevronsRightIcon } from './icons';

interface TimelineViewProps {
  events: EventNode[];
  projects: Project[];
  currentDate: Date;
  scale: TimelineScale;
  selectedHolidayCategories: string[];
  selectedProjectCategories: string[];
  setTimelineDate: (date: Date) => void;
}

const projectColorStyles: Record<string, { bg: string, border: string, text: string }> = {
    blue:   { bg: 'bg-blue-500',   border: 'border-blue-700', text: 'text-blue-200' },
    green:  { bg: 'bg-green-500',  border: 'border-green-700', text: 'text-green-200' },
    pink:   { bg: 'bg-pink-500',   border: 'border-pink-700', text: 'text-pink-200' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-purple-200' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-700', text: 'text-orange-200' },
    yellow: { bg: 'bg-yellow-500', border: 'border-yellow-700', text: 'text-yellow-200' },
};
const defaultColorStyle = projectColorStyles.blue;

// --- Layout Constants ---
const TIMELINE_Y_OFFSET_TOP = '8rem';
const TIMELINE_Y_OFFSET_MIDDLE = '0rem';
const TIMELINE_Y_OFFSET_BOTTOM = '8rem';
const LANE_HEIGHT = 36;
const LANE_START_OFFSET = 20; // Start lanes this many pixels away from the timeline bar
const CATEGORY_GAP = 16; // Visual gap between categories in the sidebar

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

const TimelineMarker: React.FC<{ label?: string; isToday?: boolean, align?: 'left' | 'center' | 'right' }> = ({ label, isToday = false, align = 'center' }) => {
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
      {label && <div className={labelContainerClasses}>
        <span className={`text-xs uppercase tracking-wider ${textColor}`}>{label}</span>
      </div>}
    </div>
  );
};

const PointEventMarker: React.FC<{event: EventNode, colorStyle: {bg: string, border: string, text: string}}> = ({ event, colorStyle }) => {
    const commonClasses = `w-4 h-4 ${colorStyle.bg} ${colorStyle.text}`;
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


export const TimelineView: React.FC<TimelineViewProps> = ({ events, projects, currentDate, scale, selectedHolidayCategories, selectedProjectCategories, setTimelineDate }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ startX: 0, startDragDate: new Date() });
  
  const projectColorMap = useMemo(() => new Map(projects.map(p => [p.id, p.color])), [projects]);

  const {
    laneInfo,
    categoryOffsets,
    tier3Categories,
    tier2Categories,
    tier1Categories,
    maxTier3Offset,
    maxTier2Offset,
    maxTier1Offset,
  } = useMemo(() => {
    const TIER3_CATEGORIES = ['Home', 'Personal'];
    const TIER2_CATEGORIES = ['Work', 'Health'];

    const visibleProjects = projects.filter(p => selectedProjectCategories.includes(p.category));
    
    const tier3Projects = visibleProjects.filter(p => TIER3_CATEGORIES.includes(p.category));
    const tier2Projects = visibleProjects.filter(p => TIER2_CATEGORIES.includes(p.category));
    const tier1Projects = visibleProjects.filter(p => !TIER3_CATEGORIES.includes(p.category) && !TIER2_CATEGORIES.includes(p.category));

    const generatedLaneInfo = new Map<number, { tier: number, laneIndex: number, topOffset: number }>();
    const generatedCatOffsets = new Map<string, { top: number, height: number }>();
    const tier3Cats = new Set<string>();
    const tier2Cats = new Set<string>();
    const tier1Cats = new Set<string>();
    let maxT3 = 0, maxT2 = 0, maxT1 = 0;

    const process = (projectList: Project[], tier: number) => {
      const grouped = new Map<string, Project[]>();
      projectList.forEach(p => {
        if (tier === 3) tier3Cats.add(p.category);
        else if (tier === 2) tier2Cats.add(p.category);
        else tier1Cats.add(p.category);

        if (!grouped.has(p.category)) grouped.set(p.category, []);
        grouped.get(p.category)!.push(p);
      });

      const sortedGrouped = new Map([...grouped.entries()].sort((a,b) => a[0].localeCompare(b[0])));
      let currentLane = 0;
      let categoryCount = 0;

      for (const [category, projectsInCategory] of sortedGrouped.entries()) {
        const categoryTop = LANE_START_OFFSET + currentLane * LANE_HEIGHT + categoryCount * CATEGORY_GAP;
        projectsInCategory.sort((a,b) => a.id - b.id);

        projectsInCategory.forEach(project => {
          const topOffset = LANE_START_OFFSET + currentLane * LANE_HEIGHT + categoryCount * CATEGORY_GAP;
          generatedLaneInfo.set(project.id, { tier, laneIndex: currentLane, topOffset });
          if (tier === 3) maxT3 = Math.max(maxT3, topOffset);
          else if (tier === 2) maxT2 = Math.max(maxT2, topOffset);
          else maxT1 = Math.max(maxT1, topOffset);
          currentLane++;
        });

        const categoryHeight = projectsInCategory.length * LANE_HEIGHT;
        generatedCatOffsets.set(category, { top: categoryTop, height: categoryHeight });
        if (projectsInCategory.length > 0) categoryCount++;
      }
    };
    
    process(tier3Projects, 3);
    process(tier2Projects, 2);
    process(tier1Projects, 1);

    return {
      laneInfo: generatedLaneInfo,
      categoryOffsets: generatedCatOffsets,
      tier3Categories: [...tier3Cats].sort(),
      tier2Categories: [...tier2Cats].sort(),
      tier1Categories: [...tier1Cats].sort(),
      maxTier3Offset: maxT3,
      maxTier2Offset: maxT2,
      maxTier1Offset: maxT1,
    };
  }, [projects, selectedProjectCategories]);

  const { startDate, endDate, totalDuration } = useMemo(() => {
    const msInDay = 24 * 60 * 60 * 1000;
    let durationMs: number;
    switch (scale) {
      case 'week': durationMs = 7 * msInDay; break;
      case 'month':
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        durationMs = daysInMonth * msInDay; break;
      case 'quarter': durationMs = 91.25 * msInDay; break;
      case 'year':
        const isLeap = new Date(currentDate.getFullYear(), 1, 29).getDate() === 29;
        durationMs = (isLeap ? 366 : 365) * msInDay; break;
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
  
  const { periodEvents, pointEvents, holidays } = useMemo(() => {
    const visibleEvents = events.filter(event => {
      if (!laneInfo.has(event.projectId)) return false;
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
      holidays: visibleHolidays,
    };
  }, [events, laneInfo, selectedHolidayCategories, startDateMs, endDateMs]);

  const renderTooltip = (event: EventNode) => (
    <div className="absolute bottom-full mb-2 w-56 bg-tertiary text-primary text-xs rounded-md shadow-lg p-2 z-30 pointer-events-none">
      <p className="font-bold text-sm">{event.what.name}</p>
      {event.what.description && <p className="text-secondary mt-1">{event.what.description}</p>}
    </div>
  );

  const containerHeight = Math.max(350, 150 + maxTier3Offset + maxTier2Offset + maxTier1Offset);

  const getEventPositionAndDropline = (info: { tier: number, topOffset: number }) => {
      let topPosition = '';
      let droplineStyle: React.CSSProperties = {};
      switch (info.tier) {
          case 3: // Top bar
              topPosition = `calc(50% - ${TIMELINE_Y_OFFSET_TOP} - ${info.topOffset}px)`;
              droplineStyle = { top: '50%', height: `${info.topOffset}px` };
              break;
          case 2: // Middle bar
              topPosition = `calc(50% + ${TIMELINE_Y_OFFSET_MIDDLE} - ${info.topOffset}px)`;
              droplineStyle = { top: '50%', height: `${info.topOffset}px` };
              break;
          case 1: // Bottom bar
              topPosition = `calc(50% + ${TIMELINE_Y_OFFSET_BOTTOM} - ${info.topOffset}px)`;
              droplineStyle = { top: '50%', height: `${info.topOffset}px` };
              break;
      }
      return { topPosition, droplineStyle };
  };

  const getPeriodEventPositionAndDropline = (info: { tier: number, topOffset: number }) => {
    let topPosition = '';
    let droplineStyle: React.CSSProperties = {};
     switch (info.tier) {
          case 3:
              topPosition = `calc(50% - ${TIMELINE_Y_OFFSET_TOP} - ${info.topOffset}px)`;
              droplineStyle = { top: '100%', height: `${info.topOffset - LANE_START_OFFSET + LANE_HEIGHT / 2}px`, left: '1px' };
              break;
          case 2:
              topPosition = `calc(50% + ${TIMELINE_Y_OFFSET_MIDDLE} - ${info.topOffset}px)`;
              droplineStyle = { top: '100%', height: `${info.topOffset - LANE_START_OFFSET + LANE_HEIGHT / 2}px`, left: '1px' };
              break;
          case 1:
              topPosition = `calc(50% + ${TIMELINE_Y_OFFSET_BOTTOM} - ${info.topOffset}px)`;
              droplineStyle = { top: '100%', height: `${info.topOffset - LANE_START_OFFSET + LANE_HEIGHT / 2}px`, left: '1px' };
              break;
      }
      return { topPosition, droplineStyle };
  }

  return (
    <div className="bg-secondary border border-primary rounded-lg p-8 w-full mt-4">
      <div className="flex w-full" style={{ height: `${containerHeight}px` }}>
        {/* Sidebar */}
        <div className={`relative flex-shrink-0 border-r border-primary pr-4 transition-all duration-300 ${isSidebarOpen ? 'w-48' : 'w-10'}`}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 rounded-full bg-tertiary hover:bg-wha-blue text-primary flex items-center justify-center"
            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarOpen ? <ChevronsLeftIcon /> : <ChevronsRightIcon />}
          </button>
          
          <div className={`transition-opacity duration-200 h-full relative ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             {tier3Categories.map(category => {
                const projectsInCategory = projects.filter(p => p.category === category);
                const offsetInfo = categoryOffsets.get(category);
                if (!offsetInfo) return null;
                const topPosition = `calc(50% - ${TIMELINE_Y_OFFSET_TOP} - ${offsetInfo.top}px - ${offsetInfo.height / 2}px)`;

                return (
                     <div key={category} className="absolute right-4 w-full text-right" style={{ top: topPosition, transform: 'translateY(-50%)' }}>
                         <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">{category}</p>
                         {projectsInCategory.map(project => {
                             const colorStyle = projectColorStyles[project.color] || defaultColorStyle;
                             return(
                                <div key={project.id} className="relative h-6 flex items-center justify-end">
                                    <p className="text-xs font-semibold text-primary truncate" title={project.name}>{project.name}</p>
                                    <span className={`w-2 h-2 ${colorStyle.bg} rounded-full ml-2 flex-shrink-0`}></span>
                                </div>
                             )
                         })}
                    </div>
                );
            })}
            {tier2Categories.map(category => {
                const projectsInCategory = projects.filter(p => p.category === category);
                const offsetInfo = categoryOffsets.get(category);
                if (!offsetInfo) return null;
                const topPosition = `calc(50% + ${TIMELINE_Y_OFFSET_MIDDLE} - ${offsetInfo.top}px - ${offsetInfo.height / 2}px)`;

                return (
                     <div key={category} className="absolute right-4 w-full text-right" style={{ top: topPosition, transform: 'translateY(-50%)' }}>
                         <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">{category}</p>
                         {projectsInCategory.map(project => {
                             const colorStyle = projectColorStyles[project.color] || defaultColorStyle;
                             return(
                                <div key={project.id} className="relative h-6 flex items-center justify-end">
                                    <p className="text-xs font-semibold text-primary truncate" title={project.name}>{project.name}</p>
                                    <span className={`w-2 h-2 ${colorStyle.bg} rounded-full ml-2 flex-shrink-0`}></span>
                                </div>
                             )
                         })}
                    </div>
                );
            })}
             {tier1Categories.map(category => {
                const projectsInCategory = projects.filter(p => p.category === category);
                const offsetInfo = categoryOffsets.get(category);
                if (!offsetInfo) return null;
                const topPosition = `calc(50% + ${TIMELINE_Y_OFFSET_BOTTOM} - ${offsetInfo.top}px - ${offsetInfo.height / 2}px)`;

                 return (
                     <div key={category} className="absolute right-4 w-full text-right" style={{ top: topPosition, transform: 'translateY(-50%)' }}>
                         <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">{category}</p>
                         {projectsInCategory.map(project => {
                             const colorStyle = projectColorStyles[project.color] || defaultColorStyle;
                             return(
                                <div key={project.id} className="relative h-6 flex items-center justify-end">
                                    <p className="text-xs font-semibold text-primary truncate" title={project.name}>{project.name}</p>
                                    <span className={`w-2 h-2 ${colorStyle.bg} rounded-full ml-2 flex-shrink-0`}></span>
                                </div>
                             )
                         })}
                    </div>
                );
            })}
          </div>
        </div>
        
        {/* Timeline Area */}
        <div 
          ref={timelineRef}
          className="relative flex-grow h-full"
        >
          {/* Draggable pane */}
          <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {isTodayVisible && <div className="absolute top-0 bottom-0 w-px bg-wha-blue/70 z-10 pointer-events-none" style={{ left: `${todayPositionPercent}%` }} />}
          
          {/* Top timeline bar */}
          <div className="absolute left-0 right-0 h-2.5 bg-wha-blue/50 rounded-full" style={{ top: `calc(50% - ${TIMELINE_Y_OFFSET_TOP})` }} />
          {/* Middle timeline bar */}
          <div className="absolute left-0 right-0 h-2.5 bg-wha-blue/50 rounded-full" style={{ top: `calc(50% + ${TIMELINE_Y_OFFSET_MIDDLE})` }} />
          {/* Bottom timeline bar */}
          <div className="absolute left-0 right-0 h-2.5 bg-wha-blue/50 rounded-full" style={{ top: `calc(50% + ${TIMELINE_Y_OFFSET_BOTTOM})` }}/>

          <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
              {periodEvents.map(event => {
                  const info = laneInfo.get(event.projectId);
                  if (!info) return null;
                  
                  const startPercent = getPositionPercent(new Date(event.when.timestamp));
                  const endPercent = getPositionPercent(new Date(event.endWhen!.timestamp));
                  const widthPercent = Math.max(0.5, endPercent - startPercent);
                  const colorStyle = projectColorStyles[projectColorMap.get(event.projectId) || 'blue'] || defaultColorStyle;
                  const isHovered = activeTooltip === event.id;
                  
                  const { topPosition, droplineStyle } = getPeriodEventPositionAndDropline(info);
                  
                  return (
                      <div
                          key={event.id}
                          className="absolute h-6 pointer-events-auto"
                          style={{ left: `${startPercent}%`, width: `${widthPercent}%`, top: topPosition, transform: 'translateY(-50%)' }}
                          onMouseEnter={() => setActiveTooltip(event.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                      >
                          {isHovered && renderTooltip(event)}
                          <div className={`w-full h-full ${colorStyle.bg} opacity-70 hover:opacity-100 rounded flex items-center justify-start px-2 overflow-hidden transition-opacity`}>
                              <span className="text-white text-xs font-medium truncate">{event.what.name}</span>
                          </div>
                          <div className="absolute w-px bg-tertiary/70" style={droplineStyle} />
                      </div>
                  );
              })}
              {pointEvents.map(event => {
                  const info = laneInfo.get(event.projectId);
                  if (!info) return null;

                  const position = getPositionPercent(new Date(event.when.timestamp));
                  const colorStyle = projectColorStyles[projectColorMap.get(event.projectId) || 'blue'] || defaultColorStyle;
                  const isHovered = activeTooltip === event.id;
                  
                  const { topPosition, droplineStyle } = getEventPositionAndDropline(info);

                  return (
                      <div 
                          key={event.id}
                          className="absolute flex flex-col items-center z-20 pointer-events-auto"
                          style={{ left: `${position}%`, top: topPosition, transform: 'translate(-50%, -50%)' }}
                          onMouseEnter={() => setActiveTooltip(event.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                      >
                          {isHovered && renderTooltip(event)}
                          <PointEventMarker event={event} colorStyle={colorStyle} />
                          <div className="absolute left-1/2 -translate-x-1/2 w-px bg-tertiary/70" style={droplineStyle}/>
                      </div>
                  );
              })}
          </div>

          {/* Markers ON the line */}
          <div className="absolute top-0 bottom-0 left-0 w-full z-30 pointer-events-none">
              <div className="absolute top-1/2 -translate-y-1/2" style={{left: '0%'}}>
                  <div className="absolute" style={{top: `calc(0px - ${TIMELINE_Y_OFFSET_BOTTOM})`}}>
                     <TimelineMarker label={formatDate(startDate)} align="left"/>
                  </div>
              </div>
              {isTodayVisible && (
                  <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${todayPositionPercent}%`}}>
                      <div className="absolute" style={{top: `calc(0px - ${TIMELINE_Y_OFFSET_TOP})`}}><TimelineMarker isToday /></div>
                      <div className="absolute" style={{top: `calc(0px - ${TIMELINE_Y_OFFSET_MIDDLE})`}}><TimelineMarker isToday /></div>
                      <div className="absolute" style={{top: `calc(0px - ${TIMELINE_Y_OFFSET_BOTTOM})`}}><TimelineMarker label={"Today " + formatDate(todayDate)} isToday /></div>
                  </div>
              )}
              <div className="absolute top-1/2" style={{ left: '100%', transform: 'translate(-100%, -50%)' }}>
                   <div className="absolute" style={{top: `calc(0px - ${TIMELINE_Y_OFFSET_BOTTOM})`}}>
                       <TimelineMarker label={formatDate(endDate)} align="right"/>
                   </div>
              </div>
          </div>
        </div>
      </div>
      {/* Holiday Area */}
      <div className="relative w-full h-12 mt-4">
        {holidays.map(holiday => (
          <div key={`${holiday.name}-icon`} className="absolute top-0" style={{ left: `${getPositionPercent(holiday.date)}%`, zIndex: 5 }}>
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-default" title={`${holiday.name}`}>
                  <span className="text-lg leading-none">{getIconForHoliday(holiday)}</span>
                  <span className="text-xs text-secondary whitespace-nowrap">{holiday.name}</span>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};
