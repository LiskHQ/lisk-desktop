import { mountWithRouter } from 'src/utils/testHelpers';
import { DeviceDisconnectDialog } from './index';

describe('DeviceDisconnectModal', () => {
  it('renders properly', () => {
    const props = {
      t: (str, dict) => (dict ? str.replace('{{model}}', dict.model) : str),
      history: { push: jest.fn(), location: { search: '?model=Some Model' } },
    };
    const wrapper = mountWithRouter(DeviceDisconnectDialog, props);
    expect(wrapper).toBeDefined();
  });
});
