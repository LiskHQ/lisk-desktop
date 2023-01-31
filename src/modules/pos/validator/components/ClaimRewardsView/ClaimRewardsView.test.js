import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from '@auth/__fixtures__';
import { useCommandSchema } from '@network/hooks';
import { mockCommandParametersSchemas } from '@common/__fixtures__';
import { screen } from '@testing-library/react';
import ClaimRewardsView from './index';

jest.mock('@walletconnect/sign-client', () => ({
  init: jest.fn().mockResolvedValue(Promise.resolve({ mock: true })),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

jest.mock('@network/hooks/useCommandsSchema');
jest.mock('@auth/hooks/queries');

describe('ClaimRewardsView', () => {
  useAuth.mockReturnValue({ data: mockAuth });
  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('should render properly', () => {
    renderWithRouterAndQueryClient(ClaimRewardsView);
    expect(screen.getByRole('button', { name: 'Claim rewards' })).toBeTruthy();
  });
});
