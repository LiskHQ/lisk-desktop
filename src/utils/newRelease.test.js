import React from 'react';
import { mount } from 'enzyme';
import { toast } from 'react-toastify';
import newReleaseUtil from './newRelease';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import DialogHolder from '../components/toolbox/dialog/holder';

jest.mock('../store');

describe('new release util', () => {
  const callbacks = {};
  const ipc = {
    on: jest.fn((event, callback) => { callbacks[event] = callback; }),
    send: jest.fn(),
  };

  beforeEach(() => {
    ipc.send.mockClear();
    window.ipc = ipc;
  });

  afterEach(() => {
    delete window.ipc;
  });

  it('Should return undefined if no ipc on window', () => {
    delete window.ipc;
    expect(newReleaseUtil.init()).toEqual(undefined);
  });

  it('Should fire success toaster when ipc receives update:downloading', () => {
    jest.spyOn(toast, 'success');
    const expectedAction = { label: 'Download started!' };
    newReleaseUtil.init();
    callbacks['update:downloading']({}, expectedAction);
    expect(toast.success).toBeCalledWith('Download started!');
  });

  it('Should call FlashMessageHolder.addMessage when ipc receives update:available', () => {
    const wrapper = mount(<FlashMessageHolder />);
    const dialogWrapper = mount(<DialogHolder />);
    const version = '1.20.1';
    const releaseNotes = '<h4>dummy text</h4><h3>Fixed bugs</h3>';
    expect(wrapper).toBeEmptyRender();
    expect(dialogWrapper).toBeEmptyRender();
    newReleaseUtil.init();
    expect(ipc.on).toHaveBeenCalled();
    callbacks['update:available']({}, { version, releaseNotes });
    wrapper.update();
    expect(wrapper).toIncludeText('dummy text');
    wrapper.find('button').at(1).simulate('click');
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('dummy text');
  });

  it('Should initiate the update process if clicked on updateNow', () => {
    const spy = jest.spyOn(FlashMessageHolder, 'deleteMessage');
    const wrapper = mount(<FlashMessageHolder />);
    const dialogWrapper = mount(<DialogHolder />);
    const version = '1.20.1';
    const releaseNotes = '<h4>dummy text</h4><h3>Fixed bugs</h3>';
    callbacks['update:available']({}, { version, releaseNotes });
    wrapper.update();
    wrapper.find('button').at(0).simulate('click');
    jest.runAllTimers();
    dialogWrapper.update();
    expect(ipc.send).toHaveBeenCalledWith('update:started');
    expect(spy).toHaveBeenCalledWith('NewRelease');
  });
});
