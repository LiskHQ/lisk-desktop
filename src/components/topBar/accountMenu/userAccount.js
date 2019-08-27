import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../../toolbox/dropdown/dropdown';
import styles from './userAccount.css';
import OutsideClickHandler from '../../toolbox/outsideClickHandler';
import Icon from '../../toolbox/icon';
import { tokenKeys } from '../../../constants/tokens';
import routes from '../../../constants/routes';
import feedbackLinks from '../../../constants/feedbackLinks';
import externalLinks from '../../../constants/externalLinks';
import AccountInfo from './accountInfo';

const UserAccount = ({
  token, t, account, onDropdownToggle, isDropdownEnable, onLogout,
  settingsUpdated, isUserLogout, signInHolderClassName,
}) => {
  /* istanbul ignore next */
  const enabledTokens = tokenKeys.filter(key => token.list[key]);
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
          className="active-info"
          account={account.info[token.active]}
          token={token.active}
          t={t}
        />
      ) : (
        <span className={`${styles.signInHolder} ${signInHolderClassName}`}>
          <Icon name={`user${isDropdownEnable ? 'Active' : ''}`} />
        </span>
      )}
      <Dropdown
        showArrow
        className={styles.dropdown}
        showDropdown={isDropdownEnable}
      >
        {isUserDataFetched && enabledTokens.map(tokenKey => (account.info[tokenKey] ? ([
          <span
            className={`${styles.accountHolder} ${tokenKey}`}
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
          <Dropdown.Separator key={`separator-${tokenKey}`} className={styles.separator} />,
        ]) : null))}

        <a
          className={styles.dropdownOption}
          href={externalLinks.liskAcademy}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon name="feedback" className={styles.defaultIcon} />
          <Icon name="feedbackActive" className={styles.activeIcon} />
          <span>{t('Lisk Academy')}</span>
        </a>

        <a
          className={styles.dropdownOption}
          href={externalLinks.discord}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon name="discordIcon" className={styles.defaultIcon} />
          <Icon name="discordIconActive" className={styles.activeIcon} />
          <span>{t('Discord')}</span>
        </a>

        <a
          className={styles.dropdownOption}
          href={feedbackLinks.general}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon name="feedback" className={styles.defaultIcon} />
          <Icon name="feedbackActive" className={styles.activeIcon} />
          <span>{t('Give Feedback')}</span>
        </a>

        <Link
          id="settings"
          to={routes.setting.path}
          className={styles.dropdownOption}
        >
          <Icon name="settings" className={styles.defaultIcon} />
          <Icon name="settingsActive" className={styles.activeIcon} />
          <span>{t('Settings')}</span>
        </Link>

        <Dropdown.Separator className={styles.separator} />

        {isUserLogout ? (
          <Link
            className={`${styles.dropdownOption} signIn`}
            to={routes.login.path}
          >
            <Icon name="signin" className={styles.defaultIcon} />
            <Icon name="signinActive" className={styles.activeIcon} />
            <span>{t('Sign in')}</span>
          </Link>
        ) : (
          <span
            className={`${styles.dropdownOption} logout`}
            onClick={onLogout}
          >
            <Icon name="logout" className={styles.defaultIcon} />
            <Icon name="logoutActive" className={styles.activeIcon} />
            <span>{t('Sign out')}</span>
          </span>
        )}
      </Dropdown>
    </OutsideClickHandler>
  );
};

export default UserAccount;
