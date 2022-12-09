import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useFilter } from 'src/modules/common/hooks';
import ValidatorVotesView from './ValidatorVotesView';
import { useReceivedVotes } from '../../hooks/queries';
import { mockReceivedVotes } from '../../__fixtures__';

const mockApplyFilters = jest.fn();
const mockClearFilters = jest.fn();

jest.mock('../../hooks/queries');
jest.mock('src/modules/common/hooks');

describe('Validator votes view', () => {
  useReceivedVotes.mockReturnValue({ data: mockReceivedVotes });

  const props = {
    address: 'lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws',
  };

  useFilter.mockReturnValue({
    filters: { adress: props.address },
    applyFilters: mockApplyFilters,
    clearFilters: mockClearFilters,
  });

  it('Should render a list of voters', () => {
    render(<ValidatorVotesView {...props} />);

    expect(screen.getByText('Voters')).toBeTruthy();
    mockReceivedVotes.data.votes.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('Should filter voters by search value', () => {
    useFilter.mockReturnValue({
      filters: { adress: props.address },
      applyFilters: mockApplyFilters,
      clearFilters: mockClearFilters,
    });

    render(<ValidatorVotesView {...props} />);

    const searchField = screen.getByTestId('addressFilter');
    fireEvent.change(searchField, { target: { value: 'test' } });
    jest.runAllTimers();

    expect(mockApplyFilters).toHaveBeenCalledWith({ search: 'test' });
  });

  it('Should not render search input', () => {
    useFilter.mockReturnValue({
      filters: { adress: props.address },
      applyFilters: mockApplyFilters,
      clearFilters: mockClearFilters,
    });
    useReceivedVotes.mockReturnValue({ data: {} });

    render(<ValidatorVotesView {...props} />);

    expect(screen.queryByTestId('addressFilter')).toBeFalsy();
    expect(screen.getByText('(...)')).toBeTruthy();
  });
});
