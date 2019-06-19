import React from 'react';
import { Link } from 'react-router-dom';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import styles from './userAccount.css';
import OutsideClickHandler from '../../toolbox/outsideClickHandler';
import Icon from '../../toolbox/icon';
import { tokenMap, tokenKeys } from '../../../constants/tokens';
import routes from '../../../constants/routes';
import feedbackLinks from '../../../constants/feedbackLinks';
import AccountInfo from './accountInfo';

const UserAccount = ({
  token, t, account, onDropdownToggle, isDropdownEnable, onLogout,
  settingsUpdated, isUserLogout,
}) => {
  /* istanbul ignore next */
  const enabledTokens = localStorage.getItem('btc') // TODO: Remove when enabling BTC
    ? tokenKeys.filter(key => token.list[key])
    : [tokenMap.LSK.key];
  const isUserDataFetched = account.info && account.info[token.active] && (
    !!account.info[token.active].balance
    || account.info[token.active].balance === 0
  );

  return (
    <OutsideClickHandler
      className={`${styles.wrapper} user-account`}
      onClick={onDropdownToggle}
      onOutsideClick={onDropdownToggle}
      disabled={!isDropdownEnable}
    >
      {!isUserLogout && isUserDataFetched ? (
        <AccountInfo
          className={'active-info'}
          account={account.info[token.active]}
          token={token.active}
          t={t}
        />
      ) : (
        <span className={styles.signInHolder}>
          <Icon name={`user${isDropdownEnable ? 'Active' : ''}` } />
        </span>
      )}
      <DropdownV2
        showArrow={true}
        className={styles.dropdown}
        showDropdown={isDropdownEnable}
      >
        {isUserDataFetched && enabledTokens.map(tokenKey => (account.info[tokenKey] ? ([
          <span
            className={styles.accountHolder}
            key={tokenKey}
            onClick={settingsUpdated.bind(this, { token: { active: tokenKey } })}
          >
            <AccountInfo
              account={account.info[tokenKey]}
              token={tokenKey}
              t={t}
            />
            {tokenKey === token.active
              ? <span className={styles.activeLabel}>{t('Active')}</span>
              : null
            }
          </span>,
          <DropdownV2.Separator key={`separator-${tokenKey}`} className={styles.separator} />,
        ]) : null))}

        <Link
          id='help'
          className={styles.dropdownOption}
          to={routes.help.path}
        >
          <Icon name='help' className={styles.defaultIcon} />
          <Icon name='helpActive' className={styles.activeIcon} />
          <span>{t('Help Center')}</span>
        </Link>

        <a
          className={styles.dropdownOption}
          href={feedbackLinks.general}
          rel={'noopener noreferrer'}
          target="_blank"
        >
          <Icon name='feedback' className={styles.defaultIcon} />
          <Icon name='feedbackActive' className={styles.activeIcon} />
          <span>{t('Give Feedback')}</span>
        </a>

        <Link
          id='settings'
          to={routes.setting.path}
          className={styles.dropdownOption}
        >
          <Icon name='settings' className={styles.defaultIcon} />
          <Icon name='settingsActive' className={styles.activeIcon} />
          <span>{t('Settings')}</span>
        </Link>

        <DropdownV2.Separator className={styles.separator} />

        {isUserLogout ? (
          <Link
            className={`${styles.dropdownOption} signIn`}
            to={routes.loginV2.path}
          >
            <Icon name='signin' className={styles.defaultIcon} />
            <Icon name='signinActive' className={styles.activeIcon} />
            <span>{t('Sign in')}</span>
          </Link>
        ) : (
          <span
            className={`${styles.dropdownOption} logout`}
            onClick={onLogout}
          >
            <Icon name='logout' className={styles.defaultIcon} />
            <Icon name='logoutActive' className={styles.activeIcon} />
            <span>{t('Sign out')}</span>
          </span>
        )}
      </DropdownV2>
    </OutsideClickHandler>
  );
};

export default UserAccount;
