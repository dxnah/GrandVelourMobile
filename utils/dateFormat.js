export const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  export const daysBetween = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.max(0, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
  };