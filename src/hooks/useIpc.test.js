import { renderHook, act } from '@testing-library/react-hooks';
import { mountWithRouter } from '@utils/testHelpers';
import { useDispatch } from 'react-redux';
import { appUpdateAvailable } from '@actions';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import DialogHolder from '../components/toolbox/dialog/holder';
import useIpc from './useIpc';

jest.mock('@store');

const mockHistory = {
  push: jest.fn(), location: { search: '', pathname: '' },
};

const mockDispatch = jest.fn();
useDispatch.mockReturnValue(mockDispatch);

describe('useIpc', () => {
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
    const { result, rerender } = renderHook(() => useIpc(mockHistory));
    act(() => {
      delete window.ipc;
    });
    rerender();

    expect(result.current).toBe(undefined);
  });

  it('Should call FlashMessageHolder.addMessage when ipc receives update:available', () => {
    renderHook(() => useIpc(mockHistory));
    const wrapper = mountWithRouter(FlashMessageHolder);
    const dialogWrapper = mountWithRouter(DialogHolder);
    const version = '1.20.1';
    const releaseNotes = '<h4>dummy text</h4><h3>Fixed bugs</h3>';

    expect(wrapper).toBeEmptyRender();
    expect(dialogWrapper).toBeEmptyRender();
    expect(ipc.on).toHaveBeenCalled();

    callbacks['update:available']({}, { version, releaseNotes });
    wrapper.update();
    expect(wrapper).toIncludeText('dummy text');
    expect(mockDispatch).toHaveBeenCalledWith(appUpdateAvailable({
      releaseNotes,
      version,
      remindMeLater: expect.any(Function),
      updateNow: expect.any(Function),
    }));

    wrapper.find('button.read-more').simulate('click');
    expect(mockHistory.push).toBeCalledWith('?modal=newRelease');
  });

  it('Should initiate the update process if clicked on updateNow', () => {
    renderHook(() => useIpc(mockHistory));
    const spy = jest.spyOn(FlashMessageHolder, 'deleteMessage');
    const wrapper = mountWithRouter(FlashMessageHolder);
    const dialogWrapper = mountWithRouter(DialogHolder);
    const version = '1.20.1';
    const releaseNotes = '<h4>dummy text</h4><h3>Fixed bugs</h3>';
    callbacks['update:available']({}, { version, releaseNotes });
    wrapper.update();
    wrapper.find('button.update-now').simulate('click');
    jest.runAllTimers();
    dialogWrapper.update();

    expect(ipc.send).toHaveBeenCalledWith('update:started');
    expect(spy).toHaveBeenCalledWith('NewRelease');
  });
});
