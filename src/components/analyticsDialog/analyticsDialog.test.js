import React from 'react';
import { mount } from 'enzyme';
import AnalyticsDialog from './analyticsDialog';
import FlashMessageHolder from '../toolbox/flashMessage/holder';

jest.mock('../toolbox/flashMessage/holder');
jest.mock('../toolbox/dialog/holder');

describe('Analytics dialog component', () => {
  const props = {
    settings: {
      statictics: false,
    },
    settingsUpdated: jest.fn(),
    toastDisplayed: jest.fn(),
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = mount(<AnalyticsDialog {...props} />);
  });

  it('Should render with Opt-in (Analytics) message and call FlashMessageHolder.deleteMessage on cancel click', () => {
    expect(wrapper).toIncludeText('Anonymous Data Collection');
    expect(wrapper).toIncludeText('Privacy Policy');
    wrapper.find('button').first().simulate('click');
    expect(FlashMessageHolder.deleteMessage).toBeCalledTimes(1);
  });

  it('Should render with Opt-in (Analytics) message and call FlashMessageHolder.deleteMessage on accept click', () => {
    wrapper.find('button').last().simulate('click');
    expect(FlashMessageHolder.deleteMessage).toBeCalledTimes(1);
    expect(props.settingsUpdated).toBeCalled();
    expect(props.toastDisplayed).toBeCalled();
  });
});
