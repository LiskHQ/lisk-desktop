/**
 * Compares two version values to and returns
 * a numeric comparison index
 *
 * @param {String} direction
 * Can either be desc or asc. By Default desc
 * @param {Object} a
 * The first peer values whose version we want tot compare
 * Should have a version member equal to x.x.x[-name.x]
 * @param {Object} b
 * Should have a version member equal to x.x.x[-name.x]
 * The second peer values whose version we want tot compare
 * @returns {Number}
 * 1 for a > b
 * 0 for a == b
 * -1 for a < b
 */
const sortByVersion = (a, b, direction = 'desc') => {
  if (a.networkVersion === b.networkVersion) return 0;

  const split = (version) => {
    const arr = version.split(/\.|-/);
    return Array.from({ length: 5 }, (item, index) => {
      if (arr[index] === 'rc') return -1;
      if (arr[index] === 'beta') return -2;
      return parseInt(arr[index], 10) || 0;
    });
  };
  const aParts = split(a.networkVersion || '');
  const bParts = split(b.networkVersion || '');

  return (
    aParts.reduce((acc, item, index) => {
      if (acc === 0 && item > bParts[index]) acc = 1;
      if (acc === 0 && item < bParts[index]) acc = -1;
      return acc;
    }, 0) * (direction === 'desc' ? -1 : 1)
  );
};

export default sortByVersion;
