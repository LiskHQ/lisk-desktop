import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import { Link } from 'react-router-dom';
// import FontIcon from 'react-toolbox/lib/font_icon';
import React from 'react';
import { extractAddress } from '../../utils/api/account';
import { PrimaryButton, SecondaryLightButton } from '../toolbox/buttons/button';
import LiskAmount from '../liskAmount';
import BackgroundMaker from '../backgroundMaker';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';

import plusShapeIcon from '../../assets/images/plus-shape.svg';
import circleImage from '../../assets/images/add-id-oval.svg';
import rectangleOnTheRight from '../../assets/images/add-id-rectangle-1.svg';
import rectangleImage2 from '../../assets/images/add-id-rectangle-2.svg';
import rectangleImage3 from '../../assets/images/add-id-rectangle-3.svg';
import triangleImage from '../../assets/images/add-id-triangle.svg';
import { FontIcon } from '../fontIcon';

import styles from './savedAccounts.css';


class SavedAccounts extends React.Component {
  constructor() {
    super();

    this.state = {
    };
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing,
      accountSelectedForRemove: null,
    });
  }

  selectForRemove(account) {
    this.setState({ accountSelectedForRemove: account });
  }

  isSelectedForRemove(account) {
    return account === this.state.accountSelectedForRemove;
  }

  handleRemove(account, e) {
    if (this.isSelectedForRemove(account)) {
      this.props.accountRemoved(account);
    } else {
      this.selectForRemove(account);
    }
    e.stopPropagation();
  }

  render() {
    const {
      closeDialog,
      accountSwitched,
      savedAccounts,
      history,
      t,
    } = this.props;

    const switchAccount = (account) => {
      if (!this.state.editing) {
        accountSwitched(account);
        history.push('/main/transactions/');
      }
    };

    return (
      <div className={`${styles.wrapper} save-account`}>
        <BackgroundMaker />
        <h1>{t('Your favorite Lisk IDs')}</h1>
        <div className={styles.cardsWrapper} >
          <Link to='/main/add-account/?referrer=/main/transactions/saved-accounts' >
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
            <div className={`saved-account-card ${styles.card}
              ${this.state.editing ? null : styles.clickable}
              ${this.isSelectedForRemove(account) ? styles.darkBackground : null}`}
            key={account.publicKey + account.network}
            onClick={ switchAccount.bind(null, account)} >
              {(account.passphrase ?
                <strong className={styles.unlocked}>
                  <FontIcon value='unlocked' />
                  {t('Unlocked')}
                </strong> :
                null)}
              {(account.network !== networks.mainnet.code ?
                <strong className={styles.network}>
                  {account.address ? account.address : t(getNetwork(account.network).name)}
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
              { this.isSelectedForRemove(account) ?
                <div className={styles.removeConfirm}>
                  <h2>{t('You can always get it back.')}</h2>
                  <a onClick={this.selectForRemove.bind(this)}>{t('Keep it')}</a>
                </div> :
                null
              }
              { this.state.editing ?
                <PrimaryButton className='remove-button'
                  theme={ this.isSelectedForRemove(account) ?
                    {} :
                    { button: styles.removeButton }
                  }
                  onClick={this.handleRemove.bind(this, account)}
                  label={t('Remove from Favorites')}/> :
                null
              }
            </div>
          ))}
        </div>
        <SecondaryLightButton className='edit-button'
          onClick={this.toggleEdit.bind(this)}
          theme={{ button: styles.addAcctiveAccountButton }}>
          <FontIcon className={styles.editIcon}
            value={this.state.editing ? 'checkmark' : 'edit'} />
          {this.state.editing ? t('Done') : t('Edit')}
        </SecondaryLightButton>
        <ToolBoxButton icon={<FontIcon value='close' />} floating onClick={closeDialog} className={`x-button ${styles.closeButton}`} />
      </div>
    );
  }
}

export default SavedAccounts;
