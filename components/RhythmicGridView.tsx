import React, { useMemo, useState, useRef, useEffect } from 'react';
import { EventNode, Project } from '../types';
import { CalendarIcon } from './icons';

const projectColorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
};

// Simplified two-color palette for alternating months to ensure high contrast
const MONTH_COLORS_ALT = [
    { bg: 'bg-pink-500/10', text: 'text-pink-400' },    // For odd months (Jan, Mar, etc.)
    { bg: 'bg-green-500/10', text: 'text-green-400' },  // For even months (Feb, Apr, etc.)
];

interface TooltipData {
    event: EventNode;
    project?: Project;
    x: number;
    y: number;
}

interface MonthLabelData {
    name: string;
    startRow: number;
    endRow: number;
    color: string;
}

interface MonthLabelColumnProps {
    labels: MonthLabelData[];
    totalWeeks: number;
    isRight?: boolean;
}

const MonthLabelColumn: React.FC<MonthLabelColumnProps> = ({ labels, totalWeeks, isRight }) => {
    const totalHeight = totalWeeks * 48; // 48 is h-12

    return (
        <div className="w-28 flex-shrink-0 px-4 relative" style={{ height: `${totalHeight}px` }}>
            {labels.map((label) => {
                const top = label.startRow * 48;
                const height = (label.endRow - label.startRow + 1) * 48;

                return (
                    <div 
                        key={label.name} 
                        className={`absolute w-full px-4 flex items-center ${isRight ? 'justify-start' : 'justify-end'}`} 
                        style={{ top: `${top}px`, height: `${height}px`, left: 0 }}
                    >
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${label.color}`}>
                            {label.name}
                        </h3>
                    </div>
                );
            })}
        </div>
    );
};

const isSameDay = (d1: Date, d2: Date): boolean =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    // adjust when day is sunday (0), assuming week starts on monday (1)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    d.setHours(0, 0, 0, 0);
    return new Date(d.setDate(diff));
};

interface RhythmicGridViewProps {
    events: EventNode[];
    projects: Project[];
}

export const RhythmicGridView: React.FC<RhythmicGridViewProps> = ({ events, projects }) => {
    const [layout, setLayout] = useState<'week' | 'month'>('week');
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const todayRowRef = useRef<HTMLDivElement>(null);
    const [showGoToToday, setShowGoToToday] = useState(false);

    // Use the system's current date
    const today = new Date();

    const projectMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, EventNode[]>();
        events.forEach(event => {
            if (event.when) {
                const date = new Date(event.when.timestamp);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                if (!map.has(key)) {
                    map.set(key, []);
                }
                map.get(key)!.push(event);
            }
        });
        return map;
    }, [events]);

    const scrollToToday = (behavior: 'auto' | 'smooth' = 'smooth') => {
        if (todayRowRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const rowElement = todayRowRef.current;
            const containerHeight = container.offsetHeight;
            const rowHeight = 48; // h-12
            const scrollTop = rowElement.offsetTop - (containerHeight / 2) + (rowHeight / 2);
            container.scrollTo({ top: scrollTop, behavior });
        }
    };

    // Initial scroll on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToToday('auto');
        }, 100); // A small delay helps ensure layout is complete
        return () => clearTimeout(timer);
    }, []);

    // Scroll listener to show/hide the "Go to Today" button
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (!todayRowRef.current) {
                setShowGoToToday(true); // If ref is lost for some reason, show button
                return;
            };
            const { scrollTop, offsetHeight } = container;
            const { offsetTop: rowOffsetTop } = todayRowRef.current;
            const rowHeight = 48; // h-12

            const isRowVisible = rowOffsetTop >= scrollTop && (rowOffsetTop + rowHeight) <= (scrollTop + offsetHeight);
            setShowGoToToday(!isRowVisible);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        // Run initial check once refs are definitely set
        const initialCheckTimer = setTimeout(handleScroll, 0); 

        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(initialCheckTimer);
        };
    }, []);

    const handleMouseEnter = (e: React.MouseEvent, event: EventNode) => {
        const project = projectMap.get(event.projectId);
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            event,
            project,
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const { gridRows, monthLabels, totalWeeks } = useMemo(() => {
        const startYear = today.getFullYear() - 2;
        const endYear = today.getFullYear() + 2;
        const yearStartDate = new Date(startYear, 0, 1);
        
        const dayOfWeek = yearStartDate.getDay();
        const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const gridStartDate = new Date(yearStartDate);
        gridStartDate.setDate(yearStartDate.getDate() + offset);

        const totalWeeks = (endYear - startYear + 1) * 53;
        
        const monthLabelMap = new Map<string, MonthLabelData>();
        const generatedRows: React.ReactNode[] = [];

        const startOfThisWeek = getStartOfWeek(today);
        
        const todayWeekIndex = Math.round((startOfThisWeek.getTime() - gridStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

        for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
            const rowCells: React.ReactNode[] = [];
            const isTodayWeek = weekIndex === todayWeekIndex;
            
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const cellDate = new Date(gridStartDate);
                cellDate.setDate(gridStartDate.getDate() + (weekIndex * 7 + dayIndex));

                const monthKey = `${cellDate.getFullYear()}-${cellDate.getMonth()}`;
                if (!monthLabelMap.has(monthKey)) {
                    const color = MONTH_COLORS_ALT[cellDate.getMonth() % 2]!;
                    monthLabelMap.set(monthKey, {
                        name: cellDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
                        startRow: weekIndex,
                        endRow: weekIndex,
                        color: color.text,
                    });
                }
                monthLabelMap.get(monthKey)!.endRow = weekIndex;

                const dateKey = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
                const dayEvents = eventsByDate.get(dateKey) || [];
                const isTodayCell = isSameDay(cellDate, today);
                
                const monthColor = MONTH_COLORS_ALT[cellDate.getMonth() % 2]!.bg;

                rowCells.push(
                    <div 
                        key={`${weekIndex}-${dayIndex}`}
                        // The ref is now correctly placed on the first cell of the current week,
                        // which is a tangible DOM element, ensuring its offsetTop is calculated correctly for scrolling.
                        ref={isTodayWeek && dayIndex === 0 ? todayRowRef : null}
                        className={`relative border-r border-b border-secondary h-12 ${monthColor}`}
                    >
                        {isTodayWeek && <div className="absolute inset-0 bg-blue-500/20 pointer-events-none" />}
                        <span className={`absolute top-0.5 left-1 text-xs ${isTodayCell ? 'text-primary font-bold' : 'text-tertiary'}`}>
                            {cellDate.getDate()}
                        </span>
                        <div className="absolute inset-0 flex flex-wrap gap-1 p-1 justify-center items-center">
                            {dayEvents.map(event => {
                                const project = projectMap.get(event.projectId);
                                const colorClass = project ? (projectColorClasses[project.color] || 'bg-gray-500') : 'bg-gray-500';
                                return (
                                    <div
                                        key={`${event.id}-${event.when?.timestamp}`}
                                        className={`w-3 h-3 rounded-full ${colorClass} cursor-pointer hover:ring-2 hover:ring-white z-10`}
                                        onMouseEnter={(e) => handleMouseEnter(e, event)}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                );
                            })}
                        </div>
                        {isTodayCell && <div className="absolute inset-[-1px] ring-2 ring-wha-blue rounded-sm pointer-events-none" />}
                    </div>
                );
            }
             generatedRows.push(
                 // The wrapper div is kept for layout purposes but no longer holds the ref.
                 <div key={weekIndex} className="contents">
                    {rowCells}
                </div>
            )
        }

        return { gridRows: generatedRows, monthLabels: Array.from(monthLabelMap.values()), totalWeeks };
    }, [eventsByDate, today]);

    const renderWeekLayout = () => {
        const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const totalGridHeight = totalWeeks * 48;

        return (
            <div className="flex flex-col h-full">
                {/* Sticky Header */}
                <div className="flex flex-shrink-0 z-20 sticky top-0 bg-secondary">
                    <div className="w-28 flex-shrink-0" /> {/* Spacer */}
                    <div className="flex-grow grid grid-cols-7 border-l border-t border-secondary">
                        {dayHeaders.map(day => (
                            <div key={day} className="text-center font-bold text-xs uppercase py-2 border-r border-b border-secondary bg-secondary">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="w-28 flex-shrink-0" /> {/* Spacer */}
                </div>
                
                {/* Scrollable Body */}
                <div className="overflow-auto flex-grow" ref={scrollContainerRef}>
                    <div className="flex">
                        <MonthLabelColumn labels={monthLabels} totalWeeks={totalWeeks} />
                        <div className="flex-grow" style={{ minHeight: `${totalGridHeight}px` }}>
                            <div className="grid grid-cols-7 border-l border-secondary">
                                {gridRows}
                            </div>
                        </div>
                        <MonthLabelColumn labels={monthLabels} totalWeeks={totalWeeks} isRight />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-secondary border border-primary rounded-lg p-4 w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                 <h2 className="text-xl font-bold text-primary">Rhythmic Grid</h2>
                 <div className="flex items-center space-x-1 bg-tertiary p-1 rounded-full">
                    <button 
                        onClick={() => setLayout('week')}
                        className={`px-3 py-1.5 text-sm rounded-full ${layout === 'week' ? 'bg-secondary text-primary' : 'text-secondary'}`}
                    >
                        Week Layout
                    </button>
                    <button 
                        onClick={() => setLayout('month')}
                        className={`px-3 py-1.5 text-sm rounded-full ${layout === 'month' ? 'bg-secondary text-primary' : 'text-secondary'}`}
                        disabled // Disabled until implemented
                    >
                        Month Layout
                    </button>
                 </div>
            </div>
            <div className="flex-grow min-h-0 relative">
                {layout === 'week' ? renderWeekLayout() : <p className="text-center p-8 text-secondary">Month Layout coming soon!</p>}
                <button
                    onClick={() => scrollToToday('smooth')}
                    className={`absolute bottom-6 right-6 z-30 px-4 py-2 bg-wha-blue text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 transform flex items-center ${
                        showGoToToday ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>Go to Today</span>
                </button>
            </div>
            {tooltip && (
                <div 
                    className="fixed z-50 p-2 text-sm bg-tertiary text-primary rounded-md shadow-lg pointer-events-none w-48"
                    style={{ top: tooltip.y > 70 ? tooltip.y - 70 : tooltip.y + 20, left: tooltip.x - 96 }}
                >
                    <p className="font-bold">{tooltip.event.what.name}</p>
                    {tooltip.project && <p className="text-xs text-secondary">{tooltip.project.name}</p>}
                    <p className="text-xs text-wha-blue mt-1">{tooltip.event.when?.display}</p>
                </div>
            )}
        </div>
    );
};