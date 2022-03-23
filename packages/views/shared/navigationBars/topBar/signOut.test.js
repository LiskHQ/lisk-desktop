import React from 'react';
import { mount } from 'enzyme';
import { accountLoggedOut } from '@common/store/actions';
import { routes } from '@common/configuration';
import SignOut from './signOut';

jest.mock('@common/store/actions', () => ({
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
