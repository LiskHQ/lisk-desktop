import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { TertiaryButton, Button } from './../toolbox/buttons/button';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import LiskAmount from '../liskAmount';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';
import routes from './../../constants/routes';
import { getIndexOfFollowedAccount } from './../../utils/followedAccounts';
import { followedAccountRemoved } from '../../actions/followedAccounts';
import Piwik from '../../utils/piwik';
import styles from './sendTo.css';

class SendTo extends React.Component {
  render() {
    const {
      accounts, account, address, delegate, nextStep, t, removeAccount,
    } = this.props;

    const isFollowing = getIndexOfFollowedAccount(accounts, account) !== -1;
    const handleClick = () => {
      if (isFollowing) {
        Piwik.trackingEvent('SendTo', 'button', 'Remove account');
        removeAccount(account);
      } else {
        Piwik.trackingEvent('SendTo', 'button', 'Next step');
        nextStep(account);
      }
    };

    return (<Box className={`${styles.wrapper} ${grid.row}`}>
      <section className={`${styles.content} explorer-account-left-block`}>
        <div className={`
          ${grid['col-xs-12']}
          ${grid['col-sm-7']}
          ${grid['col-md-12']}
          ${grid['col-lg-12']}
          ${grid['middle-sm']}
          ${grid.row}
        `}>
          {account.address ?
            <AccountVisual
              address={account.address}
              size={144}
              sizeS={90}
              className={`
          ${grid['col-xs-4']}
          ${grid['col-sm-5']}
          ${grid['col-md-12']}
          ${grid['col-lg-12']}
          ${grid['middle-sm']}
          `} /> : null
          }
          <div className={`${styles.account}
              ${grid['col-xs-8']}
              ${grid['col-sm-7']}
              ${grid['col-md-12']}
              ${grid['col-lg-12']}
            `}>
            {!Number.isNaN(account.balance) ? <h2>
              <span className={'balance'}>
                <LiskAmount val={account.balance}/>
                <small className={styles.balanceUnit}>LSK</small>
              </span>
            </h2> : null}
            {account.address ?
              <CopyToClipboard value={account.address} className={`${styles.address}`} copyClassName={styles.copy} /> :
              null}
            {
              delegate.username ?
                <div className={styles.delegateRow}>
                  {t('Delegate')}
                  <span className={`${styles.delegateUsername} delegate-name`}>{delegate.username}</span>
                </div>
                : null
            }
          </div>
        </div>
        <div className={`
          ${grid['col-xs-12']}
          ${grid['col-sm-5']}
          ${grid['col-md-12']}
          ${grid['col-lg-12']}
          ${grid['middle-sm']}
          ${styles.sendButton}
        `}>
          <Link to={`${routes.send.path}?recipient=${address}`}>
            <TertiaryButton className={`${styles.button} send-to-address`} >
              <FontIcon value={'send-token'}/> {t('Send to this address')}
            </TertiaryButton>
          </Link>
          <Button
            onClick={() => handleClick()}
            className={`${styles.button} ${styles.follow} follow-account`} >
            <FontIcon value={isFollowing ? 'star-filled' : 'star-outline'}/> <span className={styles.label}>{isFollowing ? t('Remove from bookmarks') : t('Add to bookmarks')}</span>
          </Button>
        </div>
      </section>
    </Box>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.followedAccounts.accounts,
});

const mapDispatchToProps = dispatch => ({
  removeAccount: data => dispatch(followedAccountRemoved(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SendTo));
