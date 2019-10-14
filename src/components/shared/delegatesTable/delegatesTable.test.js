import React from 'react';
import { mount } from 'enzyme';
import DelegatesTable from '.';
import delegates from '../../../../test/constants/delegates';

describe('DelegatesTable page', () => {
  let props;
  let delegatesWitData;

  beforeEach(() => {
    props = {
      t: key => key,
      delegates: {
        isLoading: true,
        data: [],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      columns: [
        { id: 'rank' },
        { id: 'username', header: 'Name' },
        { id: 'rewards' },
        { id: 'productivity' },
      ],
      tabs: {
        tabs: [{ name: 'Active delegates' }, { name: 'Standby delegates' }],
      },
    };
    delegatesWitData = {
      ...props.blocks,
      isLoading: false,
      data: delegates,
    };
  });

  it('renders DelegatesTable with header tabs', () => {
    const wrapper = mount(<DelegatesTable {...props} />);
    expect(wrapper.find('header')).toIncludeText(props.tabs.tabs[0].name);
    expect(wrapper.find('header')).toIncludeText(props.tabs.tabs[1].name);
  });

  it('renders table with delegates', () => {
    const wrapper = mount(<DelegatesTable {...props} />);
    expect(wrapper.find('TableRow.row')).toHaveLength(0);
    wrapper.setProps({ delegates: delegatesWitData });
    expect(wrapper.find('TableRow.row')).toHaveLength(delegates.length + 1);
  });
});
