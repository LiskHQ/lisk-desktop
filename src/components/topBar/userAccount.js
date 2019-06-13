import React from 'react';
import { Link } from 'react-router-dom';
import LiskAmount from '../liskAmount';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import styles from './userAccount.css';
import OutsideClickHandler from '../toolbox/outsideClickHandler';
import Icon from '../toolbox/icon';
import { tokenMap, tokenKeys } from '../../constants/tokens';
import routes from '../../constants/routes';
import feedbackLinks from '../../constants/feedbackLinks';

const UserAccount = ({
  token, t, account, onDropdownToggle, isDropdownEnable, onLogout,
  settingsUpdated,
}) => {
  /* istanbul ignore next */
  const enabledTokens = localStorage.getItem('btc') // TODO: Remove when enabling BTC
    ? tokenKeys.filter(key => token.list[key])
    : [tokenMap.LSK.key];

  return (
    <OutsideClickHandler
      className={`${styles.wrapper} user-account`}
      onClick={onDropdownToggle}
      onOutsideClick={onDropdownToggle}
      disabled={!isDropdownEnable}
    >
      <div className={styles.accountInfo}>
        <Icon name={`${tokenMap[token.active].icon}Icon`} />
        <div>
          <p>{t('{{token}} Wallet', { token: tokenMap[token.active].label })}</p>
          <span className={'balance'}>
            <LiskAmount val={account.info[token.active].balance}/> {tokenMap[token.active].key}
          </span>
        </div>
      </div>
      <DropdownV2
        showArrow={true}
        className={styles.dropdown}
        showDropdown={isDropdownEnable}
      >
        {enabledTokens.map(tokenKey => (account.info[tokenKey] ? ([
          <span key={tokenKey}>
            <div
              className={styles.accountInfo}
              onClick={settingsUpdated.bind(this, { token: { active: tokenKey } })}
            >
              <Icon name={`${tokenMap[tokenKey].icon}Icon`} />
              <div>
                <p>{t('{{token}} Wallet', { token: tokenMap[tokenKey].label })}</p>
                <span>
                  <LiskAmount val={account.info[tokenKey].balance}/> {tokenKey}
                </span>
              </div>
              {tokenKey === token.active
                ? <span className={styles.activeLabel}>{t('Active')}</span>
                : null
              }
            </div>
          </span>,
          <DropdownV2.Separator key={`separator-${tokenKey}`} className={styles.separator} />,
        ]) : null))}
        <Link
          id='settings'
          to={routes.setting.path}
          className={styles.dropdownOption}
        >
          <Icon name='settings' className={styles.defaultIcon} />
          <Icon name='settingsActive' className={styles.activeIcon} />
          <span>{t('Settings')}</span>
        </Link>

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
          href={feedbackLinks.general} target="_blank"
        >
          <Icon name='feedback' className={styles.defaultIcon} />
          <Icon name='feedbackActive' className={styles.activeIcon} />
          <span>{t('Give Feedback')}</span>
        </a>

        <DropdownV2.Separator className={styles.separator} />

        <span
          className={`${styles.dropdownOption} logout`}
          onClick={onLogout}
        >
          <Icon name='logout' className={styles.defaultIcon} />
          <Icon name='logoutActive' className={styles.activeIcon} />
          <span>{t('Log out')}</span>
        </span>
      </DropdownV2>
    </OutsideClickHandler>
  );
};

export default UserAccount;
