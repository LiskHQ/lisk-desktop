import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AddApplicationSearch from './AddApplicationSearch';

jest.useFakeTimers();
const mockSearchApplication = jest.fn();
const searchUrl = 'https://api.coinbase.com';

beforeEach(() => {
  mockSearchApplication.mockClear();
});

describe('AddApplicationSearch', () => {
  it('searches application by name', () => {
    const props = {
      searchValue: '',
      isUrl: true,
      urlStatus: 'ok',
      isSearchLoading: false,
      onSearchApplications: mockSearchApplication,
    };
    render(<AddApplicationSearch {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Search by name or application URL'), {
      target: { value: 'test' },
    });
    jest.runAllTimers();
    expect(mockSearchApplication).toHaveBeenCalledTimes(1);
    expect(mockSearchApplication).toHaveBeenCalledWith('test');
  });

  it('displays feedback when searching by URL', async () => {
    const props = {
      searchValue: '',
      isUrl: false,
      urlStatus: '',
      isSearchLoading: false,
      onSearchApplications: mockSearchApplication,
    };
    const { rerender } = render(<AddApplicationSearch {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Search by name or application URL'), {
      target: { value: searchUrl },
    });
    expect(mockSearchApplication).toHaveBeenCalledTimes(1);
    expect(mockSearchApplication).toHaveBeenCalledWith(searchUrl);
    const loadingProps = {
      ...props,
      isUrl: true,
      searchValue: searchUrl,
      isSearchLoading: true,
    };
    rerender(<AddApplicationSearch {...loadingProps} />);
    expect(screen.getByTestId('spinner')).toBeTruthy();
    const postLoadingProps = {
      ...loadingProps,
      isSearchLoading: false,
      urlStatus: 'ok',
    };
    rerender(<AddApplicationSearch {...postLoadingProps} />);
    expect(screen.getByAltText('okIcon')).toBeTruthy();
  });
});
