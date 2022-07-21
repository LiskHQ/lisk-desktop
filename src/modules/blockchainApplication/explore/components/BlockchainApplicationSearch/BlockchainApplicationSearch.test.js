import React from 'react';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import Input from '@theme/Input';
import { useSearchApplications } from '../../hooks/useSearchApplications';
import BlockchainApplicationSearch from './BlockchainApplicationSearch';

jest.useFakeTimers();
const mockSetSearchValue = jest.fn();
const mockSearchApplication = jest.fn();


beforeEach(() => {
  jest.resetModules();
});

describe('BlockchainApplicationSearch', () => {
  it('searches application ', () => {
    const props = {
      searchValue: '',
      error: 'string',
      isURl: true,
      urlStatus: 'ok',
      isLoading: false,
      onSearchApplications: mockSearchApplication,
    };
    const { rerender } = render(<BlockchainApplicationSearch {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Search by name or application URL'), { target: { value: 'test' } });
    jest.runAllTimers();
    expect(mockSearchApplication).toHaveBeenCalledTimes(1);
    expect(mockSearchApplication).toHaveBeenCalledWith('test');
  });

  // it('displays feedback for URL search', async () => {
  //   // jest.mock('../../hooks/useSearchApplications', () => ({
  //   // useSearchApplications.mockReturnValue({
  //   //   ...jest.requireActual('../../hooks/useSearchApplications'),
  //   //   // setSearchValue: mockSetSearchValue,
  //   //   // searchApplications: mockSearchApplication,
  //   //   urlSearch: true,
  //   // });
  //   // }));
  //   // console.log({ useSearchApplications: jest.requireActual('../../hooks/useSearchApplications') });
  //   render(<BlockchainApplicationSearch {...props} />);
  //   fireEvent.change(screen.getByPlaceholderText('Search by name or application URL'), { target: { value: 'https://api.coinbase.com' } });
  //   jest.runAllTimers();
  //   await waitFor(() => {
  //     expect(screen.getByText('Unable to connect to application node. Please check the address and try again')).toBeTruthy();
  //   });
  // });
});
