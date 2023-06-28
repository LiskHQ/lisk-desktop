import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useFilter } from 'src/modules/common/hooks';
import ValidatorStakesView from './ValidatorStakesView';
import { useReceivedStakes } from '../../hooks/queries';
import { mockReceivedStakes } from '../../__fixtures__';

const mockApplyFilters = jest.fn();
const mockClearFilters = jest.fn();

jest.mock('../../hooks/queries');
jest.mock('src/modules/common/hooks');

describe('Validator stakes view', () => {
  useReceivedStakes.mockReturnValue({ data: mockReceivedStakes });

  const props = {
    address: 'lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws',
  };

  useFilter.mockReturnValue({
    filters: { address: props.address },
    applyFilters: mockApplyFilters,
    clearFilters: mockClearFilters,
  });

  it('Should render a list of stakers', () => {
    render(<ValidatorStakesView {...props} />);

    expect(screen.getByText('Stakers')).toBeTruthy();
    mockReceivedStakes.data.stakers.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('Should filter stakers by search value', () => {
    useFilter.mockReturnValue({
      filters: { address: props.address },
      applyFilters: mockApplyFilters,
      clearFilters: mockClearFilters,
    });

    render(<ValidatorStakesView {...props} />);

    const searchField = screen.getByTestId('addressFilter');
    fireEvent.change(searchField, { target: { value: 'test' } });
    jest.runOnlyPendingTimers();

    expect(mockApplyFilters).toHaveBeenCalledWith({ search: 'test' });
  });

  // TODO: Refactor to retain 2.x wallet feature
  it('Should not render search input', () => {
    useFilter.mockReturnValue({
      filters: { address: props.address },
      applyFilters: mockApplyFilters,
      clearFilters: mockClearFilters,
    });
    useReceivedStakes.mockReturnValue({ data: { data: {} } });

    render(<ValidatorStakesView {...props} />);

    expect(screen.queryByTestId('addressFilter')).toBeFalsy();
  });
});
