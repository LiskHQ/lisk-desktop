import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import accounts from '@tests/constants/wallets';
import { useSession } from '@libs/wcm/hooks/useSession';
import Status from '.';

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));
jest.mock('@libs/wcm/hooks/useSession');

describe('Sign Message: Status', () => {
  const proposal = {};
  const respond = jest.fn(() => ({
    status: 'SUCCESS',
    data: proposal,
  }));

  useSession.mockReturnValue({ respond });

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
    const wrapper = mount(<Status {...props} />);
    expect(wrapper.find('AutoResizeTextarea')).toExist();
  });

  it('Should handle copying result', () => {
    const props = {
      ...baseProps,
      error: null,
      signature: 'sample signature',
    };
    const wrapper = mount(<Status {...props} />);
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
    const wrapper = mount(<Status {...props} />);
    expect(wrapper.find('h3').text()).toMatch('Transaction aborted on device');
  });
});
