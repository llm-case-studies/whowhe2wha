import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, TimelineScale } from '../types';
import { StreamIcon, TimelineIcon, StarIcon, FilterIcon, LayersIcon } from './icons';
import { HOLIDAY_CATEGORIES, PROJECT_CATEGORIES } from '../constants';

interface ViewControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  timelineScale: TimelineScale;
  setTimelineScale: (scale: TimelineScale) => void;
  timelineDate: Date;
  setTimelineDate: (date: Date) => void;
  onAddEventClick: () => void;
  selectedHolidayCategories: string[];
  setSelectedHolidayCategories: (categories: string[]) => void;
  selectedProjectCategories: string[];
  setSelectedProjectCategories: (categories: string[]) => void;
  onConfigureTiersClick: () => void;
}

const scaleOptions: TimelineScale[] = ['week', 'month', 'quarter', 'year'];

const getAdjustedDate = (date: Date, scale: TimelineScale, direction: 'prev' | 'next'): Date => {
  const newDate = new Date(date);
  const increment = direction === 'prev' ? -1 : 1;
  switch (scale) {
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
  return newDate;
};

const getTimelineLabel = (date: Date, scale: TimelineScale): string => {
  switch (scale) {
    case 'week':
      return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    case 'month':
      return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    case 'quarter':
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `Q${quarter} ${date.getFullYear()}`;
    case 'year':
      return date.getFullYear().toString();
  }
};

export const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  setViewMode,
  timelineScale,
  setTimelineScale,
  timelineDate,
  setTimelineDate,
  onAddEventClick,
  selectedHolidayCategories,
  setSelectedHolidayCategories,
  selectedProjectCategories,
  setSelectedProjectCategories,
  onConfigureTiersClick,
}) => {
  const [isHolidaySelectorOpen, setIsHolidaySelectorOpen] = useState(false);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const holidaySelectorRef = useRef<HTMLDivElement>(null);
  const projectSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (holidaySelectorRef.current && !holidaySelectorRef.current.contains(event.target as Node)) {
        setIsHolidaySelectorOpen(false);
      }
      if (projectSelectorRef.current && !projectSelectorRef.current.contains(event.target as Node)) {
        setIsProjectSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHolidayToggle = (categoryId: string) => {
    setSelectedHolidayCategories(
      selectedHolidayCategories.includes(categoryId)
        ? selectedHolidayCategories.filter((c) => c !== categoryId)
        : [...selectedHolidayCategories, categoryId]
    );
  };

  const handleProjectCategoryToggle = (category: string) => {
    setSelectedProjectCategories(
        selectedProjectCategories.includes(category)
        ? selectedProjectCategories.filter((c) => c !== category)
        : [...selectedProjectCategories, category]
    );
  };

  const handleSelectAllProjectCategories = (isSelected: boolean) => {
      if (isSelected) {
          setSelectedProjectCategories(PROJECT_CATEGORIES);
      } else {
          setSelectedProjectCategories([]);
      }
  }

  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div className="flex items-center space-x-1 bg-tertiary p-1 rounded-full">
        <button
          onClick={() => setViewMode('stream')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors duration-200 text-sm ${
            viewMode === 'stream' ? 'bg-secondary text-primary shadow-sm' : 'text-secondary hover:bg-secondary/20'
          }`}
          aria-label="Switch to Stream view"
        >
          <StreamIcon className="h-4 w-4" />
          <span>Stream</span>
        </button>
        <button
          onClick={() => setViewMode('timeline')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors duration-200 text-sm ${
            viewMode === 'timeline' ? 'bg-secondary text-primary shadow-sm' : 'text-secondary hover:bg-secondary/20'
          }`}
          aria-label="Switch to Timeline view"
        >
          <TimelineIcon className="h-4 w-4" />
          <span>Timeline</span>
        </button>
      </div>

      {viewMode === 'timeline' && (
        <div className="flex items-center space-x-2 bg-tertiary p-1 rounded-full">
          <button onClick={() => setTimelineDate(getAdjustedDate(timelineDate, timelineScale, 'prev'))} className="p-2 text-secondary hover:text-primary rounded-full" aria-label="Previous time period">
            &lt;
          </button>
          <span className="text-sm font-medium text-primary px-2 whitespace-nowrap">{getTimelineLabel(timelineDate, timelineScale)}</span>
          <button onClick={() => setTimelineDate(getAdjustedDate(timelineDate, timelineScale, 'next'))} className="p-2 text-secondary hover:text-primary rounded-full" aria-label="Next time period">
            &gt;
          </button>
          <select
            value={timelineScale}
            onChange={(e) => setTimelineScale(e.target.value as TimelineScale)}
            className="bg-secondary border-none rounded-full text-sm text-primary py-1.5 pl-3 pr-8 focus:ring-0"
            aria-label="Select timeline scale"
          >
            {scaleOptions.map(scale => (
              <option key={scale} value={scale}>
                {scale.charAt(0).toUpperCase() + scale.slice(1)}
              </option>
            ))}
          </select>

          {/* Project Selector */}
          <div className="relative" ref={projectSelectorRef}>
            <button
                onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
                className="p-2 text-secondary hover:text-primary rounded-full relative"
                aria-label="Filter projects on timeline"
            >
                <FilterIcon />
                 {selectedProjectCategories.length > 0 && selectedProjectCategories.length < PROJECT_CATEGORIES.length && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-wha-blue ring-2 ring-tertiary" />
                )}
            </button>
            {isProjectSelectorOpen && (
                 <div className="absolute top-full right-0 mt-2 w-56 bg-secondary border border-primary rounded-lg shadow-xl z-20 p-2 max-h-64 overflow-y-auto">
                    <p className="text-xs text-secondary font-bold px-2 pb-1">Filter Categories</p>
                    <div className="space-y-1">
                        <label className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-tertiary cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedProjectCategories.length === PROJECT_CATEGORIES.length}
                                onChange={(e) => handleSelectAllProjectCategories(e.target.checked)}
                                className="rounded bg-input border-primary text-wha-blue focus:ring-wha-blue"
                            />
                            <span className="text-sm text-primary font-semibold">All Categories</span>
                        </label>
                         <hr className="border-primary my-1" />
                        {PROJECT_CATEGORIES.map(category => (
                            <label key={category} className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-tertiary cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedProjectCategories.includes(category)}
                                onChange={() => handleProjectCategoryToggle(category)}
                                className="rounded bg-input border-primary text-wha-blue focus:ring-wha-blue"
                            />
                            <span className="text-sm text-primary truncate" title={category}>{category}</span>
                            </label>
                        ))}
                    </div>
                 </div>
            )}
          </div>
          
          {/* Tier/Layout Configurator */}
          <button
              onClick={onConfigureTiersClick}
              className="p-2 text-secondary hover:text-primary rounded-full relative"
              aria-label="Configure timeline layout"
              title="Configure timeline layout"
            >
              <LayersIcon />
            </button>

          <div className="relative" ref={holidaySelectorRef}>
            <button
              onClick={() => setIsHolidaySelectorOpen(!isHolidaySelectorOpen)}
              className="p-2 text-secondary hover:text-primary rounded-full relative"
              aria-label="Select holidays to display"
            >
              <StarIcon />
              {selectedHolidayCategories.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wha-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-wha-blue"></span>
                </span>
              )}
            </button>
            {isHolidaySelectorOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-secondary border border-primary rounded-lg shadow-xl z-20 p-2">
                <p className="text-xs text-secondary font-bold px-2 pb-1">Show Holidays</p>
                <div className="space-y-1">
                  {HOLIDAY_CATEGORIES.map(category => (
                    <label key={category.id} className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-tertiary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedHolidayCategories.includes(category.id)}
                        onChange={() => handleHolidayToggle(category.id)}
                        className="rounded bg-input border-primary text-wha-blue focus:ring-wha-blue"
                      />
                      <span className="text-sm text-primary">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onAddEventClick}
        className="px-5 py-2 rounded-md bg-to-orange text-white font-bold hover:bg-orange-600 transition duration-200"
      >
        + Add Event
      </button>
    </div>
  );
};