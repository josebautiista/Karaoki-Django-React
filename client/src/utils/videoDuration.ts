export const parseDuration = (duration: string): string => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = duration.match(regex);

  if (!match) {
    return "0 segundos";
  }

  const [, hours, minutes, seconds] = match;

  const hoursNum = parseInt(hours || "0", 10);
  const minutesNum = parseInt(minutes || "0", 10);
  const secondsNum = parseInt(seconds || "0", 10);

  const parts: string[] = [];
  if (hoursNum > 0) {
    parts.push(`${hoursNum} h${hoursNum > 1 ? "s" : ""}`);
  }
  if (minutesNum > 0) {
    parts.push(`${minutesNum} min${minutesNum > 1 ? "s" : ""}`);
  }
  if (secondsNum > 0) {
    parts.push(`${secondsNum} seg${secondsNum > 1 ? "s" : ""}`);
  }

  return parts.join(", ") || "0 segundos";
};
