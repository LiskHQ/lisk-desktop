import React from 'react';
import { mount } from 'enzyme';
import Delegates from './delegates';
import delegates from '../../../../../test/constants/delegates';

const transformToLiskServiceFormat = ({ account, ...delegate }) => ({
  ...delegate,
  ...account,
});
const delegatesApiResponse = delegates.map(transformToLiskServiceFormat);

jest.mock('../../../../constants/monitor', () => ({ DEFAULT_LIMIT: 8 }));

describe('Delegates monitor page', () => {
  let props;
  let delegatesWithData;
  let wrapper;
  const name = '1234';
  const setup = properties => mount(<Delegates {...properties} />);

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
      data: delegatesApiResponse,
    };
    wrapper = setup(props);
  });

  it('renders a page with header', () => {
    expect(wrapper.find('BoxHeader.delegates-table')).toIncludeText('Active delegates');
  });

  it('renders table with delegates', () => {
    expect(wrapper.find('.delegate-row')).toHaveLength(0);
    wrapper.setProps({ delegates: delegatesWithData });
    expect(wrapper.find('.delegate-row').hostNodes()).toHaveLength(delegatesApiResponse.length);
  });

  it('allows to switch to "Standby delegates" tab', () => {
    expect(wrapper.find('.tab.standby')).not.toHaveClassName('active');
    switchTab('standby');
    expect(wrapper.find('.tab.standby')).toHaveClassName('active');
  });

  it('shows error if API failed', () => {
    const error = 'Loading failed';
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
    wrapper.find('input.filter-by-name').simulate('change', { target: { value: name } });
    expect(props.applyFilters).toHaveBeenCalledWith({ search: name, tab: props.filters.tab });
    wrapper.find('input.filter-by-name').simulate('change', { target: { value: '' } });
    expect(props.applyFilters).toHaveBeenCalledWith({ search: '', tab: props.filters.tab });
  });

  it('cannot load more active delegates', () => {
    wrapper = setup({ ...props, delegates: delegatesWithData });
    expect(wrapper.find('.tab.active')).toHaveClassName('active');
    expect(wrapper.find('button.loadMore')).toHaveLength(0);
  });

  it('allows to load more standby delegates', () => {
    const tab = 'standby';
    wrapper = setup({ ...props, delegates: delegatesWithData });
    switchTab(tab);
    wrapper.find('button.loadMore').simulate('click');
    expect(props.delegates.loadData).toHaveBeenCalledWith({
      offset: delegatesApiResponse.length, tab,
    });
  });
});
