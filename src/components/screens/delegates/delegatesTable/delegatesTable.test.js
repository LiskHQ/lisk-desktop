import React from 'react';
import { mount } from 'enzyme';
import DelegatesTable from './delegatesTable';
import accounts from '../../../../../test/constants/accounts';
import delegates from '../../../../../test/constants/delegates';

describe('DelegatesTable page', () => {
  let props;

  beforeEach(() => {
    props = {
      t: key => key,
      delegates: [],
      loadDelegates: jest.fn(({ callback }) => callback()),
      votes: {},
      loadVotes: jest.fn(),
      account: accounts.genesis,
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
    wrapper.setProps({ delegates });
    expect(wrapper.find('TableRow.row')).toHaveLength(delegates.length + 1);
  });

  it('allows to switch tabs', () => {
    const wrapper = mount(<DelegatesTable {...{ ...props, delegates }} />);
    expect(wrapper.find('.tab.voted')).not.toHaveClassName('active');
    wrapper.find('.tab.voted').simulate('click');
    expect(wrapper.find('.tab.voted')).toHaveClassName('active');
  });

  it('allows to load more delegates', () => {
    const wrapper = mount(<DelegatesTable {...{ ...props, delegates }} />);
    wrapper.find('button.loadMore').simulate('click');
    expect(props.loadDelegates).toHaveBeenCalledWith(
      expect.objectContaining({ offset: delegates.length }),
    );
  });
});
