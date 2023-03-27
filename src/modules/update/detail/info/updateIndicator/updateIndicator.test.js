import React from 'react';
import { mount } from 'enzyme';
import UpdateIndicator from './index';

describe('UpdateIndicator', () => {
  let wrapper;
  const props = {
    t: (t) => t,
    closeToast: jest.fn(),
  };

  beforeEach(() => {});

  it('should render progress and has close icon', () => {
    wrapper = mount(<UpdateIndicator {...props} tranferred={50} total={100} />);
    const html = wrapper.html();
    wrapper.find('.close-update-indicator-icon').first().simulate('click');

    expect(html).toContain('Loading in progress');
    expect(props.closeToast).toHaveBeenCalled();
  });

  it('should render completed and call quitAndInstall', () => {
    const quitAndInstall = jest.fn();
    wrapper = mount(<UpdateIndicator {...props} completed quitAndInstall={quitAndInstall} />);
    const html = wrapper.html();
    wrapper.find('.quit-to-install-btn').first().simulate('click');

    expect(html).toContain('Download completed');
    expect(quitAndInstall).toHaveBeenCalled();
  });
});
