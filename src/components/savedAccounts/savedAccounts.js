import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import { Link } from 'react-router-dom';
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
  savedAccounts,
  t,
}) => {
  const isActive = account => (
    account.publicKey === activeAccount.publicKey &&
    account.network === networkOptions.code);

  return (
    <div className={`${styles.wrapper} save-account`}>
      <BackgroundMaker />
      <ToolBoxButton icon='close' floating onClick={closeDialog} className={`x-button ${styles.closeButton}`} />
      <h1>{t('Your favorite Lisk IDs')}</h1>
      <div className={styles.cardsWrapper} >
        <Link to={`/main/add-account/?referrer=/main/transactions/saved-accounts&activeAddress=${activeAccount.address}`} >
          <div className={`add-lisk-id-card ${styles.card} ${styles.addNew}`} >
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
        </Link>
        {savedAccounts.map(account => (
          <Link to='/main/transactions/'
            key={account.publicKey + account.network}>
            <div className={`switch-button saved-account-card ${styles.card}`}
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
                onClick={(e) => {
                  accountRemoved(account);
                  e.stopPropagation();
                }}
                label={t('Remove from Favorites')}/>
            </div>
          </Link>
        ))}
      </div>
      <SecondaryLightButton className='edit-button'
        icon='edit'
        theme={{ button: styles.addAcctiveAccountButton }}
        disabled={true}
        label={t('Edit')}/>
    </div>
  );
};

export default SavedAccounts;
