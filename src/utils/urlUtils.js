export function sanitizeTextFromDomains(text) {
  if (!text) {
    return '';
  }
  const trimmedText = text.slice(0, 30);
  const httpRegexG = /[-\w@:%.+~#=]{1,64}\.\w{1,6}\b[-\w()@:%+.~#?&/=]*/gi;
  const urls = trimmedText.match(httpRegexG);

  if (!urls) {
    return trimmedText;
  }

  const escapedUrls = urls.map((url) => url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const urlRegexPattern = new RegExp(`\\b(${escapedUrls.join('|')})\\b`, 'gi');

  return trimmedText.replace(urlRegexPattern, '');
}
