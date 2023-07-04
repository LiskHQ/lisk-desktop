import React from 'react';
import { renderWithRouter } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { truncateAddress } from '@wallet/utils/account';
import { useValidators } from '@pos/validator/hooks/queries';
import { MemoryRouter } from 'react-router';
import { getMockValidators, mockSentStakes } from '../../__fixtures__';
import SentStakesRow from './SentStakesRow';

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
    expect(
      screen.queryByText(
        `${convertFromBaseDenom(amount, mockAppsTokens.data[0])} ${props.token.symbol}`
      )
    );
    expect(screen.getByAltText('edit')).toBeTruthy();
  });

  it('should rerender with new value', async () => {
    const container = renderWithRouter(SentStakesRow, props);
    const updatedProps = { ...props, data: mockSentStakes.data.stakes[2] };
    container.rerender(
      <MemoryRouter initialEntries={[]}>
        <SentStakesRow {...updatedProps} />
      </MemoryRouter>
    );
    const { amount } = updatedProps.data;
    expect(
      screen.queryByText(
        `${convertFromBaseDenom(amount, mockAppsTokens.data[0])} ${props.token.symbol}`
      )
    );
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
