const randomCharsSequence = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateUniqueId = (randomDigits = 5) => {
  let uniqueId = `${new Date().getTime()}-`;
  Array.from(Array(randomDigits).keys()).map(() => {
    const randomCharIndex = Math.floor(Math.random() * randomCharsSequence.length);
    uniqueId = uniqueId.concat(randomCharsSequence.charAt(randomCharIndex));
    return uniqueId;
  });
  return uniqueId;
};

export default generateUniqueId;
