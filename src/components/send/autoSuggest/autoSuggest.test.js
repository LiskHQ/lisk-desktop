import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import keyCodes from '../../../constants/keyCodes';
import i18n from '../../../i18n';
import AutoSuggest from './index';
import { tokenMap } from '../../../constants/tokens';

describe('Recipient Input', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    token: tokenMap.LSK.key,
    t: v => v,
    validateBookmark: jest.fn(),
    onChange: jest.fn(),
    onSelectedAccount: jest.fn(),
    bookmarks: {
      LSK: [{
        title: 'ABC',
        address: '12345L',
      },
      {
        title: 'FRG',
        address: '12375L',
      },
      {
        title: 'KTG',
        address: '12395L',
      }],
      BTC: [],
    },
    placeholder: 'e.g. 1234523423L or John Doe',
    recipient: {
      address: '',
      balance: '',
      error: false,
      feedback: '',
      name: 'recipient',
      selected: false,
      title: '',
      value: '',
      showSuggestions: false,
    },
    showSuggestions: false,
  };

  beforeEach(() => {
    wrapper = mount(<AutoSuggest {...props} />, options);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.recipient');
    expect(wrapper).toContainMatchingElement('InputV2.input');
    expect(wrapper).toContainMatchingElement('Spinner.spinner');
    expect(wrapper).toContainMatchingElement('.bookmark-list');
  });

  it('should validate bookmark', () => {
    const evt = { target: { name: 'recipient', value: '123456L' } };
    wrapper.find('input.recipient').simulate('change', evt);
    wrapper.update();
    jest.advanceTimersByTime(300);
    expect(props.validateBookmark).toBeCalled();
  });

  it('render properly when bookmard is selected', () => {
    props.recipient.address = '12345L';
    props.recipient.title = 'John Cena';
    props.recipient.balance = '10';
    wrapper = mount(<AutoSuggest {...props} />, options);
    expect(wrapper).toContainMatchingElement('AccountVisual');
  });

  it('should select an account from the available list', () => {
    props.showSuggestions = true;
    props.recipient.value = 'L';
    wrapper = mount(<AutoSuggest {...props} />, options);
    expect(wrapper).toContainMatchingElement('.bookmark-list');
    expect(wrapper).toContainMatchingElements(3, 'li');
    wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.arrowUp });
    wrapper.find('InputV2.input').simulate('keyDown', { keyCode: keyCodes.enter });
    wrapper.find('.bookmark-list li').at(0).simulate('click');
    expect(props.onSelectedAccount).toBeCalled();
  });
});
