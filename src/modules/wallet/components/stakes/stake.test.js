import { mountWithRouter } from 'src/utils/testHelpers';
import routes from 'src/routes/routes';
import accounts from '@tests/constants/wallets';
import Stakes from './stakes';

describe('Stakes Tab Component', () => {
  let wrapper;
  const props = {
    stakes: {
      data: [],
      loadData: jest.fn(),
    },
    emptyStakes: {
      data: [],
      loadData: jest.fn(),
    },
    accounts: {
      data: {},
      loadData: jest.fn(),
    },
    address: accounts.genesis.summary.address,
    t: v => v,
    history: { push: jest.fn() },
  };
  const stakes = {
    ...props.stakes,
    data: [...Array(10)].map((_, i) => ({
      username: `user_${i}`,
      address: `lsk${i}`,
      rank: i + 1,
      rewards: '40500000000',
      productivity: Math.random() * 100,
      stake: '9999988456732672',
    })),
  };

  afterEach(() => {
    props.stakes.loadData.mockRestore();
    props.accounts.loadData.mockRestore();
  });

  const setup = customProps => mountWithRouter(Stakes, customProps);

  it('Should render with empty state', () => {
    wrapper = setup(props);
    expect(wrapper.find('.empty-state')).toIncludeText('This account doesn’t have any stakes.');
  });

  it('Should show loading state', () => {
    wrapper = setup({ ...props, stakes: { ...props.stakes, isLoading: true } });
    expect(wrapper).toContainMatchingElement('.loading');
  });

  it('should call accounts.loadData with right arguments', () => {
    const loadData = jest.fn();
    wrapper = setup({
      ...props,
      stakes: { ...stakes, isLoading: true },
      accounts: { data: [], loadData },
    });
    expect(loadData).toBeCalledWith({
      addressList: ['lsk0',
        'lsk1',
        'lsk2',
        'lsk3',
        'lsk4',
        'lsk5',
        'lsk6',
        'lsk7',
        'lsk8',
        'lsk9'],
      isValidator: true,
    });
  });
  it('should not call accounts.loadData if accounts.data and no sentStakes is empty', () => {
    const loadData = jest.fn();
    wrapper = setup({
      ...props,
      stakes: { ...props.emptyStakes, isLoading: true },
      accounts: { data: [], loadData },
    });
    expect(loadData).not.toHaveBeenCalled();
  });

  it('Should render stakes', () => {
    const customProps = {
      ...props,
      stakes,
    };
    wrapper = setup(customProps);
    expect(wrapper).toContainMatchingElements(10, 'StakeRow');
  });

  it('Should go to account page on clicking row', () => {
    const customProps = {
      ...props,
      stakes,
    };
    wrapper = setup(customProps);
    wrapper.find('.stake-row > div').at(0).first().simulate('click');
    jest.advanceTimersByTime(300);
    expect(props.history.push).toBeCalledWith(`${routes.explorer.path}?address=lsk0`);
  });

  it('Should filter stakes per username and show error message if no results found', () => {
    const customProps = {
      ...props,
      stakes,
    };
    wrapper = setup(customProps);
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'user_1' } });
    jest.advanceTimersByTime(300);
    expect(wrapper).toContainMatchingElements(1, '.stake-row');
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'not user name' } });
    jest.advanceTimersByTime(300);
    expect(wrapper).toContainMatchingElements(1, 'Empty');
  });
});
