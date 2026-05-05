export const formatDate = (date) => {
  if (!date) return '';

  return new Intl.DateTimeFormat('en-SG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Singapore',
  }).format(new Date(date));
};

export const formatWeekday = (date) => {
  if (!date) return '';

  return new Intl.DateTimeFormat('en-SG', {
    weekday: 'short',
    timeZone: 'Asia/Singapore',
  }).format(new Date(date));
};
