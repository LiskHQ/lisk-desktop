import { mountWithRouter } from 'src/utils/testHelpers';
import { act } from 'react-dom/test-utils';
import accounts from '@tests/constants/wallets';
import Status from '.';

describe('Sign Message: Status', () => {
  const baseProps = {
    account: accounts.genesis,
    t: (str) => str,
    prevStep: jest.fn(),
  };

  it('should render the signature', () => {
    const props = {
      ...baseProps,
      error: null,
      signature: 'sample signature',
    };
    const wrapper = mountWithRouter(Status, props);
    expect(wrapper.find('AutoResizeTextarea')).toExist();
  });

  it('Should handle copying result', () => {
    const props = {
      ...baseProps,
      error: null,
      signature: 'sample signature',
    };
    const wrapper = mountWithRouter(Status, props);
    expect(wrapper).toContainMatchingElements(2, 'button');
    wrapper.find('button').at(1).simulate('click');
    expect(wrapper.find('button').at(1)).toBeDisabled();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    wrapper.update();
    expect(wrapper.find('button').at(1)).not.toBeDisabled();
    wrapper.unmount();
  });

  it('Should show error message', () => {
    const props = {
      ...baseProps,
      account: {
        ...baseProps.account,
        hwInfo: {
          deviceModel: 'trezor',
        },
      },
      error: 'some error',
      signature: undefined,
    };
    const wrapper = mountWithRouter(Status, props);
    expect(wrapper.find('h5').text()).toMatch('Transaction aborted on device');
  });
});
