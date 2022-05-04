import React from 'react';
import { mount } from 'enzyme';
import { accountLoggedOut } from '@auth/store/action';
import routes from '@screens/router/routes';
import SignOut from './signOut';

jest.mock('@auth/store/action', () => ({
  accountLoggedOut: jest.fn(),
}));

describe('Form', () => {
  let wrapper;

  const props = {
    t: t => t,
    history: {
      replace: jest.fn(),
    },
  };

  it('should logout properly', () => {
    wrapper = mount(<SignOut {...props} />);
    wrapper.find('.logoutBtn').at(0).simulate('click');
    expect(accountLoggedOut).toHaveBeenCalledTimes(1);
    expect(props.history.replace).toHaveBeenCalledWith(routes.login.path);
  });
});
