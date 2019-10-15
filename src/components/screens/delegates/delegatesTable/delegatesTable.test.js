import React from 'react';
import { mount } from 'enzyme';
import DelegatesTable from './delegatesTable';
import delegates from '../../../../../test/constants/delegates';
import voteFilters from '../../../../constants/voteFilters';

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
      filters: {
        tab: voteFilters.all,
        search: '',
      },
      applyFilters: jest.fn((filters) => { props.filters = filters; }),
    };
    delegatesWitData = {
      ...props.blocks,
      isLoading: false,
      data: delegates,
    };
  });

  it('renders DelegatesTable with header tabs', () => {
    const wrapper = mount(<DelegatesTable {...props} />);
    expect(wrapper.find('header')).toIncludeText('All delegates');
    expect(wrapper.find('header')).toIncludeText('Voted');
    expect(wrapper.find('header')).toIncludeText('Not voted');
  });

  it('renders table with delegates', () => {
    const wrapper = mount(<DelegatesTable {...props} />);
    expect(wrapper.find('TableRow.row')).toHaveLength(0);
    wrapper.setProps({ delegates: delegatesWitData });
    expect(wrapper.find('TableRow.row')).toHaveLength(delegates.length + 1);
  });

  it('allows to switch tabs', () => {
    const wrapper = mount(<DelegatesTable {...props} />);
    expect(wrapper.find('.tab.voted')).not.toHaveClassName('active');
    wrapper.find('.tab.voted').simulate('click');
    wrapper.setProps({ filters: props.filters });
    expect(wrapper.find('.tab.voted')).toHaveClassName('active');
    expect(props.applyFilters).toHaveBeenCalledWith({ tab: voteFilters.voted });
  });
});
