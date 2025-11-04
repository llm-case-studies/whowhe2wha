import React from 'react';
import { EventNode, TimelineScale } from '../types';
import {
  getWeekDays, getMonthGrid, getMonthsForQuarter, getMonthsForYear, isSameDay, getTimeOfDay,
  getEventsForDay, getEventsForMonth,
} from '../utils/dateUtils';

interface TimelineViewProps {
  events: EventNode[];
  currentDate: Date;
  scale: TimelineScale;
}

const timeOfDayColors: { [key: string]: string } = {
  morning: 'bg-morning',
  midday: 'bg-midday',
  afternoon: 'bg-afternoon',
};

const Header: React.FC<{ text: string }> = ({ text }) => (
  <h2 className="text-2xl font-bold tracking-tight text-primary mb-4">{text}</h2>
);

const renderWeekView = (events: EventNode[], currentDate: Date) => {
  const weekDays = getWeekDays(currentDate);
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  return (
    <div>
      <Header text={`Week of ${monthYear}`} />
      <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-primary">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(events, day);
          const isToday = isSameDay(day, new Date());
          return (
            <div key={index} className="bg-secondary p-2 min-h-[12rem]">
              <div className={`flex justify-between items-center mb-2 ${isToday ? 'text-wha-blue font-bold' : ''}`}>
                <span className="font-semibold text-sm">{day.toLocaleDateString('default', { weekday: 'short' })}</span>
                <span className={`text-lg ${isToday ? 'bg-wha-blue text-white rounded-full h-8 w-8 flex items-center justify-center' : ''}`}>{day.getDate()}</span>
              </div>
              <div className="space-y-2">
                {dayEvents.map(event => (
                  <div key={event.id} className="text-xs p-1.5 rounded-md bg-tertiary/80 border-l-4 border-wha-blue">
                    <p className="font-semibold text-primary truncate">{event.what.name}</p>
                    <p className="text-secondary">{new Date(event.when.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderMonthView = (events: EventNode[], currentDate: Date) => {
  const monthGrid = getMonthGrid(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxEventsInMonth = Math.max(...getEventsForMonth(events, currentDate).reduce((acc, _, i, arr) => {
    const date = new Date(arr[i].when.timestamp).getDate();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, [] as number[]), 1);


  return (
    <div>
      <Header text={currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} />
      <div className="grid grid-cols-7 gap-px bg-primary border-t border-l border-primary">
        {weekDays.map(day => <div key={day} className="text-center font-bold text-sm py-2 bg-secondary">{day}</div>)}
        {monthGrid.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="bg-tertiary border-r border-b border-primary"></div>;
          
          const dayEvents = getEventsForDay(events, day);
          const isToday = isSameDay(day, new Date());
          const eventDensity = dayEvents.length / maxEventsInMonth;

          return (
            <div key={index} 
                 className={`p-2 min-h-[8rem] border-r border-b border-primary relative`}
                 style={{ backgroundColor: `rgba(var(--color-tertiary), ${0.2 + eventDensity * 0.8})` }}
            >
              <span className={`absolute top-2 right-2 text-sm ${isToday ? 'bg-wha-blue text-white rounded-full h-6 w-6 flex items-center justify-center font-bold' : 'text-secondary'}`}>{day.getDate()}</span>
              <div className="absolute bottom-2 left-2 flex gap-1">
                {Array.from(new Set(dayEvents.map(e => getTimeOfDay(new Date(e.when.timestamp))))).map(tod => (
                  <div key={tod} className={`w-2 h-2 rounded-full ${timeOfDayColors[tod]}`} title={tod}></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderHeatmap = (events: EventNode[], months: Date[], title: string) => {
    const maxEventsPerMonth = Math.max(...months.map(month => getEventsForMonth(events, month).length), 1);
    
    return (
        <div>
            <Header text={title} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {months.map(month => {
                    const monthEvents = getEventsForMonth(events, month);
                    const eventDensity = monthEvents.length / maxEventsPerMonth;
                    return (
                        <div key={month.toISOString()} 
                             className="p-4 rounded-lg flex flex-col justify-between h-32"
                             style={{ backgroundColor: `rgba(var(--color-wha-blue), ${0.1 + eventDensity * 0.9})` }}
                        >
                            <div className="font-bold text-lg text-primary">{month.toLocaleString('default', { month: 'long' })}</div>
                            <div className="text-right text-3xl font-extrabold text-primary/80">{monthEvents.length}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const TimelineView: React.FC<TimelineViewProps> = ({ events, currentDate, scale }) => {
  switch (scale) {
    case 'week':
      return renderWeekView(events, currentDate);
    case 'month':
      return renderMonthView(events, currentDate);
    case 'quarter':
      const quarterMonths = getMonthsForQuarter(currentDate);
      const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
      return renderHeatmap(events, quarterMonths, `Q${quarter} ${currentDate.getFullYear()}`);
    case 'year':
      const yearMonths = getMonthsForYear(currentDate);
      return renderHeatmap(events, yearMonths, `${currentDate.getFullYear()}`);
    default:
      return <div>Invalid timeline scale</div>;
  }
};