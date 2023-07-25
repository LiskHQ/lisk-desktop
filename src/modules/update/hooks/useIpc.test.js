import { act, renderHook } from '@testing-library/react-hooks';
import { mountWithRouter } from 'src/utils/testHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { appUpdateAvailable } from 'src/redux/actions';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { IPC_UPDATE_AVAILABLE, IPC_UPDATE_STARTED } from 'src/const/ipcGlobal';
import useIpc from './useIpc';

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));
jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
  client: {
    pair: jest.fn(),
  },
}));

const mockHistory = {
  push: jest.fn(),
  location: { search: '', pathname: '' },
};

const mockDispatch = jest.fn();
useDispatch.mockReturnValue(mockDispatch);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('useIpc', () => {
  const callbacks = {};
  const ipc = {
    [IPC_UPDATE_AVAILABLE]: (callback) => {
      callbacks[IPC_UPDATE_AVAILABLE] = callback;
    },
    [IPC_UPDATE_STARTED]: jest.fn(),
  };
  const version = '1.20.1';
  const releaseNotes = '<h4>dummy text</h4><h3>Fixed bugs</h3>';
  const mockAppState = {
    account: {
      current: mockSavedAccounts[0],
    },
    token: {
      active: 'LSK',
    },
    wallet: {
      info: {
        LSK: 'some data',
      },
    },
    network: {
      name: 'testnet',
      serviceUrl: 'someUrl',
    },
    staking: {},
  };

  beforeEach(() => {
    ipc[IPC_UPDATE_STARTED].mockClear();
    mockHistory.push.mockClear();
    mockDispatch.mockClear();
    window.ipc = ipc;
    useSelector.mockImplementation((callback) => callback(mockAppState));
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

  it('Should call render FlashMessage correctly and dispatch appUpdateAvailable when ipc receives IPC_UPDATE_AVAILABLE', () => {
    renderHook(() => useIpc(mockHistory));
    const spy = jest.spyOn(FlashMessageHolder, 'addMessage');
    const wrapper = mountWithRouter(FlashMessageHolder);

    expect(wrapper).toBeEmptyRender();

    callbacks[IPC_UPDATE_AVAILABLE]({}, { version, releaseNotes });
    wrapper.update();

    expect(spy).toHaveBeenCalledWith(expect.anything(), 'NewRelease');
    expect(wrapper).toIncludeText(`Lisk ${version} is out. dummy text`);
    expect(wrapper.find('.read-more').at(0)).toHaveText('Read more');
    expect(wrapper.find('.update-now').at(0)).toHaveText('Update now');
    expect(mockDispatch).toHaveBeenCalledWith(
      appUpdateAvailable({
        releaseNotes,
        version,
        remindMeLater: expect.any(Function),
        updateNow: expect.any(Function),
      })
    );
  });

  it('Should call to open modal when readMore is clicked', () => {
    renderHook(() => useIpc(mockHistory));
    const wrapper = mountWithRouter(FlashMessageHolder);

    callbacks[IPC_UPDATE_AVAILABLE]({}, { version, releaseNotes });
    wrapper.update();

    wrapper.find('button.read-more').simulate('click');
    expect(mockHistory.push).toBeCalledWith('?modal=newRelease');
  });

  it('Should call FlashMessageHolder.deleteMessage and send IPC_UPDATE_STARTED through ipc on updateNow click', () => {
    renderHook(() => useIpc(mockHistory));
    const spy = jest.spyOn(FlashMessageHolder, 'deleteMessage');
    const wrapper = mountWithRouter(FlashMessageHolder);

    callbacks[IPC_UPDATE_AVAILABLE]({}, { version, releaseNotes });
    wrapper.update();
    wrapper.find('button.update-now').simulate('click');
    jest.runOnlyPendingTimers();

    expect(ipc[IPC_UPDATE_STARTED]).toHaveBeenCalledWith();
    expect(spy).toHaveBeenCalledWith('NewRelease');
  });

  it('Should call FlashMessageHolder.deleteMessage and remove modal when remindMeLater is triggered', () => {
    renderHook(() => useIpc(mockHistory));
    const spy = jest.spyOn(FlashMessageHolder, 'deleteMessage');
    const wrapper = mountWithRouter(FlashMessageHolder);

    callbacks[IPC_UPDATE_AVAILABLE]({}, { version, releaseNotes });
    wrapper.update();
    mockDispatch.mock.calls[0][0].data.remindMeLater();

    expect(spy).toHaveBeenCalledWith('NewRelease');
    expect(mockHistory.push).toBeCalledWith('');
  });
});
