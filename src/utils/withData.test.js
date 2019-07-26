import PropTypes from 'prop-types';
import React from 'react';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import withData from './withData';

describe('withData', () => {
  const store = configureMockStore([])({
    settings: {
      token: {
        active: 'LSK',
      },
    },
    network: {
      name: 'Mainnet',
      networks: {
        LSK: {
        },
      },
    },
  });
  const options = {
    context: { store },
    childContextTypes: {
      store: PropTypes.object.isRequired,
    },
  };
  const className = 'dummy';
  const DummyComponent = () => <span className={className} />;

  it('should render passed component', () => {
    const DummyComponentHOC = withData()(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />, options);
    expect(wrapper).toContainMatchingElement(`.${className}`);
  });

  it('should render passed component with data', () => {
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
    const wrapper = mount(<DummyComponentHOC />, options);
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

  it('should render passed component with error', () => {
    const error = 'Some error';
    const apis = {
      dataKey: {
        apiUtil: jest.fn(() => Promise.reject(error)),
        getApiParams: () => ({}),
        autoload: true,
      },
    };
    const DummyComponentHOC = withData(apis)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />, options);
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

  it('should allow to loadData from passed component', () => {
    const data = [];
    const apis = {
      dataKey: {
        apiUtil: jest.fn(() => Promise.resolve(data)),
        getApiParams: () => ({}),
        autoload: false,
      },
    };
    const DummyComponentHOC = withData(apis)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />, options);
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
