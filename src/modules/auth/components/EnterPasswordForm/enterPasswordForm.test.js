import React from 'react';
import { mount } from 'enzyme';

import EnterPasswordForm from '.';
import styles from './enterPasswordForm.css';

describe('PassphraseBackup', () => {
  let wrapper;
  const props = {
    accountSchema: {
      metadata: {
        address: 'lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n',
        name: 'Lisker',
      },
    },
    onEnterPasswordSuccess: jest.fn(),
  };

  it('should display properly', () => {
    wrapper = mount(<EnterPasswordForm {...props} />);

    expect(wrapper.find('.accountName')).toHaveText(props.accountSchema.metadata.name);
    expect(wrapper.find('.accountAddress')).toHaveText(props.accountSchema.metadata.address);
  });

  it('should onEnterPasswordSuccess when onSubmit click', () => {
    wrapper = mount(<EnterPasswordForm {...props} />);

    wrapper.find('input').at(0).simulate('change', {
      target: {
        value: 'qwerty',
      },
    });
    wrapper.find(styles.button).first().simulate('click');
    expect(props.onEnterPasswordSuccess).toHaveBeenCalledWith({
      privateToken: 'private-token-mock',
      recoveryPhrase: 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
    });
  });
});
