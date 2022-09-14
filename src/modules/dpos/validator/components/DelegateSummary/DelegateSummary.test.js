import React from 'react';
import { screen, render } from '@testing-library/react';
import { mockDelegates } from '../../__fixtures__';
import DelegateSummary from './DelegateSummary';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn().mockReturnValue({
    t: jest.fn().mockImplementation((t) => t),
  }),
}));

describe('DelegateSummary', () => {
  let wrapper;
  const props = {
    delegate: { ...mockDelegates.data[0], nextForgingTime: 1661165000 },
    status: { className: 'active', value: 'Active' },
    weight: '10k',
    lastForgeTime: 23293993234,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = render(<DelegateSummary {...props} />);
  });

  it('should display properly', () => {
    expect(screen.getByText('This delegate is among the first 101 delegates in delegate weight ranking.')).toBeTruthy();
    expect(screen.getByText('CMB :')).toBeTruthy();
    expect(screen.getByTestId('cmb').innerHTML).toEqual(props.delegate.consecutiveMissedBlocks.toString());
    expect(screen.getByText(props.weight)).toBeTruthy();
    expect(screen.getByText('Last forged :')).toBeTruthy();
    expect(screen.getByText('22 Aug 2022')).toBeTruthy();
    expect(screen.getByAltText('starDark')).toBeTruthy();
    expect(screen.getByAltText('weightDark')).toBeTruthy();
  });

  it('disables vote button if delegate is banned', () => {
    props.status = { className: 'banned', value: 'Banned' };
    wrapper.rerender(<DelegateSummary {...props} />);
    expect(screen.getByText('Vote')).toHaveAttribute('disabled');
  });
});
