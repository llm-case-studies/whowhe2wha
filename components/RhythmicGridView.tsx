import React, { useMemo, useState, useRef, useEffect } from 'react';
import { EventNode, Project } from '../types';

interface RhythmicGridViewProps {
  events: EventNode[];
  projects: Project[];
}

const projectColorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
};

const MONTH_COLORS = [
    { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    { bg: 'bg-green-500/10', text: 'text-green-400' },
    { bg: 'bg-orange-500/10', text: 'text-orange-400' },
    { bg: 'bg-pink-500/10', text: 'text-pink-400' },
    { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
];

interface TooltipData {
    event: EventNode;
    project: Project | undefined;
    x: number;
    y: number;
}

interface MonthLabelData {
    name: string;
    startRow: number;
    endRow: number;
    color: string;
}

const isSameDay = (d1: Date, d2: Date): boolean =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

const MonthLabelColumn: React.FC<{ labels: MonthLabelData[], align?: 'left' | 'right' }> = ({ labels, align = 'right' }) => {
    const textAlignClass = align === 'right' ? 'text-right' : 'text-left';
    return (
        <div className={`w-28 flex-shrink-0 px-4`}>
            {labels.map(label => {
                const height = (label.endRow - label.startRow + 1) * 48; // h-12 is 3rem = 48px
                return (
                    <div key={label.name} className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'}`} style={{ height: `${height}px` }}>
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${label.color}`}>
                            {label.name}
                        </h3>
                    </div>
                );
            })}
        </div>
    );
};


export const RhythmicGridView: React.FC<RhythmicGridViewProps> = ({ events, projects }) => {
    const [layout, setLayout] = useState<'week' | 'month'>('week');
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const todayRowRef = useRef<HTMLDivElement>(null);

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
    
     useEffect(() => {
        if (todayRowRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const row = todayRowRef.current;
            const containerHeight = container.offsetHeight;
            const rowHeight = row.offsetHeight;
            const scrollTop = row.offsetTop - (containerHeight / 2) + (rowHeight / 2);
            container.scrollTo({ top: scrollTop, behavior: 'auto' });
        }
    }, []); // Run only on initial mount


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

    const { gridCells, monthLabels } = useMemo(() => {
        const startYear = today.getFullYear() - 2;
        const endYear = today.getFullYear() + 2;
        const yearStartDate = new Date(startYear, 0, 1);
        
        const dayOfWeek = yearStartDate.getDay();
        const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const gridStartDate = new Date(yearStartDate);
        gridStartDate.setDate(yearStartDate.getDate() + offset);

        const totalWeeks = (endYear - startYear + 1) * 53;
        
        const cells = [];
        const monthLabelMap = new Map<string, MonthLabelData>();

        for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
            const rowCells = [];
            let rowHasToday = false;

            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const i = weekIndex * 7 + dayIndex;
                const cellDate = new Date(gridStartDate);
                cellDate.setDate(gridStartDate.getDate() + i);

                const monthKey = `${cellDate.getFullYear()}-${cellDate.getMonth()}`;
                if (!monthLabelMap.has(monthKey)) {
                    const color = MONTH_COLORS[cellDate.getMonth() % MONTH_COLORS.length];
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
                const isToday = isSameDay(cellDate, today);
                if (isToday) rowHasToday = true;

                const monthColor = MONTH_COLORS[cellDate.getMonth() % MONTH_COLORS.length].bg;

                rowCells.push(
                    <div key={i} className={`relative border-r border-b border-primary h-12 ${monthColor}`}>
                        <span className={`absolute top-0.5 left-1 text-xs ${isToday ? 'text-primary font-bold' : 'text-tertiary'}`}>
                            {cellDate.getDate()}
                        </span>
                        <div className="absolute inset-0 flex flex-wrap gap-1 p-1 justify-center items-center">
                            {dayEvents.map(event => {
                                const project = projectMap.get(event.projectId);
                                const colorClass = project ? (projectColorClasses[project.color] || 'bg-gray-500') : 'bg-gray-500';
                                return (
                                    <div
                                        key={`${event.id}-${event.when?.timestamp}`}
                                        className={`w-3 h-3 rounded-full ${colorClass} cursor-pointer hover:ring-2 hover:ring-white`}
                                        onMouseEnter={(e) => handleMouseEnter(e, event)}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                );
                            })}
                        </div>
                        {isToday && <div className="absolute inset-0 ring-2 ring-wha-blue rounded-sm pointer-events-none" />}
                    </div>
                );
            }
            // A `div` with `display: contents` acts as a non-rendering wrapper, allowing the ref to be attached to the logical row.
            cells.push(
                <div key={weekIndex} ref={rowHasToday ? todayRowRef : null} className="contents">
                    {rowCells}
                </div>
            );
        }

        return { gridCells: cells, monthLabels: Array.from(monthLabelMap.values()) };
    }, [eventsByDate, today]);


    const renderWeekLayout = () => {
        const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return (
            <div className="flex">
                <MonthLabelColumn labels={monthLabels} align="right" />
                <div className="flex-grow">
                    <div className="grid grid-cols-7 border-l border-t border-primary">
                        {dayHeaders.map(day => (
                            <div key={day} className="text-center font-bold text-xs uppercase py-2 border-r border-b border-primary bg-secondary sticky top-0 z-10">{day}</div>
                        ))}
                        {gridCells}
                    </div>
                </div>
                <MonthLabelColumn labels={monthLabels} align="left" />
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
            <div className="overflow-auto flex-grow" ref={scrollContainerRef}>
                {layout === 'week' ? renderWeekLayout() : <p className="text-center p-8 text-secondary">Month Layout coming soon!</p>}
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
