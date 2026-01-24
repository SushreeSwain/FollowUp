export function formatDate(isoDate) {
  if (!isoDate) return '';

  const date = new Date(isoDate);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  function getSuffix(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  return `${day}${getSuffix(day)} ${month} ${year}`;
}
