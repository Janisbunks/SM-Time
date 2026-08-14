import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';

export function formatAirDate(dateString: string): string {
  if (!dateString) return 'TBA';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatYear(dateString: string): string {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'yyyy');
  } catch {
    return '';
  }
}

export function isUpcoming(dateString: string): boolean {
  if (!dateString) return false;
  try {
    return isAfter(parseISO(dateString), new Date());
  } catch {
    return false;
  }
}

export function isAired(dateString: string): boolean {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    return isBefore(date, new Date()) || isToday(date);
  } catch {
    return false;
  }
}
