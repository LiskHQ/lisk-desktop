import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import InfoBanner from './infoBanner';

window.open = jest.fn();

describe('InfoBanner component', () => {
  const props = {
    name: 'info banner name',
    infoLabel: 'update',
    infoMessage: 'info banner message',
    infoLink: 'https://lisk.io',
    className: '',
    show: true,
    t: (v) => v,
  };

  const store = configureStore()({ wallet: { passphrase: 'test' } });
  const mountWithProps = (extraProps = {}) => {
    // eslint-disable-next-line prefer-object-spread
    const mergedProps = Object.assign({}, props, extraProps);
    return mount(
      <Provider store={store}>
        <InfoBanner {...mergedProps} />
      </Provider>
    );
  };

  beforeEach(() => {
    localStorage.removeItem(props.name);
  });

  it('Should render properly when called with props', () => {
    const wrapper = mountWithProps();
    expect(wrapper).toContainMatchingElement('.slides');
    expect(wrapper.find('h1')).toHaveText(props.infoMessage);
  });

  it('should open infoLink in a new tab when clicked', () => {
    const wrapper = mountWithProps();
    wrapper.find('.link').first().simulate('click');
    expect(window.open).toHaveBeenCalledWith('https://lisk.io');
  });

  it('Should call onClose when clicking close button', () => {
    const wrapper = mountWithProps();
    wrapper.find('.closeBanner').simulate('click');
    expect(localStorage.getItem(props.name)).toBeTruthy();
  });

  it('Should not render if it has been closed', () => {
    localStorage.setItem(props.name, true);
    const wrapper = mountWithProps();
    expect(wrapper).not.toContainMatchingElement('.infoBanner');
  });
});
