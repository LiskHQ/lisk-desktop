import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useCurrentAccount } from '@account/hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCommandSchema } from '@network/hooks';
import { mockCommandParametersSchemas } from '@common/__fixtures__';
import { useValidatorRewardsWithToken } from '@pos/reward/hooks/queries/useValidatorRewardsWithToken';

jest.useRealTimers();

jest.mock('@account/hooks/useCurrentAccount');
jest.mock('@network/hooks/useCommandsSchema');

useCurrentAccount.mockReturnValue([mockSavedAccounts[0]]);
useCommandSchema.mockReturnValue({
  moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  ),
});

describe('useValidatorRewardsWithToken', () => {
  it('Should toggle load when finished loading validators', async () => {
    const { result, waitFor } = renderHook(() => useValidatorRewardsWithToken(), { wrapper });
    await waitFor(() => result.current.isLoading === false);
    expect(result.current.isLoading).toEqual(false);
  });
});
