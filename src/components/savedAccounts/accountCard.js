import React from 'react';
import { extractAddress } from '../../utils/account';
import { PrimaryButton } from '../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import LiskAmount from '../liskAmount';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';
import CopyToClipboard from '../copyToClipboard';
import { FontIcon } from '../fontIcon';
import styles from './card.css';

const AccountCard = ({
  account, t, isEditing, handleRemove, isSecureAppears,
  isSelectedForRemove, selectForRemove, onClick, handleRemovePassphrase,
}) =>
  (<li onClick={onClick} className={`saved-account-card ${styles.card}
    ${isEditing ? null : styles.clickable}
    ${isSelectedForRemove(account) ? styles.darkBackground : null}`}>
    {(account.passphrase ?
      <strong
        className={`unlocked ${styles.unlocked}`}
        onClick={e => handleRemovePassphrase(account, e)}>
        <FontIcon value='unlocked' />
        {t('Lock ID')}
      </strong> :
      null)}
    {(isSecureAppears[`${account.network}${account.publicKey}`] ?
      <strong className={`unlockedSecured ${styles.unlockedSecured}`}>
        {t('Your ID is now secured!')}
      </strong> :
      null)}
    {(account.network !== networks.mainnet.code ?
      <strong className={styles.network}>
        {account.address ? account.address : t(getNetwork(account.network).name)}
      </strong> :
      null)}
    <div className={styles.cardIcon}>
      <AccountVisual address={extractAddress(account.publicKey)} size={155} sizeS={100}
        className={styles.accountVisual} />
    </div>
    <h2>
      <LiskAmount val={account.balance} /> <small>LSK</small>
    </h2>
    <div className={`${styles.address} address`} onClick={ e => e.stopPropagation()}>
      <CopyToClipboard value={extractAddress(account.publicKey)}/></div>
    { isSelectedForRemove(account) ?
      <div className={styles.removeConfirm}>
        <h2>{t('You can always get it back.')}</h2>
        <a onClick={selectForRemove}>{t('Keep it')}</a>
      </div> :
      null
    }
    { isEditing ?
      <PrimaryButton className={isSelectedForRemove(account) ? 'confirm-button' : 'remove-button'}
        theme={ isSelectedForRemove(account) ?
          {} :
          { button: styles.removeButton }
        }
        onClick={e => handleRemove(account, e)}
        label={isSelectedForRemove(account) ? t('Confirm') : t('Remove')}/> :
      null
    }
  </li>);

export default AccountCard;
