import React from 'react';
import { mount } from 'enzyme';
import Message from './message';

describe('Message', () => {
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
    transactions: [],
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
    wrapper = mount(<Message {...props} />);
  });

  it('should show the message component if account it is not init', () => {
    expect(wrapper.find('.message')).toHaveClassName('show');
    wrapper.find('.button').at(0).simulate('click');
    expect(props.history.push).toBeCalled();
  });

  it('should hide the message component if account it is init', () => {
    const newProps = {
      ...props,
      transactions: [{ amount: '0.01', message: 'init account' }],
      account: {
        info: {
          LSK: {
            balance: 10,
            serverPublicKey: '23j4kg',
          },
        },
      },
    };
    wrapper = mount(<Message {...newProps} />);
    expect(wrapper.find('.message')).not.toHaveClassName('show');
  });
});
