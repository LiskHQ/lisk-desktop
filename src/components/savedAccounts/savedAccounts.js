import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import { Link } from 'react-router-dom';
// import FontIcon from 'react-toolbox/lib/font_icon';
import React from 'react';
import { extractAddress } from '../../utils/api/account';
import { PrimaryButton, SecondaryLightButton } from '../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import LiskAmount from '../liskAmount';
import BackgroundMaker from '../backgroundMaker';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';
import routes from '../../constants/routes';

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
      isSecureAppears: {},
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
    const { publicKey, network, address } = this.state.accountSelectedForRemove || {};
    return (account.publicKey === publicKey &&
      account.network === network &&
      account.address === address);
  }

  handleRemove(account, e) {
    if (this.isSelectedForRemove(account)) {
      this.props.accountRemoved(account);
    } else {
      this.selectForRemove(account);
    }
    e.stopPropagation();
  }

  handleRemovePassphrase(account, e) {
    e.stopPropagation();

    const uniqueID = `${account.network}${account.publicKey}`;
    const { savedAccounts } = this.props;
    const savedActiveAccount = savedAccounts.find(acc => `${acc.network}${acc.passphrase}` === `${account.network}${account.passphrase}`);
    if (savedActiveAccount) {
      this.props.removePassphrase(account);
    }

    this.props.removeSavedAccountPassphrase(account);

    this.setState({ isSecureAppears: { ...this.state.isSecureAppears, [uniqueID]: true } });
    setTimeout(() => {
      this.setState({ isSecureAppears: { ...this.state.isSecureAppears, [uniqueID]: false } });
    }, 5000);
  }

  render() {
    const {
      accountSwitched,
      savedAccounts,
      history,
      t,
    } = this.props;

    const goToDashboard = () => {
      history.push(`${routes.main.path}${routes.dashboard.path}`);
    };

    const goBack = () => {
      if (history.length <= 2) {
        goToDashboard();
        return;
      }
      history.goBack();
    };

    const switchAccount = (account) => {
      if (!this.state.editing) {
        accountSwitched(account);
        goToDashboard();
      }
    };

    return (
      <div className={`${styles.wrapper} save-account`}>
        <BackgroundMaker className={styles.background} />
        <h1>
          {t('Your Lisk IDs')}
        </h1>
        <div className={`${styles.content}`}>
          <ul className={styles.cardsWrapper} >
            <li>
              <Link to={`${routes.addAccount.path}?referrer=${routes.main.path}${routes.dashboard.path}/`} >
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
            </li>
            {savedAccounts.map(account => (
              <li className={`saved-account-card ${styles.card}
                ${this.state.editing ? null : styles.clickable}
                ${this.isSelectedForRemove(account) ? styles.darkBackground : null}`}
              key={account.publicKey + account.network}
              onClick={ switchAccount.bind(null, account)} >
                {(account.passphrase ?
                  <strong
                    className={`unlocked ${styles.unlocked}`}
                    onClick={this.handleRemovePassphrase.bind(this, account)}>
                    <FontIcon value='unlocked' />
                    {t('Lock ID')}
                  </strong> :
                  null)}
                {(this.state.isSecureAppears[`${account.network}${account.publicKey}`] ?
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
                    label={this.isSelectedForRemove(account) ? t('Confirm') : t('Remove')}/> :
                  null
                }
              </li>
            ))}
          </ul>
        </div>
        <SecondaryLightButton className='edit-button'
          onClick={this.toggleEdit.bind(this)}
          theme={{ button: styles.addAcctiveAccountButton }}>
          <FontIcon className={styles.editIcon}
            value={this.state.editing ? 'checkmark' : 'edit'} />
          {this.state.editing ? t('Done') : t('Edit')}
        </SecondaryLightButton>
        <ToolBoxButton icon={<FontIcon value='close' />} floating onClick={goBack} className={`x-button ${styles.closeButton}`} />
      </div>
    );
  }
}

export default SavedAccounts;
