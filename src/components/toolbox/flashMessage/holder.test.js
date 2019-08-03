import React from 'react';
import { mount } from 'enzyme';
import FlashMessageHolder from './holder';
import FlashMessage from './flashMessage';

describe('Flash Message Holder', () => {
  const wrapper = mount(<FlashMessageHolder />);

  it('Should render FlashMessageHolder and add message when addMessage is called', () => {
    expect(wrapper).toBeEmptyRender();
    expect(FlashMessageHolder.addMessage((
      <FlashMessage shouldShow>
        Dummy text
      </FlashMessage>
    ), 'testMessage')).toEqual(true);
    wrapper.update();
    expect(wrapper).toContainMatchingElements(1, 'FlashMessage');
  });

  it('Should dismiss message and remove from holder if closeBtn clicked', () => {
    wrapper.find('.closeBtn').simulate('click');
    wrapper.update();
    expect(wrapper).not.toContainMatchingElement('FlashMessage');
  });
});
