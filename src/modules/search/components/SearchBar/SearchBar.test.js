import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { keyCodes } from 'src/utils/keyCodes';
import { smartRender } from 'src/utils/testHelpers';
import routes from 'src/routes/routes';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { useSearch } from 'src/modules/search/hooks/useSearch';
import SearchBar from './SearchBar';

jest.mock('src/modules/search/hooks/useSearch', () => ({
  useSearch: jest.fn().mockReturnValue({
    addresses: {},
    validators: [],
    transactions: [],
    blocks: [],
    isLoading: false,
  }),
}));
jest.mock('@token/fungible/hooks/queries');

const accountAddress = 'lskgtrrftvoxhtknhamjab5wenfauk32z9pzk79uj';
const secondAccountAddress = 'lskwcumkptb6vk964qcxkb2h9gxsznaa8sqmyeqf6';

describe('SearchBar', () => {
  const config = {
    renderType: 'mount',
    historyInfo: {
      push: jest.fn(),
      location: { search: '' },
    },
    queryClient: true,
  };

  beforeEach(() => {
    useSearch.mockClear();
  });

  useTokenBalances.mockReturnValue({ data: mockAppsTokens.data[0] });

  it('should render properly SearchBar', () => {
    const { wrapper } = smartRender(SearchBar, null, config);
    expect(wrapper).toContainMatchingElement('.search-bar');
    expect(wrapper).toContainMatchingElement('.search-input');
    expect(wrapper).not.toContainMatchingElement('.loading');
  });

  it('should render empty results when search length is less than 3', () => {
    useSearch.mockReturnValueOnce({
      addresses: {},
      validators: [],
      transactions: [],
      blocks: [],
      isLoading: false,
    });
    const { wrapper } = smartRender(SearchBar, null, config);
    act(() => {
      wrapper
        .find('.search-input input')
        .at(0)
        .simulate('change', { target: { value: 'HI' } });
      wrapper.update();
      jest.runOnlyPendingTimers();
    });
    expect(wrapper).not.toContainMatchingElement('.accounts');
  });

  it('should render accounts data properly based on user data input', () => {
    useSearch.mockReturnValueOnce({
      addresses: { address: accountAddress, name: 'lisker' },
      validators: [],
      transactions: [],
      blocks: [],
      isLoading: false,
    });
    const { wrapper } = smartRender(SearchBar, null, config);
    act(() => {
      wrapper
        .find('.search-input input')
        .at(0)
        .simulate('change', { target: { value: accountAddress } });
      wrapper.update();
      jest.runOnlyPendingTimers();
    });
    expect(wrapper).toContainMatchingElement('.accounts');
  });

  it('should redirect to a different page if user do a click on selected row for transaction', () => {
    useSearch.mockReturnValue({
      addresses: {},
      validators: [],
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
      isLoading: false,
    });
    const { wrapper } = smartRender(SearchBar, null, config);

    act(() => {
      wrapper
        .find('.search-input input')
        .at(0)
        .simulate('change', { target: { value: '123456123234234' } });
    });

    wrapper.find('.search-transaction-row').at(0).simulate('click');
    expect(config.historyInfo.push).toBeCalledTimes(1);
    expect(config.historyInfo.push).toHaveBeenCalledWith(
      `${routes.transactionDetails.path}?transactionID=123456123234234`
    );
  });

  it('should use keyboard navigation to select search result for validators', () => {
    useSearch.mockReturnValue({
      addresses: {},
      validators: [
        {
          address: accountAddress,
          username: 'genesis_10',
          rank: 34,
          rewards: 23423,
          stake: 123,
        },
        {
          address: secondAccountAddress,
          username: 'genesis_101',
          rank: 26,
          rewards: 23421,
          stake: 127,
        },
      ],
      transactions: [],
      blocks: [],
      isLoading: false,
    });

    const { wrapper } = smartRender(SearchBar, null, { ...config, renderType: 'render' });

    act(() => {
      fireEvent.change(wrapper.getByTestId('searchText'), { target: { value: 'genesis' } });
      jest.runOnlyPendingTimers();
    });

    fireEvent.keyUp(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowDown });
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowUp });
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.enter });
    expect(config.historyInfo.push).toBeCalledWith(`/validators/profile?validatorAddress=${accountAddress}`);
  });

  it('should use keyboard navigation to select search result for address', () => {
    useSearch.mockReturnValue({
      addresses: { address: accountAddress, name: 'lisker' },
      validators: [],
      transactions: [],
      blocks: [],
      isLoading: false,
    });

    const { wrapper } = smartRender(SearchBar, null, { ...config, renderType: 'render' });

    act(() => {
      fireEvent.change(wrapper.getByTestId('searchText'), { target: { value: accountAddress } });
      jest.runOnlyPendingTimers();
    });

    fireEvent.keyUp(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowDown });
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowUp });
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.enter });
    expect(config.historyInfo.push).toBeCalledWith(`/explorer?address=${accountAddress}`);
  });

  it('should use keyboard navigation to select search result for transactions', () => {
    useSearch.mockReturnValue({
      addresses: {},
      validators: [],
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
      isLoading: false,
    });

    const { wrapper } = smartRender(SearchBar, null, { ...config, renderType: 'render' });

    act(() => {
      fireEvent.change(wrapper.getByTestId('searchText'), { target: { value: '123456123234234' } });
      jest.runOnlyPendingTimers();
    });

    fireEvent.keyUp(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowDown });
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowUp });
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.enter });
    expect(config.historyInfo.push).toBeCalled();
  });

  it('should use keyboard navigation to select search result for blocks', () => {
    useSearch.mockReturnValue({
      addresses: {},
      validators: [],
      transactions: [],
      blocks: [{ id: '3144423' }],
      isLoading: false,
    });

    const { wrapper } = smartRender(SearchBar, null, { ...config, renderType: 'render' });

    act(() => {
      fireEvent.change(wrapper.getByTestId('searchText'), { target: { value: '60008' } });
      jest.runOnlyPendingTimers();
    });

    fireEvent.keyUp(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowDown });
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.arrowUp });
    fireEvent.keyDown(wrapper.getByTestId('searchText'), { keyCode: keyCodes.enter });
    expect(config.historyInfo.push).toBeCalled();
  });

  it('should redirect to a different page if user do a click on selected row for address', () => {
    useSearch.mockReturnValueOnce({
      addresses: { address: accountAddress, name: 'lisker' },
      validators: [],
      transactions: [],
      blocks: [],
      isLoading: false,
    });
    const { wrapper } = smartRender(SearchBar, null, config);
    act(() => {
      wrapper
        .find('.search-input input')
        .at(0)
        .simulate('change', { target: { value: accountAddress } });
    });
    wrapper.find('.account-row').at(0).simulate('click');
    expect(config.historyInfo.push).toBeCalledWith(`/explorer?address=${accountAddress}`);
  });

  it('should redirect to a validator page if user do a click on selected row for validators', () => {
    useSearch.mockReturnValueOnce({
      addresses: {},
      validators: [
        {
          address: accountAddress,
          username: 'genesis_10',
          rank: 34,
          rewards: 23423,
          stake: 123,
        },
        {
          address: secondAccountAddress,
          username: 'genesis_101',
          rank: 26,
          rewards: 23421,
          stake: 127,
        },
      ],
      transactions: [],
      blocks: [],
      isLoading: false,
    });

    const { wrapper } = smartRender(SearchBar, null, config);

    act(() => {
      wrapper
        .find('.search-input input')
        .at(0)
        .simulate('change', { target: { value: 'genesis' } });
    });

    wrapper.find('.validators-row').at(0).simulate('click');
    expect(config.historyInfo.push).toBeCalledWith(`/validators/profile?validatorAddress=${accountAddress}`);
  });

  it('should redirect to a blocks page if user do a click on selected block', () => {
    useSearch.mockReturnValueOnce({
      addresses: {},
      validators: [],
      transactions: [],
      blocks: [{ id: '3144423' }],
      isLoading: false,
    });

    const { wrapper } = smartRender(SearchBar, null, config);

    act(() => {
      wrapper
        .find('.search-input input')
        .at(0)
        .simulate('change', { target: { value: '600078' } });
    });
    wrapper.find('.search-block-row').at(0).simulate('click');
    expect(config.historyInfo.push).toBeCalledWith('/block?id=3144423');
  });
});
