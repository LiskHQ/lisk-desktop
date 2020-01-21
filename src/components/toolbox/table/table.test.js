import React from 'react';
import { mount } from 'enzyme';
import Table from './index';

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
});
