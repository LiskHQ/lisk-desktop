import { renderWithRouter } from 'src/utils/testHelpers';
import { fireEvent, screen } from '@testing-library/react';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { truncateAddress } from '@wallet/utils/account';
import { useValidators } from '@pos/validator/hooks/queries';
import SentStakesRow from './SentStakesRow';
import { getMockValidators, mockSentStakes } from '../../__fixtures__';

jest.mock('@pos/validator/hooks/queries');

describe('SentStakesRow', () => {
  useValidators.mockImplementation(({ config }) => ({
    data: getMockValidators(config.params?.address),
    isLoading: false,
  }));

  const props = {
    data: mockSentStakes.data.stakes[0],
    stakeEdited: jest.fn(),
    token: mockTokensBalance.data[0],
  };

  it('should display properly', async () => {
    renderWithRouter(SentStakesRow, props);
    const { address, amount } = props.data;
    const { name } = getMockValidators(address).data[0];

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(truncateAddress(address))).toBeTruthy();
    expect(screen.queryByText(`${fromRawLsk(amount)} ${props.token.symbol}`));
    expect(screen.getByAltText('deleteIcon')).toBeTruthy();
    expect(screen.getByAltText('edit')).toBeTruthy();

    fireEvent.click(screen.getByAltText('deleteIcon'));

    expect(props.stakeEdited).toHaveBeenCalledWith([
      {
        name,
        address,
        amount: 0,
      },
    ]);
  });

  it('should display properly when loading validators', async () => {
    useValidators.mockImplementation(({ config }) => ({
      data: getMockValidators(config.params?.address),
      isLoading: true,
    }));

    renderWithRouter(SentStakesRow, props);
    const { address } = props.data;
    const { name } = getMockValidators(address).data[0];

    expect(screen.queryByText(name)).toBeFalsy();
  });
});
