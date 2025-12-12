// Utilities for converting logged training sessions into dashboard-friendly metrics.
// Keep these functions defensive: users can type free-form distance/time strings.

const KM_TO_MI = 0.621371;

export function startOfWeek(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Sunday-start week (matches current ProgressDashboard logic)
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function weekKey(date = new Date()) {
  return startOfWeek(date).toISOString().split('T')[0];
}

export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  if (typeof timeStr === 'number' && Number.isFinite(timeStr)) return timeStr;
  const s = String(timeStr).trim();
  if (!s) return 0;

  // Accept HH:MM:SS or MM:SS, and also "25" meaning 25 minutes.
  if (/^\d+:\d{1,2}(:\d{1,2})?$/.test(s)) {
    const parts = s.split(':').map(p => parseInt(p, 10));
    if (parts.some(n => !Number.isFinite(n))) return 0;
    if (parts.length === 2) {
      const [mm, ss] = parts;
      return mm + (ss / 60);
    }
    if (parts.length === 3) {
      const [hh, mm, ss] = parts;
      return (hh * 60) + mm + (ss / 60);
    }
  }

  const asNumber = Number(s);
  return Number.isFinite(asNumber) ? asNumber : 0;
}

export function parseDistanceToMiles(distanceStr) {
  if (!distanceStr) return 0;
  if (typeof distanceStr === 'number' && Number.isFinite(distanceStr)) return distanceStr;
  const s = String(distanceStr).trim().toLowerCase();
  if (!s) return 0;

  // Named distances
  if (s.includes('half') && s.includes('marathon')) return 13.1094;
  if (s.includes('marathon')) return 26.2188;

  // 5K / 10K / 15K, etc.
  const kMatch = s.match(/(\d+(\.\d+)?)\s*k\b/);
  if (kMatch) {
    const km = Number(kMatch[1]);
    return Number.isFinite(km) ? km * KM_TO_MI : 0;
  }

  // miles / mi
  const miMatch = s.match(/(\d+(\.\d+)?)\s*(mi|mile|miles)\b/);
  if (miMatch) {
    const mi = Number(miMatch[1]);
    return Number.isFinite(mi) ? mi : 0;
  }

  // Fallback: any bare number is assumed to be miles.
  const numMatch = s.match(/(\d+(\.\d+)?)/);
  if (numMatch) {
    const mi = Number(numMatch[1]);
    return Number.isFinite(mi) ? mi : 0;
  }

  return 0;
}

export function makeActivityFromTrainingSession(session) {
  const date = session?.date || new Date().toISOString().split('T')[0];
  const name = session?.type || 'Training Run';
  const distanceMiles = parseDistanceToMiles(session?.distance);
  const durationMinutes = parseTimeToMinutes(session?.time);
  const pace = distanceMiles > 0 ? (durationMinutes / distanceMiles) : 0;

  return {
    date,
    name,
    distance: distanceMiles,
    duration: durationMinutes,
    pace,
    hitGoldenPace: false,
    rawDistance: session?.distance,
    rawTime: session?.time,
    notes: session?.notes
  };
}


