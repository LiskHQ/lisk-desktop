import React from 'react';
import { mount } from 'enzyme';
import keyCodes from './../../constants/keyCodes';
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
    onSearchClick: jest.fn(),
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
    wrapper.find('.search-transaction-row').at(0).simulate('click');
    expect(props.history.push).toBeCalled();
    expect(props.clearSearchSuggestions).toBeCalled();
  });

  it('should redirect to a delegate page if user do a click on selected row for delegates', () => {
    wrapper.find('.search-input').at(0).simulate('change', { target: { value: 'genesis' } });
    jest.advanceTimersByTime(500);
    wrapper.update();
    expect(props.searchSuggestions).toBeCalled();
    wrapper.setProps({
      suggestions: {
        ...props.suggestions,
        delegates: [
          {
            account: {
              address: '123456L',
            },
            username: 'genesis_10',
            rank: 34,
            rewards: 23423,
            vote: 123,
          },
          {
            account: {
              address: '123457L',
            },
            username: 'genesis_101',
            rank: 26,
            rewards: 23421,
            vote: 127,
          },
        ],
      },
    });

    wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.arrowUp });
    wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.enter });
    expect(props.clearSearchSuggestions).toBeCalled();
    expect(props.onSearchClick).toBeCalled();
  });
});
