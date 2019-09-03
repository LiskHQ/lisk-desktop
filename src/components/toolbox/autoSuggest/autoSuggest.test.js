import PropTypes from 'prop-types';
import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '../../../constants/tokens';
import AccountVisual from '../../accountVisual';
import AutoSuggest from './index';
import i18n from '../../../i18n';
import keyCodes from '../../../constants/keyCodes';

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
    onChangeDelayed: jest.fn(),
    onChange: jest.fn(),
    onSelectItem: jest.fn(),
    items: [{
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
    placeholder: 'e.g. 1234523423L or John Doe',
    selectedItem: {
      address: '',
      error: false,
      feedback: '',
      name: 'recipient',
      selected: false,
      title: '',
      value: '',
    },
    className: 'recipient',
    matchProps: ['address', 'title'],
    // eslint-disable-next-line react/display-name
    renderItem: item => (
      <React.Fragment>
        <AccountVisual address={item.address} size={25} />
        <span>{item.title}</span>
        <span>{item.address}</span>
      </React.Fragment>
    ),
  };

  beforeEach(() => {
    wrapper = mount(<AutoSuggest {...props} />, options);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.recipient');
    expect(wrapper).toContainMatchingElement('Input.input');
    expect(wrapper).toContainMatchingElement('Spinner.spinner');
    expect(wrapper).toContainMatchingElement('.bookmark-list');
  });

  it('should validate bookmark', () => {
    const evt = { target: { name: 'recipient', value: '123456L' } };
    wrapper.find('input.recipient').simulate('change', evt);
    wrapper.update();
    jest.advanceTimersByTime(300);
    expect(props.onChangeDelayed).toBeCalled();
  });

  it('render properly when bookmard is selected', () => {
    props.selectedItem.address = '12345L';
    props.selectedItem.title = 'John Cena';
    wrapper = mount(<AutoSuggest {...props} />, options);
    expect(wrapper).toContainMatchingElement('AccountVisual');
  });

  it('should select an account from the available list', () => {
    props.selectedItem.value = 'L';
    wrapper = mount(<AutoSuggest {...props} />, options);
    expect(wrapper).toContainMatchingElement('.bookmark-list');
    expect(wrapper).toContainMatchingElements(3, 'li');
    wrapper.find('Input.input input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    wrapper.find('Input.input input').simulate('keyDown', { keyCode: keyCodes.arrowUp });
    wrapper.find('Input.input input').simulate('keyDown', { keyCode: keyCodes.enter });
    wrapper.find('.bookmark-list li').at(0).simulate('click');
    expect(props.onSelectItem).toBeCalled();
  });
});
