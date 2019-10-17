import React from 'react';
import { mount } from 'enzyme';
import Delegates from './delegates';
import delegates from '../../../../../test/constants/delegates';

jest.mock('../../../../constants/monitor', () => ({ DEFAULT_LIMIT: 6 }));

describe('Delegates monitor page', () => {
  let props;
  let delegatesWithData;
  const name = '1234';

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
      applyFilters: jest.fn((filters) => { props.filters = filters; }),
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
    wrapper.find('.tab.standby').simulate('click');
    expect(props.applyFilters).toHaveBeenCalledWith({ tab: 'standby' });
    wrapper.setProps(props);
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
});
