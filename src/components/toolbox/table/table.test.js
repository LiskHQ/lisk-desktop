import React from 'react';
import { mount } from 'enzyme';
import Table from './index';
import accounts from '../../../../test/constants/accounts';

describe('Table', () => {
  describe('Loading', () => {
    const props = {
      data: [],
      canLoadMore: false,
      isLoading: true,
      row: () => <div />,
      header: [],
    };
    it('should render a loader if data is loading with default template', () => {
      const wrapper = mount(<Table {...props} />);
      expect(wrapper.find('Loading')).toHaveLength(1);
    });

    it('should render a loader if data is loading with default template', () => {
      props.loadingState = () => <div>custom_loading</div>;
      const wrapper = mount(<Table {...props} />);
      expect(wrapper).toHaveText('custom_loading');
    });
  });

  describe('Empty', () => {
    const props = {
      data: [],
      canLoadMore: false,
      isLoading: false,
      row: () => <div />,
      header: [],
    };
    it('should render an empty template if data is empty with default template', () => {
      const wrapper = mount(<Table {...props} />);
      expect(wrapper.find('Empty')).toHaveLength(1);
    });
    it('should render an empty template if data is empty with custom config', () => {
      props.emptyState = {
        message: 'custom_message',
        illustration: 'emptyBookmarksList',
      };
      const wrapper = mount(<Table {...props} />);
      expect(wrapper).toHaveText('custom_message');
    });
    it('should render an empty template if data is empty with custom template', () => {
      props.emptyState = () => <div>custom_empty_template</div>;
      const wrapper = mount(<Table {...props} />);
      expect(wrapper).toHaveText('custom_empty_template');
    });
  });

  describe('List', () => {
    const Row = ({ data }) => <div>{data.address}</div>;
    const props = {
      data: Object.keys(accounts).filter(key => key !== 'any account').map(key => accounts[key]),
      canLoadMore: false,
      isLoading: false,
      row: Row,
      header: [{
        title: 'Header Item',
        classList: 'header-item',
      }],
    };

    it('should render the data array in rows and use index for iteration key by default', () => {
      const wrapper = mount(<Table {...props} />);
      expect(wrapper.find('Row')).toHaveLength(props.data.length);
    });

    it('should render accept function to define iteration key', () => {
      const iterationKey = jest.fn().mockImplementation(data => data.address);
      mount(<Table {...props} iterationKey={iterationKey} />);
      expect(iterationKey.mock.calls.length).toBe(props.data.length);
    });

    it('should not crash when data is undefined', () => {
      const wrapper = mount(<Table {...props} data={undefined} />);
      expect(wrapper.find('.empty-state')).toHaveLength(1);
      expect(wrapper.find('Row')).toHaveLength(0);
    });
  });
});
