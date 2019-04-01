import React from 'react';
import { mount } from 'enzyme';
import SearchBar from './searchBar';

describe('SearchBar', () => {
  let wrapper;

  const props = {
    t: v => v,
    history: {
      push: jest.fn(),
    },
    suggestions: {
      addresses: [],
      transactions: [],
      delegates: [],
    },
    searchSuggestions: jest.fn(),
    clearSearchSuggestions: jest.fn(),
    setSearchBarRef: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<SearchBar {...props} />);
  });

  it('should render properly SearchBar', () => {
    expect(wrapper).toContainMatchingElement('.search-bar');
    expect(wrapper).toContainMatchingElement('.search-input');
    expect(wrapper).toContainMatchingElement('.search-message');
    expect(wrapper).not.toContainMatchingElement('.loading');
  });

  it('should render accounts data properly based on user data input', () => {
    wrapper.find('.search-input').at(0).simulate('change', { target: { value: '123456L' } });
    jest.advanceTimersByTime(500);
    wrapper.update();
    expect(props.searchSuggestions).toBeCalled();

    wrapper.find('.search-input').at(0).simulate('change', { target: { value: '12' } });
    jest.advanceTimersByTime(500);
    wrapper.update();
    expect(props.clearSearchSuggestions).toBeCalled();
  });

  it('should redirect to a different page if user do a click on selected row for address', () => {
    wrapper.find('.search-input').at(0).simulate('change', { target: { value: '123456L' } });
    jest.advanceTimersByTime(500);
    wrapper.update();
    expect(props.searchSuggestions).toBeCalled();
    wrapper.setProps({
      suggestions: {
        ...props.suggestions,
        addresses: [
          {
            address: '123456L',
            title: 'John',
            balance: '120',
          },
        ],
      },
    });
    wrapper.find('.account-row').at(0).simulate('click');
    expect(props.history.push).toBeCalled();
    expect(props.clearSearchSuggestions).toBeCalled();
  });

  it('should redirect to a different page if user do a click on selected row for transaction', () => {
    wrapper.find('.search-input').at(0).simulate('change', { target: { value: '123456123234234' } });
    jest.advanceTimersByTime(500);
    wrapper.update();
    expect(props.searchSuggestions).toBeCalled();
    wrapper.setProps({
      suggestions: {
        ...props.suggestions,
        transactions: [
          {
            asset: {
              data: 'testing',
            },
            id: 123456123234234,
            type: 1,
          },
        ],
      },
    });
    wrapper.find('.transaction-row').at(0).simulate('click');
    expect(props.history.push).toBeCalled();
    expect(props.clearSearchSuggestions).toBeCalled();
  });
});
