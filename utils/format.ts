export function formatRuntime(minutes: number): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatVoteAverage(vote: number): string {
  return vote.toFixed(1);
}

export function formatVoteCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function getMediaTitle(media: { title?: string; name?: string }): string {
  return media.title ?? media.name ?? 'Unknown';
}
