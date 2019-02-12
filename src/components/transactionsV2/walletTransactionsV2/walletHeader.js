import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import AccountVisual from '../../accountVisual';
import { getIndexOfFollowedAccount } from '../../../utils/followedAccounts';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../../toolbox/buttons/button';
import RequestV2 from '../../requestV2/requestV2';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import styles from './walletHeader.css';
import routes from '../../../constants/routes';

const walletHeader = ({
  account, followedAccounts, address, t, match,
  onDropdownToggle, showDropdown, setDropdownRef,
}) => {
  const index = getIndexOfFollowedAccount(
    followedAccounts,
    { address },
  );
  const accountTitle = followedAccounts[index]
    && followedAccounts[index].title;
  const hasTitle = index !== -1 && accountTitle !== address;

  const isMyWallet = match.url === routes.wallet.path;

  return (
    <header className={`${styles.wrapper}`}>
      <div className={`${styles.account}`}>
        <AccountVisual
          address={account.address}
          size={48}
          />
        <div className={styles.accountInfo}>
          <div>
            <h2 className={`${styles.title}`}>
            { hasTitle
              ? <span className={'account-title'}>{accountTitle}</span>
              : <span>{t('Wallet')}</span>
            }
            </h2>
            {
              isMyWallet && <span className={`${styles.label} my-account`}>
                {t('My Account')}
              </span>
            }
          </div>
          <span className={styles.address}>
            {address}
          </span>
        </div>
      </div>

      { isMyWallet &&
        (
          <div className={`${styles.buttonsHolder}`}>
            <span
              ref={setDropdownRef}
              className={`${styles.requestContainer} help-onboarding tx-receive-bt`}>
              <SecondaryButtonV2 onClick={onDropdownToggle}>
                {t('Request LSK')}
              </SecondaryButtonV2>
              <DropdownV2 showDropdown={showDropdown} className={`${styles.requestDropdown}`}>
                <RequestV2 address={address} />
              </DropdownV2>
            </span>
            <Link to={`${routes.send.path}?wallet`} className={'tx-send-bt'}>
              <PrimaryButtonV2>
                {t('Send LSK')}
              </PrimaryButtonV2>
            </Link>
          </div>
        )
      }
    </header>
  );
};

export default translate()(walletHeader);
