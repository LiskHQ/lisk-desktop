import React from 'react';
import { mount } from 'enzyme';
import SignMessageInput from '.';

describe('Sign Message Input Component', () => {
  const props = {
    history: {
      location: {
        search: '',
      },
      goBack: jest.fn(),
    },
    nextStep: jest.fn(),
    t: v => v,
  };

  const event = { target: { name: 'message', value: 'Any new value' } };
  const setup = data => mount(<SignMessageInput {...data} />);

  it('Should render with empty textarea and update when typed', () => {
    const wrapper = setup(props);
    expect(wrapper).toContainMatchingElement('textarea');
    expect(wrapper.find('textarea')).toHaveValue('');
    wrapper.find('textarea').simulate('change', event);
    expect(wrapper.find('textarea')).toHaveValue(event.target.value);
  });

  it('Should trigger navigation on button clicks', () => {
    const wrapper = setup(props);
    wrapper.find('textarea').simulate('change', event);
    wrapper.find('button').at(0).simulate('click');
    expect(props.nextStep).toHaveBeenCalledWith({ message: event.target.value });
  });

  it('Should fill the textarea with query params if any', () => {
    const newProps = { ...props };
    const preFilledMessage = 'Any message that come from query param';
    newProps.history.location.search = `?message=${preFilledMessage}`;
    const wrapper = setup(props);
    expect(wrapper.find('textarea')).toHaveValue(preFilledMessage);
  });
});
