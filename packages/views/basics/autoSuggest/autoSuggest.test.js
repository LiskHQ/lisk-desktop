import React from 'react';
import { mount } from 'enzyme';
import { keyCodes } from '@common/configuration';
import { tokenMap } from '@token/configuration/tokens';
import AccountVisual from '../accountVisual';
import AutoSuggest from './index';

describe('Recipient Input', () => {
  let wrapper;

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
      <>
        <AccountVisual address={item.address} size={25} />
        <span>{item.title}</span>
        <span>{item.address}</span>
      </>
    ),
  };

  beforeEach(() => {
    wrapper = mount(<AutoSuggest {...props} />);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.recipient');
    expect(wrapper).toContainMatchingElement('Input.input');
    expect(wrapper).toContainMatchingElement('.bookmark-list');
  });

  it('should validate bookmark', () => {
    const evt = { target: { name: 'recipient', value: '123456L' } };
    wrapper.find('input.recipient').simulate('focus');
    wrapper.find('input.recipient').simulate('change', evt);
    wrapper.update();
    jest.advanceTimersByTime(300);
    expect(props.onChangeDelayed).toBeCalled();
  });

  it('render properly when bookmard is selected', () => {
    props.selectedItem.address = '12345L';
    props.selectedItem.title = 'John Cena';
    wrapper = mount(<AutoSuggest {...props} />);
    expect(wrapper).toContainMatchingElement('AccountVisual');
  });

  it('should select an account from the available list', () => {
    props.selectedItem.value = 'L';
    wrapper = mount(<AutoSuggest {...props} />);
    expect(wrapper).toContainMatchingElement('.bookmark-list');
    expect(wrapper).toContainMatchingElements(3, 'li');
    wrapper.find('Input.input input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    wrapper.find('Input.input input').simulate('keyDown', { keyCode: keyCodes.arrowUp });
    wrapper.find('Input.input input').simulate('keyDown', { keyCode: keyCodes.enter });
    wrapper.find('.bookmark-list li').at(0).simulate('click');
    expect(props.onSelectItem).toBeCalled();
    wrapper.find('input.recipient').simulate('blur');
  });

  it('should show error message if value is wrong and then remove it when value is correct', () => {
    const wrongValue = { target: { name: 'recipient', value: 'HHH' } };
    const correctValue = { target: { name: 'recipient', value: 'FRG' } };
    wrapper = mount(<AutoSuggest {...props} />);
    wrapper.find('input.recipient').simulate('focus');
    wrapper.find('input.recipient').simulate('change', wrongValue);
    wrapper.setProps({
      selectedItem: {
        ...props.selectedItem,
        error: true,
        feedback: 'wrong value',
      },
    });
    wrapper.find('input.recipient').simulate('blur');
    expect(wrapper.find('.feedback').text()).toEqual('wrong value');

    wrapper.find('input.recipient').simulate('focus');
    wrapper.find('input.recipient').simulate('change', correctValue);
    wrapper.setProps({
      selectedItem: {
        ...props.selectedItem,
        error: false,
        feedback: '',
      },
    });
    wrapper.find('input.recipient').simulate('blur');
    expect(wrapper.find('.feedback').text()).toEqual('');
  });
});
