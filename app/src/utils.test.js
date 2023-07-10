import { canExecuteDeepLinking } from './utils';

describe('utils', () => {
  describe('canExecuteDeepLinking', () => {
    it('Should return valid if url path is whitelisted and has required search params', () => {
      const urlWithoutMessage =
        'lisk://wallet?modal=send&recipient=lskdb3ja5dhr25jhwm6onstawj33yk74g8q2549oc&amount=1&token=0200000000000000&recipientChain=02000000';
      const urlWithMessage =
        'lisk://wallet?modal=send&recipient=lskdb3ja5dhr25jhwm6onstawj33yk74g8q2549oc&amount=1&token=0200000000000000&recipientChain=02000000&reference=test message';

      expect(canExecuteDeepLinking(urlWithoutMessage)).toBeTruthy();
      expect(canExecuteDeepLinking(urlWithMessage)).toBeTruthy();
    });

    it('Should return invalid if url path is not whitelisted and has required search params', () => {
      const url =
        'lisk://test?modal=send&recipient=lskdb3ja5dhr25jhwm6onstawj33yk74g8q2549oc&amount=1&token=0200000000000000&recipientChain=02000000';
      expect(canExecuteDeepLinking(url)).toBeFalsy();
    });

    it('Should return invalid if url path is whitelisted and does not have required search params', () => {
      const invalidExtraParamUrl =
        'lisk://test?modal=send&recipient=lskdb3ja5dhr25jhwm6onstawj33yk74g8q2549oc&amount=1&token=0200000000000000&recipientChain=02000000&test=test';
      const invalildAmountUrl =
        'lisk://test?modal=send&recipient=lskdb3ja5dhr25jhwm6onstawj33yk74g8q2549oc&amount=test&token=0200000000000000&recipientChain=02000000';
      const invalidChainIDUrl =
        'lisk://test?modal=send&recipient=lskdb3ja5dhr25jhwm6onstawj33yk74g8q2549oc&amount=1&token=0200000000000000&recipientChain=02000';
      const invalidTokenIDUrl =
        'lisk://test?modal=send&recipient=lskdb3ja5dhr25jhwm6onstawj33yk74g8q2549oc&amount=1&token=00000000000&recipientChain=02000000';
      const invalidAddressUrl =
        'lisk://test?modal=send&recipient=lskdb3ja5dhr25jhwm6onstawj33yk74g8&amount=1&token=0200000000000000&recipientChain=02000000';

      expect(canExecuteDeepLinking(invalidExtraParamUrl)).toBeFalsy();
      expect(canExecuteDeepLinking(invalildAmountUrl)).toBeFalsy();
      expect(canExecuteDeepLinking(invalidChainIDUrl)).toBeFalsy();
      expect(canExecuteDeepLinking(invalidTokenIDUrl)).toBeFalsy();
      expect(canExecuteDeepLinking(invalidAddressUrl)).toBeFalsy();
    });
  });
});
