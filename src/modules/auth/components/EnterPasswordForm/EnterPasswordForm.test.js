import React from 'react';
import { mount } from 'enzyme';

import { decryptionAccount } from '../../../account/utils/decryptionAccount';
import EnterPasswordForm from '.';

jest.mock('../../../account/utils/decryptionAccount');

describe('EnterPasswordForm', () => {
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

  it('should call onEnterPasswordSuccess when onSubmit click', () => {
    const privateToken = 'private-token-mock';
    const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
    decryptionAccount.mockImplementation(() => (
      {
        privateToken,
        recoveryPhrase,
      }
    ));
    props.recoveryPhrase = recoveryPhrase;
    wrapper = mount(<EnterPasswordForm {...props} />);

    wrapper.find('input').at(0).simulate('change', {
      target: {
        value: 'qwerty',
      },
    });
    wrapper.find('.continue-btn').first().simulate('click');
    expect(decryptionAccount).toHaveBeenCalledWith(
      props.accountSchema,
      'qwerty',
    );
    expect(props.onEnterPasswordSuccess).toHaveBeenCalledWith({
      privateToken,
      recoveryPhrase,
      accountSchema: props.accountSchema,
    });
  });

  it('should not call onEnterPasswordSuccess when onSubmit fails', () => {
    decryptionAccount.mockImplementation(() => (
      {
        error: 'error',
      }
    ));
    wrapper = mount(<EnterPasswordForm {...props} />);

    wrapper.find('input').at(0).simulate('change', {
      target: {
        value: 'qwerty',
      },
    });
    wrapper.find('button').first().simulate('click');
    expect(props.onEnterPasswordSuccess).not.toHaveBeenCalledWith();
    expect(wrapper.findWhere((node) => node.text() === 'error')).toBeTruthy();
  });
});
