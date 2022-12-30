import React from 'react';
import { MemoryRouter } from 'react-router';
import { renderWithRouter } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import { mockValidators } from '../../__fixtures__';
import ValidatorSummary from './ValidatorSummary';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn().mockReturnValue({
    t: jest.fn().mockImplementation((t) => t),
  }),
}));

describe('ValidatorSummary', () => {
  let wrapper;
  const props = {
    validator: { ...mockValidators.data[0], nextForgingTime: 1661165000 },
    status: { className: 'active', value: 'Active' },
    weight: '10k',
    lastForgeTime: 23293993234,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = renderWithRouter(ValidatorSummary, props);
  });

  it('should display properly', () => {
    expect(
      screen.getByText(
        'This validator is among the first 101 validators in validator weight ranking.'
      )
    ).toBeTruthy();
    expect(screen.getByText('CMB :')).toBeTruthy();
    expect(screen.getByTestId('cmb').innerHTML).toEqual(
      props.validator.consecutiveMissedBlocks.toString()
    );
    expect(screen.getByText(props.weight)).toBeTruthy();
    expect(screen.getByText('Last forged :')).toBeTruthy();
    expect(screen.getByText('22 Aug 2022')).toBeTruthy();
    expect(screen.getByAltText('starDark')).toBeTruthy();
    expect(screen.getByAltText('weightDark')).toBeTruthy();
  });

  it('disables stake button if validator is banned', () => {
    props.status = { className: 'banned', value: 'Banned' };
    wrapper.rerender(
      <MemoryRouter>
        <ValidatorSummary {...props} />
      </MemoryRouter>
    );
    expect(screen.getByText('Stake')).toHaveAttribute('disabled');
  });
});
