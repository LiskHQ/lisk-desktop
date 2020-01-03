import React from 'react';
import { SecondaryButton } from '../../../../toolbox/buttons/button';
import { loginType } from '../../../../../constants/hwConstants';
import { tokenKeys } from '../../../../../constants/tokens';
import AccountInfo from './accountInfo';
import DropdownButton from '../../../../toolbox/dropdownButton';
import Icon from '../../../../toolbox/icon';
import MenuItem from './menuItem';
import Separator from '../../../../toolbox/dropdown/separator';
import externalLinks from '../../../../../constants/externalLinks';
import feedbackLinks from '../../../../../constants/feedbackLinks';
import routes from '../../../../../constants/routes';
import styles from './userAccount.css';

class UserAccount extends React.Component {
  constructor(props) {
    super(props);

    this.setChildRef = this.setChildRef.bind(this);
    this.handleTokenSelect = this.handleTokenSelect.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  handleTokenSelect(token) {
    this.props.settingsUpdated({ token: { active: token } });
    this.toggleDropdown();
  }

  handleLogout() {
    this.props.onLogout();
    this.toggleDropdown();
  }

  setChildRef(node) {
    this.childRef = node;
  }

  toggleDropdown() {
    this.childRef.toggleDropdown();
  }

  renderTokens = () => {
    const {
      token, t, account,
    } = this.props;
    const isUserDataFetched = account.info && account.info[token.active] && (
      !!account.info[token.active].balance
      || account.info[token.active].balance === 0
    );
    const enabledTokens = tokenKeys.filter(key => token.list[key]);

    return (
      isUserDataFetched && enabledTokens.map(tokenKey => (account.info[tokenKey]
        ? (
          <React.Fragment key={tokenKey}>
            <span
              className={`${styles.accountHolder} ${tokenKey} token`}
              onClick={() => this.handleTokenSelect(tokenKey)}
            >
              <AccountInfo
                account={account.info[tokenKey]}
                token={tokenKey}
                t={t}
              />
              {
              tokenKey === token.active
                ? <span className={styles.activeLabel}>{t('Active')}</span>
                : null
            }
            </span>
            <Separator />
          </React.Fragment>
        )
        : null
      ))
    );
  }

  renderButtonLabel = () => {
    const {
      token, t, account, isUserLogout, signInHolderClassName,
    } = this.props;

    /* istanbul ignore next */
    const isUserDataFetched = account.info && account.info[token.active] && (
      !!account.info[token.active].balance
      || account.info[token.active].balance === 0
    );

    return !isUserLogout && isUserDataFetched
      ? (
        <AccountInfo
          className="active-info"
          account={account.info[token.active]}
          token={token.active}
          t={t}
        />
      )
      : (
        <span className={`${styles.signInHolder} ${signInHolderClassName}`}>
          <Icon name="user" />
        </span>
      );
  }

  render() {
    const {
      token, t, account, isUserLogout,
    } = this.props;
    return (
      <DropdownButton
        buttonClassName={`${styles.wrapper} user-account`}
        className={styles.dropdown}
        buttonLabel={this.renderButtonLabel()}
        ButtonComponent={SecondaryButton}
        align="right"
        ref={this.setChildRef}
      >
        {
          this.renderTokens()
        }
        <MenuItem
          name="discord"
          title={t('Discord')}
          href={externalLinks.discord}
          onClick={this.toggleDropdown}
        />
        <MenuItem
          name="feedback"
          title={t('Give Feedback')}
          href={feedbackLinks.general}
          onClick={this.toggleDropdown}
        />
        <MenuItem
          name="settings"
          title={t('Settings')}
          to={routes.settings.path}
          onClick={this.toggleDropdown}
        />
        {
          (typeof account.loginType === 'number'
          && account.loginType === loginType.normal
          && token.active !== 'BTC'
          )
            ? (
              <MenuItem
                name="signMessage"
                title={t('Sign Message')}
                to={routes.signMessage.path}
                onClick={this.toggleDropdown}
              />
            ) : null
        }
        {
          token.active !== 'BTC'
            ? (
              <MenuItem
                name="verifyMessage"
                title={t('Verify Message')}
                to={routes.verifyMMessage.path}
                onClick={this.toggleDropdown}
              />
            ) : null
        }
        <Separator />
        {
          isUserLogout
            ? (
              <MenuItem
                className="signIn"
                name="signIn"
                title={t('Sign in')}
                to={routes.login.path}
                onClick={this.toggleDropdown}
              />
            )
            : (
              <MenuItem
                className="logout"
                name="logout"
                title={t('Sign out')}
                onClick={this.handleLogout}
              />
            )
        }
      </DropdownButton>
    );
  }
}

export default UserAccount;
