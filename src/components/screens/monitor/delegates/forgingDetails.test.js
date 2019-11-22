import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';
import delegates from '../../../../../test/constants/delegates';
import ForgingDetails from './forgingDetails';

describe('Forging Details', () => {
  let wrapper;
  const props = {
    t: key => key,
    sortDirection: 'asc',
    networkStatus: {
      data: {
        supply: 9000000000000000000,
      },
    },
    nextForgers: delegates.map((delegate, i) => ({
      ...delegate,
      forgingTime: moment().add(i * 10, 'seconds'),
    })),
    filters: {
      tab: 'active',
    },
    applyFilters: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<ForgingDetails {...props} />);
  });

  it('renders a list of sorted forgers', () => {
    expect(wrapper.find('.next-forger').at(0)).toHaveText('genesis_3');
  });

  it('shows the list of total forged', () => {
    expect(wrapper.find('.total-forged')).toIncludeText('89,900,000,000');
  });
});
