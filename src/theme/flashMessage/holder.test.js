import React from 'react';
import { mount } from 'enzyme';
import FlashMessageHolder from './holder';
import FlashMessage from './flashMessage';

describe('Flash Message Holder', () => {
  let wrapper;
  const DummyMessage = <FlashMessage shouldShow>Dummy text</FlashMessage>;

  beforeEach(() => {
    wrapper = mount(<FlashMessageHolder />);
  });

  it('Should render FlashMessageHolder and add message when addMessage is called', () => {
    expect(wrapper).toBeEmptyRender();
    expect(FlashMessageHolder.addMessage(DummyMessage, 'testMessage')).toEqual(true);
    wrapper.update();
    expect(wrapper).toContainExactlyOneMatchingElement('FlashMessage');
  });

  it('Should dismiss message and remove from holder if closeBtn clicked', () => {
    FlashMessageHolder.addMessage(DummyMessage, 'testMessage2');
    FlashMessageHolder.addMessage(DummyMessage, 'testMessage');
    wrapper.update();
    wrapper.find('.closeBtn').at(0).simulate('click');
    wrapper.update();
    expect(wrapper).toContainExactlyOneMatchingElement('FlashMessage');
  });

  it('Should not render message with invalid React element', () => {
    expect(wrapper).toBeEmptyRender();
    expect(FlashMessageHolder.addMessage(jest.fn(), 'testMessage')).toBe(false);
    wrapper.update();
    expect(wrapper).toBeEmptyRender();
  });
});
