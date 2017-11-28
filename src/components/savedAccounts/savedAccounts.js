import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import React from 'react';
import { extractAddress } from '../../utils/api/account';
import { Button } from '../toolbox/buttons/button';
import LiskAmount from '../liskAmount';
import plusShapeIcon from '../../assets/images/plus-shape.svg';

import styles from './savedAccounts.css';
import mainStyles from '../app/app.css';


const SavedAccounts = ({
  networkOptions,
  publicKey,
  closeDialog,
  accountRemoved,
  accountSwitched,
  accountLoggedOut,
  savedAccounts,
  t,
}) => {
  const isActive = account => (
    account.publicKey === publicKey &&
    account.network === networkOptions.code);

  return (
    <div className={`${styles.wrapper} save-account`}>
      <div className={mainStyles.stageStripes}>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
        <span className={mainStyles.stageStripe}></span>
      </div>
      <ToolBoxButton icon='close' floating onClick={closeDialog} className={styles.closeButton} />
      <h1>{t('Your favorite Lisk IDs')}</h1>
      <div className={styles.cardsWrapper} >
        <div className={`${styles.card} ${styles.addNew}`} onClick={accountLoggedOut} >
          <div className={styles.cardIcon}>
            <img src={plusShapeIcon} className={styles.plusShapeIcon} />
          </div>
          <h2 className={styles.addTittle} >{t('Add a Lisk ID')}</h2>
        </div>
        {savedAccounts.map(account => (
          <div className={`switch-button ${styles.card}`}
            key={account.publicKey + account.network}
            onClick={accountSwitched.bind(this, account)} >
            {(isActive(account) ?
              <span className={styles.unlocked}>
                <FontIcon value='lock_open' />
                {t('Unlocked')}
              </span> :
              null)}
            <div className={styles.cardIcon}>
              <div className={styles.accountVisualPlaceholder}></div>
              <div className={styles.accountVisualPlaceholder2}></div>
            </div>
            <h2>
              <LiskAmount val={18000e8} /> <small>LSK</small>
            </h2>
            <div className={styles.address} >{extractAddress(account.publicKey)}</div>
            <Button className='remove-button'
              theme={{ button: styles.removeButton }}
              onClick={accountRemoved}
              label={t('Remove from Favorites')}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedAccounts;
