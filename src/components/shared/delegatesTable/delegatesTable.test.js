import React from 'react';
import { mount } from 'enzyme';
import DelegatesTable from '.';

describe('DelegatesTable page', () => {
  let props;

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
        { id: 'rank', header: 'Rank' },
        { id: 'name', header: 'Name' },
      ],
      tabs: [{ name: 'Active delegates' }, { name: 'Standby delegates' }],
    };
  });

  it('renders DelegatesTable with header tabs', () => {
    const wrapper = mount(<DelegatesTable {...props} />);
    expect(wrapper.find('header')).toIncludeText(props.tabs[0].name);
    expect(wrapper.find('header')).toIncludeText(props.tabs[1].name);
  });
});
