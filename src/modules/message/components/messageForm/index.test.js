import React from 'react';
import { mount } from 'enzyme';
import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import SignMessageInput from '.';

describe('Sign Message Input Component', () => {
  const props = {
    history: {
      location: {
        search: '',
      },
      goBack: jest.fn(),
    },
    nextStep: jest.fn(),
    t: (v) => v,
  };

  const event = { target: { name: 'message', value: 'Any new value' } };
  const setup = (data) => mount(<SignMessageInput {...data} />);

  it('Should render with empty textarea and update when typed', () => {
    const wrapper = setup(props);
    expect(wrapper).toContainMatchingElement('textarea');
    expect(wrapper.find('textarea')).toHaveValue('');
    wrapper.find('textarea').simulate('change', event);
    expect(wrapper.find('textarea')).toHaveValue(event.target.value);
  });

  it('Should trigger navigation on button clicks', () => {
    const wrapper = setup(props);
    wrapper.find('textarea').simulate('change', event);
    wrapper.find('button').at(0).simulate('click');
    expect(props.nextStep).toHaveBeenCalledWith({
      message: event.target.value,
      actionFunction: expect.any(Function),
    });
  });

  it('Should fill the textarea with query params if any', () => {
    const newProps = { ...props };
    const preFilledMessage = 'Any message that come from query param';
    newProps.history.location.search = `?message=${preFilledMessage}`;
    const wrapper = setup(props);
    expect(wrapper.find('textarea')).toHaveValue(preFilledMessage);
  });

  it('Should disable continue button when HW app is not open', () => {
    const store = {
      account: {
        current: {
          metadata: {
            isHW: true,
          },
        },
      },
      hardwareWallet: {
        devices: [],
        currentDevice: {
          manufacturer: '',
          path: '',
          product: '',
          status: 'standby',
          isAppOpen: false,
        },
        accounts: [],
        _persist: {
          version: -1,
          rehydrated: true,
        },
      },
    };
    const wrapper = mountWithRouterAndStore(SignMessageInput, props, {}, store);

    expect(wrapper.find('span[data-testid="hwError"]')).toHaveText(
      'Open the Lisk app on Ledger device to continue'
    );
    expect(wrapper.find('button').at(0)).toBeDisabled();
  });
});
