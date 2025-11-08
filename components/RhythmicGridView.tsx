import React, { useMemo, useState, useRef, useEffect } from 'react';
import { EventNode, Project } from '../types';
import { CalendarIcon, ChevronsLeftIcon, ChevronsRightIcon } from './icons';

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

interface LabelData {
    name: string;
    startRow: number;
    endRow: number;
    color?: string;
}

interface LabelColumnProps {
    labels: LabelData[];
    totalRows: number;
    rowHeight: number;
    isRight?: boolean;
}

const LabelColumn: React.FC<LabelColumnProps> = ({ labels, totalRows, rowHeight, isRight }) => {
    const totalHeight = totalRows * rowHeight;

    return (
        <div className="w-28 flex-shrink-0 px-4 relative" style={{ height: `${totalHeight}px` }}>
            {labels.map((label) => {
                const top = label.startRow * rowHeight;
                const height = (label.endRow - label.startRow + 1) * rowHeight;

                return (
                    <div 
                        key={label.name} 
                        className={`absolute w-full px-4 flex items-center ${isRight ? 'justify-start' : 'justify-end'}`} 
                        style={{ top: `${top}px`, height: `${height}px`, left: 0 }}
                    >
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${label.color || 'text-secondary'}`}>
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
    const [layout, setLayout] = useState<'week' | 'month' | 'traditional'>('week');
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const todayRowRef = useRef<HTMLDivElement>(null);
    const [showGoToToday, setShowGoToToday] = useState(false);
    
    // State for Traditional calendar
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | null>(null);

    const today = new Date();

    const projectMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, EventNode[]>();
        events.forEach(event => {
            const processDate = (date: Date) => {
                 const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                if (!map.has(key)) map.set(key, []);
                map.get(key)!.push(event);
            };

            if (event.when) {
                const startDate = new Date(event.when.timestamp);
                const endDate = event.endWhen ? new Date(event.endWhen.timestamp) : startDate;
                
                // Iterate through each day of a period event
                let currentDate = new Date(startDate);
                currentDate.setHours(0,0,0,0);
                while(currentDate <= endDate) {
                    processDate(currentDate);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });
        return map;
    }, [events]);
    
    // --- Navigation Handlers ---

    const scrollToToday = (behavior: 'auto' | 'smooth' = 'smooth') => {
        if (layout === 'traditional') {
            setCalendarDate(new Date());
            return;
        }

        if (todayRowRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const rowElement = todayRowRef.current;
            const containerHeight = container.offsetHeight;
            const rowHeight = layout === 'week' ? 48 : 40;
            const scrollTop = rowElement.offsetTop - (containerHeight / 2) + (rowHeight / 2);
            container.scrollTo({ top: scrollTop, behavior });
        }
    };

    const handleMonthChange = (direction: 'next' | 'prev') => {
        setTransitionDirection(direction);
        setTimeout(() => {
            setCalendarDate(prevDate => {
                const newDate = new Date(prevDate);
                newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
                return newDate;
            });
             setTransitionDirection(null);
        }, 150); // duration of the fade-out animation
    };

    // --- Effects ---

    useEffect(() => {
        if (layout === 'week' || layout === 'month') {
             const timer = setTimeout(() => {
                scrollToToday('auto');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [layout]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || layout === 'traditional') return;

        const handleScroll = () => {
            if (!todayRowRef.current) {
                setShowGoToToday(true);
                return;
            };
            const { scrollTop, offsetHeight } = container;
            const { offsetTop: rowOffsetTop } = todayRowRef.current;
            const rowHeight = 48;

            const isRowVisible = rowOffsetTop >= scrollTop && (rowOffsetTop + rowHeight) <= (scrollTop + offsetHeight);
            setShowGoToToday(!isRowVisible);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        const initialCheckTimer = setTimeout(handleScroll, 0); 

        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(initialCheckTimer);
        };
    }, [layout]);

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

    const handleMouseLeave = () => setTooltip(null);
    
    // --- Data Memos for Linear Grids ---

    const { gridRows, rowLabels, totalRows, rowHeight } = useMemo(() => {
        const startYear = today.getFullYear() - 2;
        const endYear = today.getFullYear() + 2;

        if (layout === 'week') {
            const yearStartDate = new Date(startYear, 0, 1);
            const dayOfWeek = yearStartDate.getDay();
            const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const gridStartDate = new Date(yearStartDate);
            gridStartDate.setDate(yearStartDate.getDate() + offset);

            const totalWeeks = (endYear - startYear + 1) * 53;
            const monthLabelMap = new Map<string, LabelData>();
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
                        monthLabelMap.set(monthKey, { name: cellDate.toLocaleString('default', { month: 'long', year: 'numeric' }), startRow: weekIndex, endRow: weekIndex, color: color.text });
                    }
                    monthLabelMap.get(monthKey)!.endRow = weekIndex;

                    const dateKey = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
                    const dayEvents = eventsByDate.get(dateKey) || [];
                    const isTodayCell = isSameDay(cellDate, today);
                    const monthColor = MONTH_COLORS_ALT[cellDate.getMonth() % 2]!.bg;

                    rowCells.push(
                        <div key={`${weekIndex}-${dayIndex}`} ref={isTodayWeek && dayIndex === 0 ? todayRowRef : null} className={`relative border-r border-b border-secondary h-12 ${monthColor}`}>
                            {isTodayWeek && <div className="absolute inset-0 bg-blue-500/20 pointer-events-none" />}
                            <span className={`absolute top-0.5 left-1 text-xs ${isTodayCell ? 'text-primary font-bold' : 'text-tertiary'}`}>{cellDate.getDate()}</span>
                            <div className="absolute inset-0 flex flex-wrap gap-1 p-1 justify-center items-center">
                                {dayEvents.map(event => {
                                    const project = projectMap.get(event.projectId);
                                    const colorClass = project ? (projectColorClasses[project.color] || 'bg-gray-500') : 'bg-gray-500';
                                    return <div key={`${event.id}-${event.when?.timestamp}`} className={`w-3 h-3 rounded-full ${colorClass} cursor-pointer hover:ring-2 hover:ring-white z-10`} onMouseEnter={(e) => handleMouseEnter(e, event)} onMouseLeave={handleMouseLeave} />;
                                })}
                            </div>
                            {isTodayCell && <div className="absolute inset-[-1px] ring-2 ring-wha-blue rounded-sm pointer-events-none" />}
                        </div>
                    );
                }
                generatedRows.push(<div key={weekIndex} className="contents">{rowCells}</div>);
            }
            return { gridRows: generatedRows, rowLabels: Array.from(monthLabelMap.values()), totalRows: totalWeeks, rowHeight: 48 };
        } else if (layout === 'month') {
            const generatedRows = [];
            const yearLabelMap = new Map<string, LabelData>();
            const totalMonths = (endYear - startYear + 1) * 12;
            const todayMonthIndex = (today.getFullYear() - startYear) * 12 + today.getMonth();

            for (let monthIndex = 0; monthIndex < totalMonths; monthIndex++) {
                const year = startYear + Math.floor(monthIndex / 12);
                const month = monthIndex % 12;
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const isTodayMonth = monthIndex === todayMonthIndex;
                const monthColor = MONTH_COLORS_ALT[month % 2]!.bg;

                if (!yearLabelMap.has(year.toString())) {
                    yearLabelMap.set(year.toString(), { name: year.toString(), startRow: monthIndex, endRow: monthIndex });
                }
                yearLabelMap.get(year.toString())!.endRow = monthIndex;

                const rowCells = [];
                for (let day = 1; day <= 31; day++) {
                    const isRealDay = day <= daysInMonth;
                    const cellDate = new Date(year, month, day);
                    const isTodayCell = isRealDay && isSameDay(cellDate, today);
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = isRealDay ? eventsByDate.get(dateKey) || [] : [];
                    const dayOfWeek = isRealDay ? cellDate.getDay() : -1;
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                    // Create density visualization
                    let densityClass = '';
                    if (dayEvents.length === 1) densityClass = 'bg-wha-blue/20';
                    else if (dayEvents.length === 2) densityClass = 'bg-wha-blue/40';
                    else if (dayEvents.length >= 3) densityClass = 'bg-wha-blue/60';

                    rowCells.push(
                        <div key={`${monthIndex}-${day}`} className={`relative h-10 border-r border-b border-secondary/50 ${isRealDay ? (isWeekend ? 'bg-tertiary/10' : '') : 'bg-tertiary/30'} ${densityClass}`}>
                            {isRealDay && day <= 9 && <span className="absolute top-0.5 left-0.5 text-[9px] text-tertiary">{day}</span>}
                            {isRealDay && <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5">
                                {dayEvents.slice(0, 4).map(event => {
                                    const project = projectMap.get(event.projectId);
                                    const colorClass = project ? (projectColorClasses[project.color] || 'bg-gray-500') : 'bg-gray-500';
                                    return <div key={`${event.id}-${event.when?.timestamp}`} className={`w-3 h-3 rounded-full ${colorClass} cursor-pointer hover:ring-2 hover:ring-white z-10`} onMouseEnter={(e) => handleMouseEnter(e, event)} onMouseLeave={handleMouseLeave} />;
                                })}
                                {dayEvents.length > 4 && <div className="text-[8px] font-bold text-primary">+{dayEvents.length - 4}</div>}
                            </div>}
                            {isTodayCell && <div className="absolute inset-[-1px] ring-2 ring-wha-blue rounded-sm pointer-events-none" />}
                        </div>
                    );
                }
                generatedRows.push(
                    <div key={monthIndex} ref={isTodayMonth ? todayRowRef : null} className={`grid grid-cols-31 ${monthColor}`}>
                        {rowCells}
                    </div>
                );
            }
             return { gridRows: generatedRows, rowLabels: Array.from(yearLabelMap.values()), totalRows: totalMonths, rowHeight: 40 };
        }
        return { gridRows: [], rowLabels: [], totalRows: 0, rowHeight: 0 };
    }, [layout, eventsByDate, today]);

    // --- Render Functions ---

    const renderWeekLayout = () => {
        const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const totalGridHeight = totalRows * rowHeight;

        return (
            <div className="flex flex-col h-full">
                <div className="flex flex-shrink-0 z-20 sticky top-0 bg-secondary">
                    <div className="w-28 flex-shrink-0" />
                    <div className="flex-grow grid grid-cols-7 border-l border-t border-secondary">
                        {dayHeaders.map(day => <div key={day} className="text-center font-bold text-xs uppercase py-2 border-r border-b border-secondary bg-secondary">{day}</div>)}
                    </div>
                    <div className="w-28 flex-shrink-0" />
                </div>
                <div className="overflow-auto flex-grow" ref={scrollContainerRef}>
                    <div className="flex">
                        <LabelColumn labels={rowLabels} totalRows={totalRows} rowHeight={rowHeight} />
                        <div className="flex-grow" style={{ minHeight: `${totalGridHeight}px` }}>
                            <div className="grid grid-cols-7 border-l border-secondary">{gridRows}</div>
                        </div>
                        <LabelColumn labels={rowLabels} totalRows={totalRows} rowHeight={rowHeight} isRight />
                    </div>
                </div>
            </div>
        );
    };

    const renderMonthLayout = () => {
        const totalGridHeight = totalRows * rowHeight;
        const monthLabels = gridRows.map((_, idx) => {
            const year = today.getFullYear() - 2 + Math.floor(idx / 12);
            const month = idx % 12;
            const date = new Date(year, month, 1);
            return date.toLocaleString('default', { month: 'short' });
        });

        return (
             <div className="flex flex-col h-full">
                <div className="flex flex-shrink-0 z-20 sticky top-0 bg-secondary">
                    <div className="w-28 flex-shrink-0 text-xs font-bold text-secondary text-right pr-4 py-2 border-b border-secondary bg-secondary">Month</div>
                    <div className="flex-grow grid grid-cols-31 border-l border-t border-secondary">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => <div key={day} className="text-center font-bold text-xs py-2 border-r border-b border-secondary bg-secondary">{day}</div>)}
                    </div>
                </div>
                <div className="overflow-auto flex-grow" ref={scrollContainerRef}>
                    <div className="flex">
                        <div className="w-28 flex-shrink-0 px-4 relative" style={{ height: `${totalGridHeight}px` }}>
                            {monthLabels.map((monthName, idx) => {
                                const top = idx * rowHeight;
                                return (
                                    <div
                                        key={idx}
                                        className="absolute w-full px-4 flex items-center justify-end"
                                        style={{ top: `${top}px`, height: `${rowHeight}px`, left: 0 }}
                                    >
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
                                            {monthName}
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex-grow" style={{ minHeight: `${totalGridHeight}px` }}>
                           <div className="border-l border-secondary">{gridRows}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
    
    const renderTraditionalLayout = () => {
        const days = [];
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        for (let i = 0; i < startDayOfWeek; i++) {
            const date = new Date(firstDay);
            date.setDate(date.getDate() - (startDayOfWeek - i));
            days.push({ date, isCurrentMonth: false });
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const date = new Date(lastDay);
            date.setDate(lastDay.getDate() + i);
            days.push({ date, isCurrentMonth: false });
        }
        const calendarDays = days;

        let animationClass = '';
        if(transitionDirection === 'next') animationClass = 'opacity-0';
        if(transitionDirection === 'prev') animationClass = 'opacity-0';

        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-xl font-bold text-primary">{calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleMonthChange('prev')} className="p-1.5 rounded-full hover:bg-tertiary"><ChevronsLeftIcon /></button>
                        <button onClick={() => setCalendarDate(new Date())} className="text-sm font-semibold px-3 py-1 rounded-md hover:bg-tertiary">Today</button>
                        <button onClick={() => handleMonthChange('next')} className="p-1.5 rounded-full hover:bg-tertiary"><ChevronsRightIcon /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 flex-shrink-0">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day} className="text-center text-xs font-bold uppercase text-secondary pb-2">{day}</div>)}
                </div>
                <div key={calendarDate.getMonth()} className={`grid grid-cols-7 grid-rows-6 flex-grow border-t border-l border-secondary transition-opacity duration-300 ${animationClass}`}>
                    {calendarDays.map(({ date, isCurrentMonth }, index) => {
                        const isTodayCell = isSameDay(date, today);
                        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        const dayEvents = eventsByDate.get(dateKey) || [];
                        const eventCount = dayEvents.length;
                        let densityClass = '';
                        if(eventCount > 0 && eventCount <= 2) densityClass = 'bg-tertiary/20';
                        else if(eventCount > 2 && eventCount <= 4) densityClass = 'bg-tertiary/40';
                        else if(eventCount > 4) densityClass = 'bg-tertiary/60';

                        return (
                            <div key={index} className={`relative p-1 border-r border-b border-secondary flex flex-col ${isCurrentMonth ? 'bg-transparent' : 'bg-tertiary/20'} ${densityClass}`}>
                                <span className={`text-xs font-semibold ${isCurrentMonth ? (isTodayCell ? 'text-wha-blue' : 'text-primary') : 'text-tertiary'}`}>{date.getDate()}</span>
                                {isTodayCell && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-wha-blue rounded-full" />}
                                <div className="flex-grow overflow-hidden mt-1 space-y-0.5">
                                    {dayEvents.slice(0, 2).map(event => {
                                        const project = projectMap.get(event.projectId);
                                        const colorClass = project ? (projectColorClasses[project.color] || 'bg-gray-500') : 'bg-gray-500';
                                        return (
                                            <div key={`${event.id}-${event.when?.timestamp}`} className="text-xs text-primary whitespace-nowrap overflow-hidden text-ellipsis flex items-center cursor-pointer" onMouseEnter={(e) => handleMouseEnter(e, event)} onMouseLeave={handleMouseLeave}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${colorClass} mr-1.5 flex-shrink-0`}></div>
                                                <span>{event.what.name}</span>
                                            </div>
                                        );
                                    })}
                                    {dayEvents.length > 2 && <div className="text-xs text-secondary pl-3 cursor-pointer" onMouseEnter={(e) => handleMouseEnter(e, dayEvents[2])} onMouseLeave={handleMouseLeave}>+ {dayEvents.length - 2} more</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-secondary border border-primary rounded-lg p-4 w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                 <h2 className="text-xl font-bold text-primary">Rhythmic Grid</h2>
                 <div className="flex items-center space-x-1 bg-tertiary p-1 rounded-full">
                    <button onClick={() => setLayout('week')} className={`px-3 py-1.5 text-sm rounded-full ${layout === 'week' ? 'bg-secondary text-primary' : 'text-secondary'}`}>Week Layout</button>
                    <button onClick={() => setLayout('month')} className={`px-3 py-1.5 text-sm rounded-full ${layout === 'month' ? 'bg-secondary text-primary' : 'text-secondary'}`}>Month Layout</button>
                    <button onClick={() => setLayout('traditional')} className={`px-3 py-1.5 text-sm rounded-full ${layout === 'traditional' ? 'bg-secondary text-primary' : 'text-secondary'}`}>Traditional</button>
                 </div>
            </div>
            <div className="flex-grow min-h-0 relative">
                {layout === 'week' && renderWeekLayout()}
                {layout === 'month' && renderMonthLayout()}
                {layout === 'traditional' && renderTraditionalLayout()}
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