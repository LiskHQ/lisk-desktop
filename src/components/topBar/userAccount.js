import React from 'react';
import { Link } from 'react-router-dom';
import LiskAmount from '../liskAmount';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import { dropdownLinks } from './constants';
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
  const dropdownOptions = dropdownLinks(t);
  const enabledTokens = tokenKeys.filter(key => token.list[key]);

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
          <span>
            <LiskAmount val={account.info[token.active].balance}/> {tokenMap[token.active].key}
          </span>
        </div>
      </div>
      <DropdownV2
        showArrow={true}
        className={styles.dropdown}
        showDropdown={isDropdownEnable}
      >
        { /* istanbul ignore next */
          localStorage.getItem('btc') && // TODO: Remove when enabling btc to endusers
          enabledTokens.length > 1 && enabledTokens.map(tokenKey => (account.info[tokenKey] ? ([
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
          <DropdownV2.Separator key={`separator-${tokenKey}`} />,
        ]) : null))}
        <Link
          id={dropdownOptions.settings.id}
          to={dropdownOptions.settings.path}
          className={styles.dropdownOption}
        >
          <img src={dropdownOptions.settings.icon} className={styles.defaultIcon} />
          <img src={dropdownOptions.settings.icon_active} className={styles.activeIcon} />
          <span>{dropdownOptions.settings.label}</span>
        </Link>

        <Link
          className={styles.dropdownOption}
          to={routes.help.path}
        >
          <span>{t('Help Center')}</span>
        </Link>

        <a
          className={styles.dropdownOption}
          href={feedbackLinks.general} target="_blank"
        >
          <span>{t('Give Feedback')}</span>
        </a>

        <DropdownV2.Separator />

        <span
          className={`${styles.dropdownOption} logout`}
          onClick={onLogout}
        >
          <img src={dropdownOptions.logout.icon} className={styles.defaultIcon}/>
          <img src={dropdownOptions.logout.icon_active} className={styles.activeIcon}/>
          <span>{dropdownOptions.logout.label}</span>
        </span>
      </DropdownV2>
    </OutsideClickHandler>
  );
};

export default UserAccount;
