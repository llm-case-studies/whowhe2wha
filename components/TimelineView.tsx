import React, { useState, useMemo, useRef, useEffect } from 'react';
import { EventNode, TimelineScale, Holiday, Project, WhatType, Tier, TierConfig } from '../types';
import { HOLIDAY_DATA, PROJECT_CATEGORIES } from '../constants';
import { MilestoneIcon, DeadlineIcon, CheckpointIcon, ChevronsLeftIcon, ChevronsRightIcon } from './icons';

interface TimelineViewProps {
  events: EventNode[];
  projects: Project[];
  currentDate: Date;
  scale: TimelineScale;
  selectedHolidayCategories: string[];
  selectedProjectCategories: string[];
  setTimelineDate: (date: Date) => void;
  tierConfig: TierConfig;
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
const LANE_HEIGHT = 36;
const LANE_START_OFFSET = 20;
const CATEGORY_GAP = 16;
const TIMELINE_BAR_HEIGHT = 10;
const MIN_CONTAINER_HEIGHT = 350;
const HOLIDAY_AREA_HEIGHT = 48;

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


export const TimelineView: React.FC<TimelineViewProps> = ({ events, projects, currentDate, scale, selectedHolidayCategories, selectedProjectCategories, setTimelineDate, tierConfig }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredHoliday, setHoveredHoliday] = useState<Holiday | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ startX: 0, startDragDate: new Date() });
  const latestMouseX = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  
  const projectColorMap = useMemo(() => new Map(projects.map(p => [p.id, p.color])), [projects]);

  const {
    laneInfo,
    categoryLayout,
    tierLayouts,
    containerHeight,
  } = useMemo(() => {
    const visibleProjects = projects.filter(p => selectedProjectCategories.includes(p.category));
    const projectCategoryMap = new Map<number, string>(projects.map(p => [p.id, p.category]));
    
    const finalTierConfig: TierConfig = JSON.parse(JSON.stringify(tierConfig));
    const assignedCategories = new Set(finalTierConfig.flatMap(t => t.categories));
    const unassignedCategories = PROJECT_CATEGORIES.filter(c => !assignedCategories.has(c));

    if (unassignedCategories.length > 0 && finalTierConfig.length > 0) {
      finalTierConfig[finalTierConfig.length - 1].categories.push(...unassignedCategories);
    } else if (unassignedCategories.length > 0) {
      finalTierConfig.push({ id: 'tier-unassigned', name: 'Unassigned', categories: unassignedCategories });
    }

    const categoryToTierMap = new Map<string, number>();
    finalTierConfig.forEach((tier, index) => {
        tier.categories.forEach(cat => categoryToTierMap.set(cat, index));
    });
    
    const generatedLaneInfo = new Map<number, { tierIndex: number, laneIndex: number, topOffset: number }>();
    const generatedCategoryLayouts = new Map<string, { top: number, height: number, tierIndex: number }>();
    const generatedTierLayouts = finalTierConfig.map(() => ({ totalHeight: 0, categories: new Set<string>() }));
    
    let totalSwimlaneHeight = 0;

    finalTierConfig.forEach((tier, tierIndex) => {
        const projectsInTier = visibleProjects.filter(p => tier.categories.includes(p.category));
        const groupedByCategory = new Map<string, Project[]>();
        
        projectsInTier.forEach(p => {
            if(!groupedByCategory.has(p.category)) groupedByCategory.set(p.category, []);
            groupedByCategory.get(p.category)!.push(p);
        });

        const sortedCategories = [...groupedByCategory.keys()].sort();
        let currentLane = 0;
        let categoryCount = 0;

        for (const category of sortedCategories) {
            const projectsInCategory = groupedByCategory.get(category)!.sort((a,b) => a.id - b.id);
            const categoryTop = LANE_START_OFFSET + currentLane * LANE_HEIGHT + categoryCount * CATEGORY_GAP;
            
            projectsInCategory.forEach(project => {
                const topOffset = LANE_START_OFFSET + currentLane * LANE_HEIGHT + categoryCount * CATEGORY_GAP;
                generatedLaneInfo.set(project.id, { tierIndex, laneIndex: currentLane, topOffset });
                currentLane++;
            });
            
            const categoryHeight = projectsInCategory.length * LANE_HEIGHT;
            generatedCategoryLayouts.set(category, { top: categoryTop, height: categoryHeight, tierIndex });
            if (projectsInCategory.length > 0) {
                generatedTierLayouts[tierIndex].categories.add(category);
                categoryCount++;
            }
        }
        const tierHeight = currentLane * LANE_HEIGHT + Math.max(0, categoryCount - 1) * CATEGORY_GAP + LANE_START_OFFSET * 2;
        generatedTierLayouts[tierIndex].totalHeight = tierHeight;
        totalSwimlaneHeight += tierHeight;
    });
    
    const finalContainerHeight = Math.max(MIN_CONTAINER_HEIGHT, totalSwimlaneHeight + (finalTierConfig.length -1) * TIMELINE_BAR_HEIGHT);

    return {
      laneInfo: generatedLaneInfo,
      categoryLayout: generatedCategoryLayouts,
      tierLayouts: generatedTierLayouts,
      containerHeight: finalContainerHeight,
    };
  }, [projects, selectedProjectCategories, tierConfig]);

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
    const handleGlobalMouseUp = () => {
        if(isDragging) {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
            setIsDragging(false);
        }
    };
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
    latestMouseX.current = e.pageX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !timelineRef.current) return;
    e.preventDefault();
    latestMouseX.current = e.pageX;

    const updateOnFrame = () => {
        if (!timelineRef.current) return;
        const walk = latestMouseX.current - dragInfo.current.startX;
        const timelineWidth = timelineRef.current.offsetWidth;
        if (timelineWidth === 0) return;
        const timeDeltaMs = (walk * totalDuration) / timelineWidth;
        const newDate = new Date(dragInfo.current.startDragDate.getTime() - timeDeltaMs);
        setTimelineDate(newDate);
        animationFrameId.current = null;
    };
    
    if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(updateOnFrame);
    }
  };

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

  const totalTierHeights = tierLayouts.reduce((sum, tier) => sum + tier.totalHeight, 0);
  const totalBarHeights = Math.max(0, tierLayouts.length - 1) * TIMELINE_BAR_HEIGHT;
  const contentHeight = totalTierHeights + totalBarHeights;

  let accumulatedHeight = (containerHeight - contentHeight) / 2;
  const barPositions: number[] = [];
  const tierPositions: number[] = [];

  tierLayouts.forEach((tier, index) => {
    tierPositions.push(accumulatedHeight);
    accumulatedHeight += tier.totalHeight;
    if (index < tierLayouts.length - 1) {
        barPositions.push(accumulatedHeight + TIMELINE_BAR_HEIGHT / 2);
        accumulatedHeight += TIMELINE_BAR_HEIGHT;
    }
  });

  return (
    <div className="bg-secondary border border-primary rounded-lg p-8 w-full mt-4">
      <div className="flex w-full">
        {/* Sidebar */}
        <div className={`relative flex-shrink-0 border-r border-primary pr-4 transition-all duration-300 ${isSidebarOpen ? 'w-48' : 'w-10'}`}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 rounded-full bg-tertiary hover:bg-wha-blue text-primary flex items-center justify-center"
            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarOpen ? <ChevronsLeftIcon /> : <ChevronsRightIcon />}
          </button>
          
          <div className={`transition-opacity duration-200 h-full relative ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ height: `${containerHeight}px` }}>
             {tierLayouts.map((tierLayout, tierIndex) => {
                 const tierTop = tierPositions[tierIndex];
                 const sortedCategories = [...tierLayout.categories].sort();
                 return sortedCategories.map(category => {
                     const projectsInCategory = projects.filter(p => p.category === category);
                     const offsetInfo = categoryLayout.get(category);
                     if (!offsetInfo) return null;

                     const topPosition = tierTop + offsetInfo.top + offsetInfo.height / 2;
                     return (
                         <div key={`${tierIndex}-${category}`} className="absolute right-4 w-full text-right" style={{ top: `${topPosition}px`, transform: 'translateY(-50%)' }}>
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
                 });
             })}
          </div>
        </div>
        
        {/* Timeline & Holiday Wrapper */}
        <div className="flex-grow">
          {/* Timeline Area */}
          <div 
            ref={timelineRef}
            className="relative w-full"
            style={{ height: `${containerHeight}px` }}
          >
            {/* Draggable pane */}
            <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            />

            {/* Vertical Holiday Lines */}
            {holidays.map(holiday => {
              const posPercent = getPositionPercent(holiday.date);
              const isHovered = hoveredHoliday?.name === holiday.name && hoveredHoliday.date.getTime() === holiday.date.getTime();
              const lineClasses = `absolute top-0 bottom-0 z-0 pointer-events-none transition-all duration-200 ${
                  isHovered 
                  ? 'w-0.5 bg-wha-blue shadow-[0_0_8px_1px_rgba(59,130,246,0.5)]' 
                  : 'w-px bg-wha-blue/50'
              }`;
              return (
                <div 
                  key={`${holiday.name}-${holiday.date}-line`}
                  className={lineClasses}
                  style={{ left: `${posPercent}%`, transform: 'translateX(-50%)' }}
                />
              );
            })}
            
            {isTodayVisible && <div className="absolute top-0 bottom-0 w-[1.5px] bg-wha-blue/80 z-10 pointer-events-none" style={{ left: `${todayPositionPercent}%`, transform: 'translateX(-50%)' }} />}
            
            {barPositions.map((top, index) => (
               <div key={`bar-${index}`} className="absolute left-0 right-0 h-2.5 bg-wha-blue/50 rounded-full" style={{ top: `${top}px`, transform: 'translateY(-50%)' }} />
            ))}

            <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
                {pointEvents.map(event => {
                    const info = laneInfo.get(event.projectId);
                    if (!info) return null;

                    const position = getPositionPercent(new Date(event.when.timestamp));
                    const colorStyle = projectColorStyles[projectColorMap.get(event.projectId) || 'blue'] || defaultColorStyle;
                    const isHovered = activeTooltip === event.id;
                    
                    const tierTop = tierPositions[info.tierIndex];
                    const barY = barPositions[info.tierIndex] || barPositions[info.tierIndex - 1] || 0;
                    const eventY = tierTop + info.topOffset;

                    const topPosition = `${eventY}px`;
                    const droplineHeight = Math.abs(barY - eventY);
                    const droplineTop = Math.min(barY, eventY);
                    
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
                            <div className="absolute left-1/2 -translate-x-1/2 w-px bg-tertiary/70" style={{ top: `${droplineTop - eventY}px`, height: `${droplineHeight}px` }}/>
                        </div>
                    );
                })}
            </div>

            {/* Markers ON the line */}
            <div className="absolute top-0 bottom-0 left-0 w-full z-30 pointer-events-none">
                <div className="absolute -translate-y-1/2" style={{left: '0%', top: barPositions[0] || '50%' }}>
                    <TimelineMarker label={formatDate(startDate)} align="left"/>
                </div>
                {isTodayVisible && barPositions.map((barTop, index) => (
                    <div key={`today-${index}`} className="absolute -translate-y-1/2" style={{ left: `${todayPositionPercent}%`, top: `${barTop}px`, transform: 'translateX(-50%)'}}>
                        <TimelineMarker isToday={index === 0} label={index === 0 ? "Today " + formatDate(todayDate) : undefined} />
                    </div>
                ))}
                <div className="absolute" style={{ left: '100%', top: barPositions[0] || '50%', transform: 'translate(-100%, -50%)' }}>
                     <TimelineMarker label={formatDate(endDate)} align="right"/>
                </div>
            </div>
          </div>
          {/* Holiday Area */}
          <div className="relative w-full" style={{ height: `${HOLIDAY_AREA_HEIGHT}px`}}>
            {holidays.map(holiday => {
                const posPercent = getPositionPercent(holiday.date);
                return (
                    <div
                        key={`${holiday.name}-${holiday.date}`}
                        className="absolute top-0 h-full"
                        style={{ left: `${posPercent}%`, zIndex: 5, transform: 'translateX(-50%)' }}
                        onMouseEnter={() => setHoveredHoliday(holiday)}
                        onMouseLeave={() => setHoveredHoliday(null)}
                    >
                        <div className="relative flex flex-col items-center gap-1 cursor-pointer pt-1" title={holiday.name}>
                            <span className="text-lg leading-none">{getIconForHoliday(holiday)}</span>
                            <span className="text-xs text-secondary whitespace-nowrap">{holiday.name}</span>
                        </div>
                    </div>
                )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};