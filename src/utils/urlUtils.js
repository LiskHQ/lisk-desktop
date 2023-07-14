export function sanitizeTextFromDomains(text) {
  if (!text) {
    return '';
  }
  const trimmedText = text.slice(0, 30);
  const httpRegexG =
    /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*/g;
  const urls = trimmedText.match(httpRegexG);

  if (!urls) {
    return trimmedText;
  }

  const urlRegexPattern = new RegExp(`\\b${urls.join('|')}\\b`, 'gi');
  const textWithoutDomains = trimmedText.replace(urlRegexPattern, '');

  return textWithoutDomains;
}
