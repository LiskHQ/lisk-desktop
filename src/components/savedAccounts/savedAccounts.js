import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import React from 'react';
import { extractAddress } from '../../utils/api/account';
import { SecondaryLightButton } from '../toolbox/buttons/button';
import LiskAmount from '../liskAmount';
import BackgroundMaker from '../backgroundMaker';

import plusShapeIcon from '../../assets/images/plus-shape.svg';
import circleImage from '../../assets/images/add-id-oval.svg';
import rectangleOnTheRight from '../../assets/images/add-id-rectangle-1.svg';
import rectangleImage2 from '../../assets/images/add-id-rectangle-2.svg';
import rectangleImage3 from '../../assets/images/add-id-rectangle-3.svg';
import triangleImage from '../../assets/images/add-id-triangle.svg';

import styles from './savedAccounts.css';


const SavedAccounts = ({
  networkOptions,
  activeAccount,
  closeDialog,
  accountRemoved,
  accountSwitched,
  accountLoggedOut,
  savedAccounts,
  accountSaved,
  t,
}) => {
  const isActive = account => (
    account.publicKey === activeAccount.publicKey &&
    account.network === networkOptions.code);

  const save = () => {
    accountSaved({
      network: networkOptions.code,
      address: networkOptions.address,
      publicKey: activeAccount.publicKey,
      balance: activeAccount.balance,
    });
  };

  return (
    <div className={`${styles.wrapper} save-account`}>
      <BackgroundMaker />
      <ToolBoxButton icon='close' floating onClick={closeDialog} className={`x-button ${styles.closeButton}`} />
      <h1>{t('Your favorite Lisk IDs')}</h1>
      <div className={styles.cardsWrapper} >
        <div className={`add-lisk-id-card ${styles.card} ${styles.addNew}`} onClick={accountLoggedOut} >
          <div className={styles.cardIcon}>
            <img src={plusShapeIcon} className={styles.plusShapeIcon} />
          </div>
          <img src={rectangleOnTheRight} className={styles.rectangleOnTheRight} />
          <img src={rectangleImage2} className={styles.rectangleImage2} />
          <img src={rectangleImage3} className={styles.rectangleImage3} />
          <img src={triangleImage} className={styles.triangleImage} />
          <img src={circleImage} className={styles.circleImage} />
          <h2 className={styles.addTittle} >{t('Add a Lisk ID')}</h2>
        </div>
        {savedAccounts.map(account => (
          <div className={`switch-button saved-account-card ${styles.card}`}
            key={account.publicKey + account.network}
            onClick={accountSwitched.bind(this, account)} >
            {(isActive(account) && activeAccount.passphrase ?
              <strong className={styles.unlocked}>
                <FontIcon value='lock_open' />
                {t('Unlocked')}
              </strong> :
              null)}
            <div className={styles.cardIcon}>
              <div className={styles.accountVisualPlaceholder}></div>
              <div className={styles.accountVisualPlaceholder2}></div>
            </div>
            <h2>
              <LiskAmount val={account.balance} /> <small>LSK</small>
            </h2>
            <div className={styles.address} >{extractAddress(account.publicKey)}</div>
            <SecondaryLightButton className='remove-button'
              theme={{ button: styles.removeButton }}
              onClick={accountRemoved.bind(null, account)}
              label={t('Remove from Favorites')}/>
          </div>
        ))}
      </div>
      <SecondaryLightButton className='add-active-account-button'
        theme={{ button: styles.addAcctiveAccountButton }}
        disabled={savedAccounts.filter(isActive).length !== 0}
        onClick={save.bind(this)}
        label={t('Add active account')}/>
    </div>
  );
};

export default SavedAccounts;
