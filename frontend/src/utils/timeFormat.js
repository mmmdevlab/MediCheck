export const formatTime = (time) => {
  if (!time) return '';

  return new Intl.DateTimeFormat('en-SG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Singapore',
  }).format(new Date(time));
};
