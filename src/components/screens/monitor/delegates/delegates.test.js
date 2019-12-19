import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import fakeStore from '../../../../../test/unit-test-utils/fakeStore';
import Delegates from './delegates';
import delegatesList from '../../../../../test/constants/delegates';
import * as blockActions from '../../../../actions/blocks';

const activeDelegates = delegatesList.map(item => ({ ...item, publicKey: item.account.publicKey }));
activeDelegates.push({
  username: 'additional',
  vote: '0',
  rewards: '0',
  producedBlocks: 28,
  missedBlocks: 0,
  productivity: 0,
  publicKey: 'test_pbk',
  rank: 999,
  account: {
    address: '14018336151296112016L',
    publicKey: 'test_pbk',
    secondPublicKey: '',
  },
  approval: 0,
});

describe('Delegates monitor page', () => {
  let props;
  let wrapper;

  const store = fakeStore();

  const setup = properties => mount(
    <Provider store={store}>
      <Delegates {...properties} />
    </Provider>,
  );

  const switchTab = (tab) => {
    wrapper.find(`.tab.${tab}`).simulate('click');
    wrapper.setProps({
      filters: {
        ...props.filters,
        tab,
      },
    });
  };

  beforeEach(() => {
    props = {
      t: key => key,
      delegates: {
        isLoading: true,
        data: activeDelegates,
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      standByDelegates: {
        isLoading: true,
        data: [],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      chartActiveAndStandbyData: {
        isLoading: false,
        data: '589',
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      chartRegisteredDelegatesData: {
        isLoading: false,
        data: [
          { x: 'Aug', y: 4 },
          { x: 'Sep', y: 1 },
          { x: 'Oct', y: 8 },
          { x: 'Nov', y: 4 },
        ],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      filters: {
        tab: 'active',
      },
      applyFilters: jest.fn(filters => wrapper.setProps({ filters })),
    };
  });

  it('renders a page with header', () => {
    wrapper = setup(props);
    expect(wrapper.find('BoxHeader.delegates-table')).toIncludeText('Active delegates');
  });

  it('allows to switch to stand by delegates', () => {
    wrapper = setup(props);
    switchTab('standby');
    expect(wrapper.find('.tab.standby')).toHaveClassName('active');
  });

  it('renders the forging status', () => {
    wrapper = setup(props);
    expect(wrapper.find('a.delegate-row')).toHaveLength(delegatesList.length + 1);
  });

  it('triggers forgingDataDisplayed action when mounted', () => {
    jest.spyOn(blockActions, 'forgingDataDisplayed');
    wrapper = setup(props);
    expect(blockActions.forgingDataDisplayed).toHaveBeenCalled();
  });

  it('triggers forgingDataConcealed action when unmounted', () => {
    jest.spyOn(blockActions, 'forgingDataConcealed');
    wrapper = setup(props);
    wrapper.unmount();
    expect(blockActions.forgingDataConcealed).toHaveBeenCalled();
  });
});
