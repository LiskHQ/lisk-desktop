import React from 'react';
import { mount } from 'enzyme';
import withData from './withData';

describe('withData', () => {
  const className = 'dummy';
  const DummyComponent = () => <span className={className} />;

  it.skip('should render passed component', () => {
    const DummyComponentHOC = withData()(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />);
    expect(wrapper).toContainMatchingElement(`.${className}`);
  });

  it.skip('should render passed component with data', () => {
    const data = [];
    const params = {};
    const apis = {
      dataKey: {
        apiUtil: jest.fn(() => Promise.resolve(data)),
        getApiParams: () => (params),
        autoload: true,
      },
    };
    const DummyComponentHOC = withData(apis)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />);
    expect(apis.dataKey.apiUtil).toHaveBeenCalledWith(expect.objectContaining({}), params);
    // TODO figure out how to make the commented-out assertion work
    expect(wrapper.find('DummyComponent')).toHaveProp(Object.keys(apis)[0]);
    /*
    expect(wrapper.find('DummyComponent')).toHaveProp(Object.keys(apis)[0], {
      data,
      isLoading: false,
      error: '',
    });
    */
  });

  it.skip('should render passed component with error', () => {
    const error = 'Some error';
    const apis = {
      dataKey: {
        apiUtil: jest.fn(() => Promise.reject(error)),
        getApiParams: () => ({}),
        autoload: true,
      },
    };
    const DummyComponentHOC = withData(apis)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />);
    // TODO figure out how to make the commented-out assertion work
    expect(wrapper.find('DummyComponent')).toHaveProp(Object.keys(apis)[0]);
    /*
    expect(wrapper.find('DummyComponent')).toHaveProp(Object.keys(apis)[0], {
      data: [],
      isLoading: false,
      error,
    });
    */
  });

  it.skip('should work with two or more apis', () => {
    const data = [];
    const apis = {
      dataKey: {
        apiUtil: jest.fn().mockResolvedValue(data),
        autoload: true,
      },
      dataKey2: {
        apiUtil: jest.fn().mockRejectedValue(data),
        autoload: true,
      },
    };
    const DummyComponentHOC = withData(apis)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />);
    expect(wrapper.find('DummyComponent')).toHaveProp(Object.keys(apis)[0]);
    expect(wrapper.find('DummyComponent')).toHaveProp(Object.keys(apis)[1]);
  });

  it.skip('should allow to loadData from passed component', () => {
    const data = [];
    const apis = {
      dataKey: {
        apiUtil: jest.fn(() => Promise.resolve(data)),
        getApiParams: () => ({}),
        autoload: false,
      },
    };
    const DummyComponentHOC = withData(apis)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />);
    // TODO figure out how to make the commented-out assertion work
    expect(wrapper.find('DummyComponent')).toHaveProp(Object.keys(apis)[0]);
    /*
    expect(wrapper.find('DummyComponent')).toHaveProp(Object.keys(apis)[0], {
      data,
      isLoading: false,
      error: '',
    });
    */
  });
});
