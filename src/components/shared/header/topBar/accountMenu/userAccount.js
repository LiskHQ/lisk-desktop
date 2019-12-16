import React from 'react';
import Dropdown from '../../../../toolbox/dropdown/dropdown';
import styles from './userAccount.css';
import Icon from '../../../../toolbox/icon';
import { tokenKeys } from '../../../../../constants/tokens';
import routes from '../../../../../constants/routes';
import feedbackLinks from '../../../../../constants/feedbackLinks';
import externalLinks from '../../../../../constants/externalLinks';
import DropdownButton from '../../../../toolbox/dropdownButton';
import { SecondaryButton } from '../../../../toolbox/buttons/button';
import AccountInfo from './accountInfo';
import { loginType } from '../../../../../constants/hwConstants';
import MenuItem from './menuItem';

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
        ? ([
          <span
            className={`${styles.accountHolder} ${tokenKey} token`}
            key={tokenKey}
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
          </span>,
          <Dropdown.Separator key={`separator-${tokenKey}`} className={styles.separator} />,
        ])
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
          t={t}
          name="discord"
          title={t('Discord')}
          href={externalLinks.discord}
          onClick={this.toggleDropdown}
        />
        <MenuItem
          t={t}
          name="feedback"
          title={t('Give Feedback')}
          href={feedbackLinks.general}
          onClick={this.toggleDropdown}
        />
        <MenuItem
          t={t}
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
                t={t}
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
                t={t}
                name="verifyMessage"
                title={t('Verify Message')}
                to={routes.verifyMMessage.path}
                onClick={this.toggleDropdown}
              />
            ) : null
        }
        <Dropdown.Separator className={styles.separator} />
        {
          isUserLogout
            ? (
              <MenuItem
                t={t}
                className="signIn"
                name="signIn"
                title={t('Sign in')}
                to={routes.login.path}
                onClick={this.toggleDropdown}
              />
            )
            : (
              <MenuItem
                t={t}
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
