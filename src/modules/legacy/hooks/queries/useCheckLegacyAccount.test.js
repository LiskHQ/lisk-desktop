import { renderHook } from '@testing-library/react-hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockLegacy } from '../../__fixtures__';
import { useLegacy } from './useLegacy';
import useCheckLegacyAccount from './useCheckLegacyAccount';

jest.mock('./useLegacy');

describe('useCheckLegacyAccount hook', () => {
  it('returns isMigrated as true if legacy balance is equal to 0', () => {
    useLegacy.mockImplementation(() => ({ data: mockLegacy }));
    const { result } = renderHook(() =>
      useCheckLegacyAccount(mockSavedAccounts[0].metadata.pubkey)
    );
    expect(result.current.isMigrated).toBe(true);
  });

  it('returns isMigrated as false if legacy balance is greater than 0', () => {
    const updatedMockLegacyAccount = {
      ...mockLegacy,
      data: { ...mockLegacy.data, balance: '10000000' },
    };
    useLegacy.mockImplementation(() => ({ data: updatedMockLegacyAccount }));
    const { result } = renderHook(() =>
      useCheckLegacyAccount(mockSavedAccounts[0].metadata.pubkey)
    );
    expect(result.current.isMigrated).toBe(false);
  });
});
