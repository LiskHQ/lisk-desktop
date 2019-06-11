import React from 'react';
import { mount } from 'enzyme';
import Onboarding from './onboarding';

describe('Onboarding component', () => {
  let props;

  beforeEach(() => {
    props = {
      slides: [{
        title: 'Title',
        content: 'content',
        illustration: 'test.svg',
      }],
      actionButtonLabel: 'cta label',
      finalCallback: jest.fn(),
      onClose: jest.fn(),
      name: 'onboaring name',
      className: '',
      t: v => v,
    };
    localStorage.removeItem(props.name);
  });

  it('Should render without bullet if only one slide and button call final Callback', () => {
    const wrapper = mount(<Onboarding {...props} />);
    expect(wrapper).toContainMatchingElement('.slides');
    expect(wrapper).not.toContainMatchingElement('.bullets');
    expect(wrapper.find('button').last()).toHaveText(props.actionButtonLabel);
    wrapper.find('button').last().simulate('click');
    expect(props.finalCallback).toBeCalled();
  });

  it('Should call onClose when clicking close button', () => {
    const wrapper = mount(<Onboarding {...props} />);
    wrapper.find('.closeBtn').simulate('click');
    expect(localStorage.getItem(props.name)).toBeTruthy();
  });

  it('Should render multiple slides and navigate between them', () => {
    const slides = [{
      title: 'Title',
      content: 'content',
      illustration: 'test.svg',
    }, {
      title: 'Title',
      content: 'content',
      illustration: 'test.svg',
    }];
    const newProps = {
      ...props,
      slides,
    };

    const wrapper = mount(<Onboarding {...newProps} />);
    expect(wrapper.find('.slides')).toContainMatchingElements(2, 'section');
    expect(wrapper.find('button').first()).not.toHaveText('Previous');
    expect(wrapper.find('button').last()).toHaveText('Next');
    wrapper.find('button').last().simulate('click');
    expect(wrapper.find('button').first()).toHaveText('Previous');
    expect(wrapper.find('button').first()).not.toBeDisabled();
    expect(wrapper.find('button').last()).toHaveText(props.actionButtonLabel);
    wrapper.find('button').first().simulate('click');
    expect(wrapper.find('button').first()).not.toHaveText('Previous');
    expect(wrapper.find('button').last()).toHaveText('Next');
    wrapper.find('button').last().simulate('click');
    wrapper.find('button').last().simulate('click');
    expect(props.finalCallback).toBeCalled();
  });

  it('Should not render if was closed before', () => {
    localStorage.setItem(props.name, true);
    const wrapper = mount(<Onboarding {...props} />);
    expect(wrapper).not.toContainMatchingElement('.onboarding');
  });
});
