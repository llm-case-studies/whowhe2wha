import React from 'react';
import { EventNode, TimelineScale, EntityType } from '../types';
import { 
    getStartOfWeek, getEndOfWeek, 
    getStartOfMonth, getEndOfMonth,
    getStartOfQuarter, getEndOfQuarter,
    getStartOfYear, getEndOfYear,
    addDays, isSameDay
} from '../utils/dateUtils';
import { EntityTag } from './EntityTag';

interface TimelineViewProps {
  events: EventNode[];
  currentDate: Date;
  scale: TimelineScale;
}

const getScaleRange = (date: Date, scale: TimelineScale): { start: Date; end: Date } => {
    switch (scale) {
        case 'week':
            return { start: getStartOfWeek(date), end: getEndOfWeek(date) };
        case 'month':
            const monthStart = getStartOfMonth(date);
            // To show a full calendar grid, we need to start from the beginning of the week of the 1st day.
            return { start: getStartOfWeek(monthStart), end: getEndOfWeek(getEndOfMonth(date)) };
        case 'quarter':
             return { start: getStartOfQuarter(date), end: getEndOfQuarter(date) };
        case 'year':
            return { start: getStartOfYear(date), end: getEndOfYear(date) };
        default:
            return { start: date, end: date };
    }
};

const TimelineEvent: React.FC<{ event: EventNode }> = ({ event }) => (
    <div className="bg-secondary/70 border-l-4 border-wha-blue rounded p-2 mb-2 text-sm transition-transform hover:scale-105">
        <p className="font-bold text-primary truncate">{event.what.name}</p>
        <p className="text-secondary text-xs">{new Date(event.when.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <div className="flex flex-wrap gap-1 mt-1">
             {event.who.slice(0, 1).map(p => <EntityTag key={p.id} label={p.name} type={EntityType.Who} />)}
             {event.who.length > 1 && <span className="text-xs text-secondary self-center">+{event.who.length - 1}</span>}
        </div>
    </div>
);


export const TimelineView: React.FC<TimelineViewProps> = ({ events, currentDate, scale }) => {
    const { start, end } = getScaleRange(currentDate, scale);

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.when.timestamp);
        return eventDate >= start && eventDate <= end;
    });
    
    const renderDays = () => {
        const days = [];
        let day = start;
        while (day <= end) {
            days.push(new Date(day));
            day = addDays(day, 1);
        }

        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return (
            <div className="grid grid-cols-7 gap-px bg-primary border border-primary">
                {/* Header */}
                {weekDays.map(d => (
                     <div key={d} className="bg-secondary p-2 text-center text-xs font-bold text-secondary">{d}</div>
                ))}
                
                {/* Cells */}
                {days.map(d => {
                    const dayEvents = filteredEvents.filter(e => isSameDay(new Date(e.when.timestamp), d));
                    const isToday = isSameDay(d, new Date());
                    const isFaded = d.getMonth() !== currentDate.getMonth();
                    return (
                        <div key={d.toISOString()} className={`bg-secondary p-2 min-h-[120px] ${isFaded ? 'opacity-40' : ''}`}>
                            <div className={`text-xs ml-auto w-5 h-5 flex items-center justify-center ${isToday ? 'bg-wha-blue text-white rounded-full' : 'text-secondary'}`}>
                                {d.getDate()}
                            </div>
                            <div className="mt-1">
                                {dayEvents
                                    .sort((a,b) => new Date(a.when.timestamp).getTime() - new Date(b.when.timestamp).getTime())
                                    .map(event => <TimelineEvent key={event.id} event={event} />)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    
    const renderMonths = () => {
      // For quarter view
      const months = [];
      for (let i = 0; i < 3; i++) {
        months.push(new Date(start.getFullYear(), start.getMonth() + i, 1));
      }
      return (
        <div className="grid grid-cols-3 gap-px bg-primary border border-primary">
          {months.map(m => {
            const monthEvents = filteredEvents.filter(e => new Date(e.when.timestamp).getMonth() === m.getMonth());
            return (
              <div key={m.toISOString()} className="bg-secondary p-2 min-h-[200px] overflow-y-auto">
                <div className="text-center font-bold text-primary mb-2">{m.toLocaleString('default', { month: 'long' })}</div>
                {monthEvents.map(event => <TimelineEvent key={event.id} event={event} />)}
              </div>
            );
          })}
        </div>
      );
    };

    const renderQuarters = () => {
      const quarters = [
        new Date(start.getFullYear(), 0, 1),
        new Date(start.getFullYear(), 3, 1),
        new Date(start.getFullYear(), 6, 1),
        new Date(start.getFullYear(), 9, 1),
      ];
      return (
        <div className="grid grid-cols-4 gap-px bg-primary border border-primary">
          {quarters.map((q, i) => {
            const quarterEvents = filteredEvents.filter(e => Math.floor(new Date(e.when.timestamp).getMonth() / 3) === i);
            return (
              <div key={q.toISOString()} className="bg-secondary p-2 min-h-[200px] overflow-y-auto">
                <div className="text-center font-bold text-primary mb-2">Q{i + 1}</div>
                {quarterEvents.map(event => <TimelineEvent key={event.id} event={event} />)}
              </div>
            );
          })}
        </div>
      );
    };

    if (scale === 'week' || scale === 'month') {
        return renderDays();
    }
    if (scale === 'quarter') {
        return renderMonths();
    }
     if (scale === 'year') {
        return renderQuarters();
    }

    return <div className="text-center py-10 text-secondary">Timeline view not implemented for this scale yet.</div>;
};
