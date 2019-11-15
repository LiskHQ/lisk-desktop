import React from 'react';
import { mount } from 'enzyme';
import delegates from '../../../../../test/constants/delegates';
import ForgingDetails from './forgingDetails';

describe('Forging Details', () => {
  let wrapper;
  let props = {
    t: key => key,
    sortDirection: 'asc',
    networkStatus: {
      data: {
        supply: 9000000000000000000,
      },
    },
    delegates: {
      isLoading: true,
      data: delegates.map((delegate, i) => ({
        ...delegate,
        forgingTime: i,
      })),
      loadData: jest.fn(),
      clearData: jest.fn(),
      urlSearchParams: {},
    },
    filters: {
      tab: 'active',
    },
    applyFilters: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<ForgingDetails {...props} />);
  });

  it('renders a list of sorted forgers', () => {
    expect(wrapper.find('.next-forger').at(0)).toIncludeText('genesis_30');
  });

  it('renders the list in the same order independently of the sort direction', () => {
    props = {
      ...props,
      sorDirection: 'desc',
    };
    wrapper = mount(<ForgingDetails {...props} />);

    expect(wrapper.find('.next-forger').at(0)).toIncludeText('genesis_30');
  });

  it('shows the list of total forged', () => {
    expect(wrapper.find('.total-forged')).toIncludeText('89,900,000,000');
  });
});
