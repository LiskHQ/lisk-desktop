import React from 'react';
import { mount } from 'enzyme';
import InitializationMessage from './initializationMessage';

describe('InitializationMessage', () => {
  let wrapper;
  const props = {
    account: {
      info: {
        LSK: {
          balance: 1,
          serverPublicKey: '',
        },
      },
    },
    pendingTransactions: [],
    settings: {
      token: {
        active: 'LSK',
      },
    },
    history: {
      push: jest.fn(),
    },
    t: k => k,
  };

  beforeEach(() => {
    wrapper = mount(<InitializationMessage {...props} />);
  });

  it('should show the message component if account it is not init', () => {
    wrapper.find('.button').at(0).simulate('click');
    expect(props.history.push).toBeCalled();
  });
});
