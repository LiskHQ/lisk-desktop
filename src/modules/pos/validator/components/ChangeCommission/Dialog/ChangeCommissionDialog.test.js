import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import { ChangeCommissionDialog } from './ChangeCommissionDialog';

jest.useRealTimers();
jest.mock('@walletconnect/sign-client', () => ({
  init: jest.fn().mockResolvedValue(Promise.resolve({ mock: true })),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

describe('ChangeCommissionDialog', () => {
  it('should render properly', () => {
    renderWithRouterAndQueryClient(ChangeCommissionDialog);
    const backButton = screen.getByText('Edit commission');
    expect(backButton).toBeInTheDocument();
  });
});
