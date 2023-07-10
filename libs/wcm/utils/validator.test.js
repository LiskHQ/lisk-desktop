import { isValidWCURI } from './validator';

jest.mock('@walletconnect/utils', () => ({
  parseRelayParams: jest.fn((protocol, data) => ({ protocol, data })),
}));

describe('validator', () => {
  describe('isValidWCURI', () => {
    const invalidURIs = ['wc:random', 'http://www.myserver.com', 'wcc:random', 'random:text'];

    test.each(invalidURIs)('should return false when isValidWCURI receives %s', (aURI) => {
      expect(isValidWCURI(aURI)).toBe(false);
    });

    const validURIs = [
      'wc:7f3e15e3b954d5eddd7a7194c600735efe90dadd8511d6c89ed92822b6560ee8@2?relay-protocol=iridium&symKey=dcb608333d744b366732d2b1eeb9ea0d0caeb20ec0b785775fb867b51801e9ef',
    ];

    test.each(validURIs)('should return true when isValidWCURI receives %s', (aURI) => {
      expect(isValidWCURI(aURI)).toBe(true);
    });
  });
});
