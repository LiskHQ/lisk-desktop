import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from '@auth/__fixtures__';
import * as accountUtils from '@wallet/utils/account';
import useTxInitiatorAccount from './useTxInitiatorAccount';

jest.mock('@auth/hooks/queries');
jest
  .spyOn(accountUtils, 'extractAddressFromPublicKey')
  .mockReturnValue('lsk93msac7pppaqaxy2w84fcpfvq45caxtguednsp');

describe('useTxInitiatorAccount', () => {
  const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';

  it('should return command schemas', async () => {
    useAuth.mockReturnValue({
      data: mockAuth,
    });

    const { result } = renderHook(() => useTxInitiatorAccount({ senderPublicKey  }));

    expect(result.current.txInitiatorAccount).toEqual({
      ...(mockAuth.data || {}),
      ...(mockAuth.meta || {}),
      keys: {
        ...(mockAuth.data || { mandatoryKeys: [], optionalKeys: [] }),
      },
    });
  });

  it('should return empty object if no command parameters', async () => {
    useAuth.mockReturnValue({});

    const { result } = renderHook(() => useTxInitiatorAccount({ senderPublicKey }));
    expect(result.current.txInitiatorAccount).toEqual({
      keys: { mandatoryKeys: [], optionalKeys: [] },
    });
  });
});
