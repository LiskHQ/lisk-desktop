import newReleaseUtil from './newRelease';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';

jest.mock('../components/toolbox/flashMessage/holder');

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

  it('Should return undefined if no ipc on window', () => {
    delete window.ipc;
    expect(newReleaseUtil.init()).toEqual(undefined);
  });

  it('Should call FlashMessageHolder.addMessage when ipc receives update:available', () => {
    newReleaseUtil.init();
    const version = '1.20.1';
    const releaseNotes = 'dummy text';
    expect(ipc.on).toHaveBeenCalled();
    callbacks['update:available']({}, { version, releaseNotes });
    expect(FlashMessageHolder.addMessage).toHaveBeenCalled();
  });
});
