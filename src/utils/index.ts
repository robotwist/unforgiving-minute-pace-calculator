/**
 * VDOT and pace calculation utilities
 * Based on Jack Daniels' Running Formula
 */

export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  
  const parts = timeStr.trim().split(':');
  
  if (parts.length === 2) {
    // MM:SS format
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  
  // Single number assumed to be minutes
  const minutes = parseFloat(timeStr);
  return Math.round(minutes * 60);
}

export function secondsToTimeString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export function getDistanceInMeters(distance: string): number {
  const distanceMap: Record<string, number> = {
    '1 Mile': 1609,
    '5K': 5000,
    '8K': 8000,
    '5 Mile': 8047,
    '10K': 10000,
    '12K': 12000,
    '15K': 15000,
    '10 Mile': 16094,
    'Half Marathon': 21097,
    'Marathon': 42195
  };
  
  return distanceMap[distance] || 5000;
}

export function calculateVDOT(timeInSeconds: number, distanceInMeters: number): number {
  // Jack Daniels' VDOT calculation
  // This is a simplified version - in production, use the full Jack Daniels formula
  
  const velocity = distanceInMeters / timeInSeconds; // m/s
  const velocityKmh = velocity * 3.6; // km/h
  
  // Simplified VDOT approximation
  // Real formula is more complex and accounts for energy cost
  const vdot = Math.round(15.3 * Math.pow(velocityKmh / 3.5, 1.06));
  
  // Clamp to reasonable values
  return Math.max(20, Math.min(85, vdot));
}

export function calculateTrainingPaces(vdot: number) {
  // Simplified training pace calculations based on VDOT
  // In production, use the full Jack Daniels pace tables
  
  const easyPaceSeconds = Math.round((480 - vdot * 4.5) * 1.15);
  const marathonPaceSeconds = Math.round(480 - vdot * 4.5);
  const thresholdPaceSeconds = Math.round((480 - vdot * 4.5) * 0.92);
  const intervalPaceSeconds = Math.round((480 - vdot * 4.5) * 0.85);
  const repetitionPaceSeconds = Math.round((480 - vdot * 4.5) * 0.78);
  
  return {
    easy: formatPacePerMile(easyPaceSeconds),
    marathon: formatPacePerMile(marathonPaceSeconds),
    threshold: formatPacePerMile(thresholdPaceSeconds),
    interval: formatPacePerMile(intervalPaceSeconds),
    repetition: formatPacePerMile(repetitionPaceSeconds)
  };
}

function formatPacePerMile(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function validateTimeFormat(timeStr: string): boolean {
  const timePattern = /^(\d{1,2}):(\d{2})$|^(\d{1,2}):(\d{2}):(\d{2})$/;
  return timePattern.test(timeStr);
}

export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
