import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useFilter } from 'src/modules/common/hooks';
import DelegateVotesView from './delegateVotesView';
import { useReceivedVotes } from '../../hooks/queries';
import { mockReceivedVotes } from '../../__fixtures__';

const mockApplyFilters = jest.fn();
const mockClearFilters = jest.fn();

jest.mock('../../hooks/queries');
jest.mock('src/modules/common/hooks');

describe('Delegate votes view', () => {
  useReceivedVotes.mockReturnValue({ data: mockReceivedVotes });

  const props = {
    address: 'lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws',
  };

  useFilter.mockReturnValue({
    filters: { address: props.address },
    applyFilters: mockApplyFilters,
    clearFilters: mockClearFilters,
  });

  it('Should render a list of voters', () => {
    render(<DelegateVotesView {...props} />);

    expect(screen.getByText('Voters')).toBeTruthy();
    mockReceivedVotes.data.votes.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('Should filter voters by search value', () => {
    useFilter.mockReturnValue({
      filters: { address: props.address },
      applyFilters: mockApplyFilters,
      clearFilters: mockClearFilters,
    });

    render(<DelegateVotesView {...props} />);

    const searchField = screen.getByTestId('addressFilter');
    fireEvent.change(searchField, { target: { value: 'test' } });
    jest.runAllTimers();

    expect(mockApplyFilters).toHaveBeenCalledWith({ search: 'test' });
  });

  it('Should not render search input', () => {
    useFilter.mockReturnValue({
      filters: { address: props.address },
      applyFilters: mockApplyFilters,
      clearFilters: mockClearFilters,
    });
    useReceivedVotes.mockReturnValue({ data: {} });

    render(<DelegateVotesView {...props} />);

    expect(screen.queryByTestId('addressFilter')).toBeFalsy();
    expect(screen.getByText('(...)')).toBeTruthy();
  });
});
