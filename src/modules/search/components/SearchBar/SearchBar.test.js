import { act } from 'react-dom/test-utils'
import { keyCodes } from 'src/utils/keyCodes';
import { mountWithQueryClient } from 'src/utils/testHelpers';
import * as Search from '../../hooks/useSearch'
import SearchBar from './SearchBar';


jest.mock('../../hooks/useSearch', () => ({
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

  it('should render accounts data properly based on user data input', () => {
    Search.useSearch.mockReturnValueOnce({
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

  it('should redirect to a different page if user do a click on selected row for address', () => {
    Search.useSearch.mockReturnValueOnce({
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
    expect(props.history.push).toBeCalled();
  });

  it('should redirect to a different page if user do a click on selected row for transaction', () => {
    Search.useSearch.mockReturnValueOnce({
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

  it('should redirect to a delegate page if user do a click on selected row for delegates', () => {
    Search.useSearch.mockReturnValueOnce({
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

    wrapper.find('.search-input input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    wrapper.find('.search-input input').simulate('keyDown', { keyCode: keyCodes.arrowUp });
    wrapper.find('.search-input input').simulate('keyDown', { keyCode: keyCodes.enter });
    expect(props.history.push).toBeCalled();
  });
});
