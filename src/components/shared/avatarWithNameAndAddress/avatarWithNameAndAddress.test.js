import React from 'react';
import { mount } from 'enzyme';
import AvatarWithNameAndAddress from './index';

describe('AvatarWithNameAndAddress', () => {
  const props = {
    username: 'tes_username',
    account: {
      address: 'lskwezupc89ug4xw8g92y89pru3c7d4zwouo5eyky',
    },
  };

  it('should mount an account visual', () => {
    const wrapper = mount(<AvatarWithNameAndAddress {...props} />);
    expect(wrapper.find('AccountVisual')).toHaveLength(1);
  });

  it('should display the username and address', () => {
    const wrapper = mount(<AvatarWithNameAndAddress {...props} />);
    const html = wrapper.html();
    expect(html).toContain(props.username);
    expect(html).toContain(props.account.address);
  });
});
