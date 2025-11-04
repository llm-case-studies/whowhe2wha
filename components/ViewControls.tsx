import React from 'react';
import { ViewMode, TimelineScale } from '../types';
import { StreamIcon, TimelineIcon } from './icons';

interface ViewControlsProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    timelineScale: TimelineScale;
    setTimelineScale: (scale: TimelineScale) => void;
    timelineDate: Date;
    setTimelineDate: (date: Date) => void;
    onAddEventClick: () => void;
}

const scales: TimelineScale[] = ['week', 'month', 'quarter', 'year'];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const ViewControls: React.FC<ViewControlsProps> = ({
    viewMode, setViewMode, timelineScale, setTimelineScale, timelineDate, setTimelineDate, onAddEventClick
}) => {

    const handleDateChange = (direction: 'prev' | 'next') => {
        const newDate = new Date(timelineDate);
        const increment = direction === 'next' ? 1 : -1;
        switch(timelineScale) {
            case 'week':
                newDate.setDate(newDate.getDate() + 7 * increment);
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + increment);
                break;
            case 'quarter':
                newDate.setMonth(newDate.getMonth() + 3 * increment);
                break;
            case 'year':
                newDate.setFullYear(newDate.getFullYear() + increment);
                break;
        }
        setTimelineDate(newDate);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            {/* Left Side: View Mode & Timeline Controls */}
            <div className="flex items-center gap-4 bg-secondary p-1 rounded-lg">
                <button
                    onClick={() => setViewMode('stream')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${viewMode === 'stream' ? 'bg-wha-blue text-white' : 'text-secondary hover:bg-tertiary'}`}
                >
                    <StreamIcon /> Stream
                </button>
                <button
                    onClick={() => setViewMode('timeline')}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${viewMode === 'timeline' ? 'bg-wha-blue text-white' : 'text-secondary hover:bg-tertiary'}`}
                >
                    <TimelineIcon /> Timeline
                </button>
            </div>
            
            {viewMode === 'timeline' && (
                 <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
                    {scales.map(scale => (
                        <button
                            key={scale}
                            onClick={() => setTimelineScale(scale)}
                            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${timelineScale === scale ? 'bg-primary text-primary' : 'text-secondary hover:bg-tertiary'}`}
                        >
                            {capitalize(scale)}
                        </button>
                    ))}
                </div>
            )}
            
            {viewMode === 'timeline' && (
                <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
                    <button onClick={() => handleDateChange('prev')} className="px-3 py-1.5 rounded-md text-secondary hover:bg-tertiary">&lt; Prev</button>
                    <button onClick={() => handleDateChange('next')} className="px-3 py-1.5 rounded-md text-secondary hover:bg-tertiary">Next &gt;</button>
                </div>
            )}

            {/* Right Side: Add Event Button */}
            <div className="flex-grow md:flex-grow-0 flex justify-end">
                <button
                    onClick={onAddEventClick}
                    className="w-full md:w-auto px-5 py-2 rounded-md bg-to-orange text-white font-bold hover:bg-orange-600 transition duration-200"
                >
                    + Add Event
                </button>
            </div>
        </div>
    );
};