export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday, assuming week starts on monday
  d.setHours(0, 0, 0, 0);
  return new Date(d.setDate(diff));
};

export const getEndOfWeek = (date: Date): Date => {
  const d = getStartOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getStartOfMonth = (date: Date): Date => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getEndOfMonth = (date: Date): Date => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getStartOfQuarter = (date: Date): Date => {
    const quarter = Math.floor(date.getMonth() / 3);
    const d = new Date(date.getFullYear(), quarter * 3, 1);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const getEndOfQuarter = (date: Date): Date => {
    const quarter = Math.floor(date.getMonth() / 3);
    const d = new Date(date.getFullYear(), quarter * 3 + 3, 0);
    d.setHours(23, 59, 59, 999);
    return d;
};

export const getStartOfYear = (date: Date): Date => {
    const d = new Date(date.getFullYear(), 0, 1);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const getEndOfYear = (date: Date): Date => {
    const d = new Date(date.getFullYear(), 11, 31);
    d.setHours(23, 59, 59, 999);
    return d;
};

export const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};
