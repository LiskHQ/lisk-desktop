import React from 'react';
import { mount } from 'enzyme';
import Delegates from './delegates';
import delegates from '../../../../../test/constants/delegates';

jest.mock('../../../../constants/monitor', () => ({ DEFAULT_LIMIT: 8 }));

describe('Delegates monitor page', () => {
  let props;
  let delegatesWithData;
  const name = '1234';

  const switchTab = (wrapper, tab) => {
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
        data: [],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
      filters: {
        tab: 'active',
      },
      applyFilters: jest.fn(),
    };

    delegatesWithData = {
      ...props.delegates,
      isLoading: false,
      data: delegates,
    };
  });

  it('renders a page with header', () => {
    const wrapper = mount(<Delegates {...props} />);
    expect(wrapper.find('Box header')).toIncludeText('Active delegates');
  });

  it('renders table with delegates', () => {
    const wrapper = mount(<Delegates {...props} />);
    expect(wrapper.find('.delegate-row')).toHaveLength(0);
    wrapper.setProps({ delegates: delegatesWithData });
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(delegates.length);
  });

  it('allows to switch to "Standby delegates" tab', () => {
    const wrapper = mount(<Delegates {...{ ...props }} />);
    expect(wrapper.find('.tab.standby')).not.toHaveClassName('active');
    switchTab(wrapper, 'standby');
    expect(wrapper.find('.tab.standby')).toHaveClassName('active');
  });

  it('shows error if API failed', () => {
    const error = 'Loading failed';
    const wrapper = mount(<Delegates {...props} />);
    wrapper.setProps({
      delegates: {
        ...props.delegates,
        isLoading: false,
        error,
      },
    });
    expect(wrapper).toIncludeText(error);
  });

  it('allows to filter delegates by name and clear the filter', () => {
    const wrapper = mount(<Delegates {...props} />);
    wrapper.find('input.filter-by-name').simulate('change', { target: { value: name } });
    expect(props.applyFilters).toHaveBeenCalledWith({ search: name, tab: props.filters.tab });
    wrapper.find('input.filter-by-name').simulate('change', { target: { value: '' } });
    expect(props.applyFilters).toHaveBeenCalledWith({ search: '', tab: props.filters.tab });
  });

  it('cannot load more active delegates', () => {
    const wrapper = mount(<Delegates {...{ ...props, delegates: delegatesWithData }} />);
    expect(wrapper.find('.tab.active')).toHaveClassName('active');
    expect(wrapper.find('button.loadMore')).toHaveLength(0);
  });

  it('allows to load more standby delegates', () => {
    const tab = 'standby';
    const wrapper = mount(<Delegates {...{ ...props, delegates: delegatesWithData }} />);
    switchTab(wrapper, tab);
    wrapper.find('button.loadMore').simulate('click');
    expect(props.delegates.loadData).toHaveBeenCalledWith({ offset: delegates.length, tab });
  });
});
