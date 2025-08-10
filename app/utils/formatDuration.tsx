/**
 * Formats duration in minutes into a human-readable string (e.g., "2h 30m")
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes: number): string => {
  if (isNaN(minutes) || minutes < 0) {
    return "N/A";
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  let result = "";
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (mins > 0 || hours === 0) {
    result += `${mins}m`;
  }

  return result.trim() || "0m";
};
