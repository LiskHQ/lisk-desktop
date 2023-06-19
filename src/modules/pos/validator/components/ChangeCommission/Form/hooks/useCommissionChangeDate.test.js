import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useTransactions } from '@transaction/hooks/queries';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { mockTransactions } from '@transaction/__fixtures__';
import { usePosConstants } from '@pos/validator/hooks/queries';
import { mockPosConstants } from '@pos/validator/__fixtures__/mockPosConstants';
import { useCommissionChangeDate } from './useCommissionChangeDate';

jest.useRealTimers();

jest.mock('@transaction/hooks/queries');
jest.mock('@pos/validator/hooks/queries');
useTransactions.mockReturnValue([mockSavedAccounts[0]]);
usePosConstants.mockReturnValue({ data: mockPosConstants });

describe('useCommissionChangeDate hook', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should not return a date if commission never has been changed', async () => {
    const { result } = renderHook(() => useCommissionChangeDate(), { wrapper });
    expect(result.current).toBeFalsy();
  });

  it('should return a date if commission never has been changed', async () => {
    const transaction = {
      ...mockTransactions.data[0],
      moduleCommand: MODULE_COMMANDS_NAME_MAP.changeCommission,
      timeStamp: 123455,
    };

    useTransactions.mockReturnValue({
      data: {
        data: [transaction],
      },
    });
    const { result } = renderHook(() => useCommissionChangeDate(), { wrapper });
    expect(result.current).toBeTruthy();
  });
});
