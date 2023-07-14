import { sanitizeTextFromDomains } from 'src/utils/urlUtils';

describe('sanitizeTextFromDomains', () => {
  it('Should return properly', () => {
    const text = 'Web app';
    expect(sanitizeTextFromDomains(text)).toEqual(text);
  });

  it('Should return empty string when passed undefined', () => {
    expect(sanitizeTextFromDomains()).toEqual('');
  });

  it('Should not be longer than 30 chars', () => {
    const text = 'Web app Web app Web app teasdf Web app Web app Web app';
    const expected = 'Web app Web app Web app teasdf';
    expect(sanitizeTextFromDomains(text)).toEqual(expected);
  });

  it('Should remove a domain from a string', () => {
    const text = 'Web app scam.io Web';
    const expected = 'Web app  Web';
    expect(sanitizeTextFromDomains(text)).toEqual(expected);
  });

  it('Should remove a domain with param from a string', () => {
    const text = 'Web app scam.io?name=scam Web';
    const expected = 'Web app  Web';
    expect(sanitizeTextFromDomains(text)).toEqual(expected);
  });

  it('Should remove multiple domains from a string', () => {
    const text = 'Web scam.io phish.com';
    const expected = 'Web  ';
    expect(sanitizeTextFromDomains(text)).toEqual(expected);
  });
});
