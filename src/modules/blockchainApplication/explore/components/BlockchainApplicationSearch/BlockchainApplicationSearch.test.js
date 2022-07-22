import React from 'react';
import {
  render, fireEvent, screen,
} from '@testing-library/react';
import BlockchainApplicationSearch from './BlockchainApplicationSearch';

jest.useFakeTimers();
const mockSearchApplication = jest.fn();
const searchUrl = 'https://api.coinbase.com';

beforeEach(() => {
  mockSearchApplication.mockClear();
});

describe('BlockchainApplicationSearch', () => {
  it('searches application by name', () => {
    const props = {
      searchValue: '',
      error: 'error',
      isURL: true,
      urlStatus: 'ok',
      isLoading: false,
      onSearchApplications: mockSearchApplication,
    };
    render(<BlockchainApplicationSearch {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Search by name or application URL'), { target: { value: 'test' } });
    jest.runAllTimers();
    expect(mockSearchApplication).toHaveBeenCalledTimes(1);
    expect(mockSearchApplication).toHaveBeenCalledWith('test');
  });

  it('displays feedback when searching by URL', async () => {
    const props = {
      searchValue: '',
      error: '',
      isURL: false,
      urlStatus: '',
      isLoading: false,
      onSearchApplications: mockSearchApplication,
    };
    const { rerender } = render(<BlockchainApplicationSearch {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Search by name or application URL'), { target: { value: searchUrl } });
    expect(mockSearchApplication).toHaveBeenCalledTimes(1);
    expect(mockSearchApplication).toHaveBeenCalledWith(searchUrl);
    const loadingProps = {
      ...props,
      isURL: true,
      searchValue: searchUrl,
      isLoading: true,
    };
    rerender(<BlockchainApplicationSearch {...loadingProps} />);
    expect(screen.getByTestId('spinner')).toBeTruthy();
    const postLoadingProps = {
      ...loadingProps,
      isLoading: false,
      urlStatus: 'ok',
    };
    rerender(<BlockchainApplicationSearch {...postLoadingProps} />);
    expect(screen.getByAltText('okIcon')).toBeTruthy();
  });
});
