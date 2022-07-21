import React from 'react';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import { useSearchApplications } from '../../hooks/useSearchApplications';
import BlockchainApplicationSearch from './BlockchainApplicationSearch';

jest.useFakeTimers();
const mockSetSearchValue = jest.fn();
const mockSearchApplication = jest.fn();

jest.mock('../../hooks/useSearchApplications');
jest.mock('../../api', () => ({
  getApplicationConfig: jest.fn().mockRejectedValue(new Error('Application unavailable')),
}));

const props = {
  externalApplications: {
    data: [],
    loadData: jest.fn(),
  },
  applyFilters: jest.fn(),
  filters: { search: '' },
};

beforeEach(() => {
  jest.resetModules();
});

describe('BlockchainApplicationSearch', () => {
  it('searches with the entered value', () => {
    // jest.mock('../../hooks/useSearchApplications', () => ({
    //   useSearchApplications: jest.fn(() => ({
    //     ...jest.requireActual('../../hooks/useSearchApplications'),
    //     setSearchValue: mockSetSearchValue,
    //     searchApplication: mockSearchApplication,
    //     // urlSearch: false,
    //   })),
    // }));
    useSearchApplications.mockReturnValue({
      setSearchValue: mockSetSearchValue,
      searchApplications: mockSearchApplication,
      urlSearch: false,
    });
    render(<BlockchainApplicationSearch {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Search by name or application URL'), { target: { value: 'test' } });
    jest.runAllTimers();
    expect(mockSetSearchValue).toHaveBeenCalledTimes(1);
    expect(mockSetSearchValue).toHaveBeenCalledWith('test');
    expect(mockSearchApplication).toHaveBeenCalledTimes(1);
    expect(mockSearchApplication).toHaveBeenCalledWith('test');
  });

  it('displays feedback for URL search', async () => {
    // jest.mock('../../hooks/useSearchApplications', () => ({
    // useSearchApplications.mockReturnValue({
    //   ...jest.requireActual('../../hooks/useSearchApplications'),
    //   // setSearchValue: mockSetSearchValue,
    //   // searchApplications: mockSearchApplication,
    //   urlSearch: true,
    // });
    // }));
    // console.log({ useSearchApplications: jest.requireActual('../../hooks/useSearchApplications') });
    render(<BlockchainApplicationSearch {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Search by name or application URL'), { target: { value: 'https://api.coinbase.com' } });
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.getByText('Unable to connect to application node. Please check the address and try again')).toBeTruthy();
    });
  });
});
