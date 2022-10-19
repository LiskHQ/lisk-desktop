import React from 'react'
import { act } from 'react-dom/test-utils'
import { keyCodes } from 'src/utils/keyCodes';
import { mountWithQueryClient, renderWithQueryClient } from 'src/utils/testHelpers';
import { fireEvent, render } from '@testing-library/react';
import { useSearch } from 'src/modules/search/hooks/useSearch'
import SearchBar from './SearchBar';


jest.mock('src/modules/search/hooks/useSearch', () => ({
  useSearch: jest.fn().mockReturnValue({
    addresses: [],
    delegates: [],
    transactions: [],
    blocks: [],
    isLoading: false
  })
}))

describe('SearchBar', () => {
  const props = {
    history: {
      push: jest.fn(),
      location: { search: '' },
    },
  };

  it('should render properly SearchBar', () => {
    const wrapper = mountWithQueryClient(SearchBar, props);
    expect(wrapper).toContainMatchingElement('.search-bar');
    expect(wrapper).toContainMatchingElement('.search-input');
    expect(wrapper).not.toContainMatchingElement('.loading');
  });

  it('should render empty results when search length is less than 3', () => {
    useSearch.mockReturnValueOnce({
      addresses: [],
      delegates: [],
      transactions: [],
      blocks: [],
      isLoading: false
    })
    const wrapper = mountWithQueryClient(SearchBar, props)
    act(() => {
      wrapper.find('.search-input input').at(0).simulate('change', { target: { value: 'HI' } });
      wrapper.update();
      jest.runAllTimers();
    })
    expect(wrapper).not.toContainMatchingElement('.accounts')
  });

  it('should render accounts data properly based on user data input', () => {
    useSearch.mockReturnValueOnce({
      addresses: [{ address: '123456L', name: 'lisker' }],
      delegates: [],
      transactions: [],
      blocks: [],
      isLoading: false
    })
    const wrapper = mountWithQueryClient(SearchBar, props)
    act(() => {
      wrapper.find('.search-input input').at(0).simulate('change', { target: { value: '123456L' } });
      wrapper.update();
      jest.runAllTimers();
    })
    expect(wrapper).toContainMatchingElement('.accounts')
  });

  it('should redirect to a different page if user do a click on selected row for transaction', () => {
    useSearch.mockReturnValue({
      addresses: [],
      delegates: [],
      transactions: [
        {
          params: {
            data: 'testing',
          },
          id: '123456123234234',
          moduleCommand: 'token:transfer',
        },
      ],
      blocks: [],
      isLoading: false
    })
    const wrapper = mountWithQueryClient(SearchBar, props)

    act(() => {
      wrapper.find('.search-input input').at(0).simulate('change', { target: { value: '123456123234234' } });
    })

    wrapper.find('.search-transaction-row').at(0).simulate('click');
    expect(props.history.push).toBeCalled();
  });

  it('should uses keyboard navigation to select search result for delegates', () => {
    useSearch.mockReturnValue({
      addresses: [],
      delegates: [
        {
          address: '123456L',
          username: 'genesis_10',
          rank: 34,
          rewards: 23423,
          vote: 123,
        },
        {
          address: '123457L',
          username: 'genesis_101',
          rank: 26,
          rewards: 23421,
          vote: 127,
        },
      ],
      transactions: [],
      blocks: [],
      isLoading: false
    })

    const wrapper = render(<SearchBar {...props}/>)

    act(() => {
      fireEvent.change(wrapper.getByTestId('searchText'), { target: { value: 'genesis' } })
      jest.runAllTimers();
    })

    fireEvent.keyUp(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowDown })
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowUp })
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.enter })
    expect(props.history.push).toBeCalledWith("/delegates/profile?address=123456L");
  });
  
  it('should uses keyboard navigation to select search result for address', () => {
    useSearch.mockReturnValue({
      addresses: [{ address: '123456L', name: 'lisker' }],
      delegates: [],
      transactions: [],
      blocks: [],
      isLoading: false
    })

    const wrapper = render(<SearchBar {...props}/>)

    act(() => {
      fireEvent.change(wrapper.getByTestId('searchText'), { target: { value: '123456L' } })
      jest.runAllTimers();
    })

    fireEvent.keyUp(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowDown })
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowUp })
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.enter })
    expect(props.history.push).toBeCalledWith("/explorer?address=123456L");
  });

  it('should uses keyboard navigation to select search result for transactions', () => {
    useSearch.mockReturnValue({
      addresses: [],
      delegates: [],
      transactions: [
        {
          params: {
            data: 'testing',
          },
          id: '123456123234234',
          moduleCommand: 'token:transfer',
        },
      ],
      blocks: [],
      isLoading: false
    })

    const wrapper = render(<SearchBar {...props}/>)

    act(() => {
      fireEvent.change(wrapper.getByTestId('searchText'), { target: { value: '123456123234234' } })
      jest.runAllTimers();
    })

    fireEvent.keyUp(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowDown })
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowUp })
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.enter })
    expect(props.history.push).toBeCalled();
  });
  
  it('should uses keyboard navigation to select search result for blocks', () => {
    useSearch.mockReturnValue({
      addresses: [],
      delegates: [],
      transactions: [],
      blocks: [{ id: '3144423' }],
      isLoading: false
    })

    const wrapper = render(<SearchBar {...props}/>)

    act(() => {
      fireEvent.change(wrapper.getByTestId('searchText'), { target: { value: '60008' } })
      jest.runAllTimers();
    })

    fireEvent.keyUp(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowDown })
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowUp })
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.enter })
    expect(props.history.push).toBeCalled();
  });

  it('should redirect to a different page if user do a click on selected row for address', () => {
    useSearch.mockReturnValueOnce({
      addresses: [{ address: '123456L', name: 'lisker' }],
      delegates: [],
      transactions: [],
      blocks: [],
      isLoading: false
    })
    const wrapper = mountWithQueryClient(SearchBar, props)
    act(() => {
      wrapper.find('.search-input input').at(0).simulate('change', { target: { value: '123456L' } });
    })
    wrapper.find('.account-row').at(0).simulate('click');
    expect(props.history.push).toBeCalledWith("/explorer?address=123456L");
  });

  it('should redirect to a delegate page if user do a click on selected row for delegates', () => {
    useSearch.mockReturnValueOnce({
      addresses: [],
      delegates: [
        {
          address: '123456L',
          username: 'genesis_10',
          rank: 34,
          rewards: 23423,
          vote: 123,
        },
        {
          address: '123457L',
          username: 'genesis_101',
          rank: 26,
          rewards: 23421,
          vote: 127,
        },
      ],
      transactions: [],
      blocks: [],
      isLoading: false
    })

    const wrapper = mountWithQueryClient(SearchBar, props)

    act(() => {
      wrapper.find('.search-input input').at(0).simulate('change', { target: { value: 'genesis' } });
    })

    wrapper.find('.delegates-row').at(0).simulate('click');
    expect(props.history.push).toBeCalledWith("/delegates/profile?address=123456L");
  });
  
  it('should redirect to a blocks page if user do a click on selected block', () => {
    useSearch.mockReturnValueOnce({
      addresses: [],
      delegates: [],
      transactions: [],
      blocks: [{ id: '3144423' }],
      isLoading: false
    })

    const wrapper = mountWithQueryClient(SearchBar, props)

    act(() => {
      wrapper.find('.search-input input').at(0).simulate('change', { target: { value: '600078' } });
    })
    wrapper.find('.search-block-row').at(0).simulate('click');
    expect(props.history.push).toBeCalledWith('/block?id=3144423');
  });
});
