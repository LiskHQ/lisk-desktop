const getGeneratingTime = (time) => {
  if (!time) return '-';
  const diff = time - Math.floor((new Date()).getTime() / 1000);
  if (Math.abs(diff) < 9) return 'now';
  const absTime = Math.abs(diff);
  const minutes = absTime / 60 >= 1 ? `${Math.floor(absTime / 60)}m ` : '';
  const seconds = absTime % 60 >= 1 ? `${absTime % 60}s` : '';
  if (diff > 0) {
    return `in ${minutes}${seconds}`;
  }
  return `${minutes}${seconds} ago`;
};

export default getGeneratingTime;
