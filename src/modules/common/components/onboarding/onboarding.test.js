import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import Onboarding from './onboarding';

describe('Onboarding component', () => {
  const props = {
    slides: [
      {
        title: 'Title',
        content: 'content',
        illustration: 'test.svg',
      },
    ],
    actionButtonLabel: 'cta label',
    finalCallback: jest.fn(),
    onClose: jest.fn(),
    name: 'onboaring name',
    className: '',
    t: (v) => v,
  };
  const store = configureStore()({ wallet: { passphrase: 'test' } });
  const mountWithProps = (extraProps = {}) => {
    // eslint-disable-next-line prefer-object-spread
    const mergedProps = Object.assign({}, props, extraProps);
    return mount(
      <Provider store={store}>
        <Onboarding {...mergedProps} />
      </Provider>
    );
  };

  beforeEach(() => {
    localStorage.removeItem(props.name);
  });

  it('Should render without bullet if only one slide and button call final Callback', () => {
    const wrapper = mountWithProps();
    expect(wrapper).toContainMatchingElement('.slides');
    expect(wrapper).not.toContainMatchingElement('.bullets');
    expect(wrapper.find('button').last()).toHaveText(props.actionButtonLabel);
    wrapper.find('button').last().simulate('click');
    expect(props.finalCallback).toBeCalled();
  });

  it('Should call onClose when clicking close button', () => {
    const wrapper = mountWithProps();
    wrapper.find('.closeOnboarding').simulate('click');
    expect(localStorage.getItem(props.name)).toBeTruthy();
  });

  it('Should render multiple slides and navigate between them', () => {
    const slides = [
      {
        title: 'Title',
        content: 'content',
        illustration: 'test.svg',
      },
      {
        title: 'Title',
        content: 'content',
        illustration: 'test.svg',
      },
    ];

    const wrapper = mountWithProps({ slides });
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
    const wrapper = mountWithProps();
    expect(wrapper).not.toContainMatchingElement('.onboarding');
  });
});
