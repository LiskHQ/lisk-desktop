import React from 'react';
import { mount } from 'enzyme';
import Options from './options';
import DialogHolder from './holder';
import { PrimaryButton } from '../buttons';

jest.mock('./holder');

describe('Dialog.Options component', () => {
  it('Should render with single option, clicking option calls DialogHolder.hideDialog', () => {
    const wrapper = mount(
      <Options>
        <PrimaryButton>Option</PrimaryButton>
      </Options>,
    );
    expect(wrapper).toContainExactlyOneMatchingElement('button');
    wrapper.find('button').simulate('click');
    expect(DialogHolder.hideDialog).toBeCalled();
  });

  it('Should render multiple options calls DialogHolder.hideDialog even if onClick is set', () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <Options align="center">
        <PrimaryButton>Option</PrimaryButton>
        <PrimaryButton onClick={onClick}>Option2</PrimaryButton>
      </Options>,
    );
    expect(wrapper.find('div')).toHaveClassName('center');
    expect(wrapper).toContainMatchingElements(2, 'button');
    wrapper.find('button').last().simulate('click');
    expect(onClick).toBeCalled();
    expect(DialogHolder.hideDialog).toBeCalled();
  });
});
