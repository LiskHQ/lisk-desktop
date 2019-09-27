import React from 'react';
import { mount } from 'enzyme';
import DialogHolder from '../../../../toolbox/dialog/holder';
import Renderer from './renderer';

describe('Auto logout renderer component', () => {
  const props = {
    t: v => v,
    resetTimer: jest.fn(),
    minutes: '1',
    seconds: '0',
  };
  let wrapper;
  let dialogWrapper;

  beforeEach(() => {
    wrapper = mount(<Renderer {...props} />);
    dialogWrapper = mount(<DialogHolder />);
  });

  it('Should render empty component', () => {
    expect(wrapper).toBeEmptyRender();
  });

  it('Should render "Timeout soon" dialog if minutes = 0 and seconds = 59', () => {
    wrapper.setProps({
      minutes: '0',
      seconds: '59',
    });
    wrapper.update();
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('Timeout soon');
  });

  it('Should render "Session timeout" dialog if minutes = 0 and seconds = 1', () => {
    wrapper.setProps({
      minutes: '0',
      seconds: '1',
    });
    wrapper.update();
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('Session timeout');
  });
});
