



describe('Generals', () => {
  it('redirect to Terms of Use page', () => {
    expect(props.history.push).toHaveBeenCalledWith(routes.termsOfUse.path);
  });

  it('should show error about passphrase length if passphrase have wrong length', () => {
    const expectedError = 'Passphrase should have 12 words, entered passphrase has 11';
    const clipboardData = {
      getData: () => passphrase.replace(/\s[a-z]+$/, ''),
    };
    wrapper
      .find('passphraseInput input')
      .first()
      .simulate('paste', { clipboardData });
    expect(wrapper.find('passphraseInput Feedback').last().html()).toContain(
      expectedError,
    );
  });
});

describe('After submission', () => {
  it('it should call props.login if not already logged with given passphrase', () => {
    const clipboardData = {
      getData: () => accounts.delegate.passphrase,
    };
    wrapper
      .find('passphraseInput input')
      .first()
      .simulate('paste', { clipboardData });
    wrapper.update();
    wrapper.find('button.login-button').simulate('submit');
    expect(props.login).toHaveBeenCalledWith({
      passphrase: accounts.delegate.passphrase,
    });
  });

  it('should not login if passphrase is empty', () => {
    const clipboardData = {
      getData: () => '',
    };
    wrapper
      .find('passphraseInput input')
      .first()
      .simulate('paste', { clipboardData });
    wrapper.update();
    wrapper.find('button.login-button').simulate('submit');
    expect(props.login).not.toHaveBeenCalled();
  });
});
