import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Countdown from 'react-countdown-now';
import { FontIcon } from '../fontIcon';
import AccountVisual from '../accountVisual';
import CountDownTemplate from './countDownTemplate';
import LiskAmount from '../liskAmount';
import logo from '../../assets/images/Lisk-Logo.svg';
import PrivateWrapper from '../privateWrapper';
import { ActionButton } from './../toolbox/buttons/button';
import styles from './header.css';
import RelativeLink from '../relativeLink';

const Header = (props) => {
  const shouldShowActionButton = () => !props.isAuthenticated && props.location.pathname !== '/';

  return (
    <header className={`${grid.row} ${grid['between-xs']} ${styles.wrapper} mainHeader`}>
      <img src={logo} className={styles.logo} />
      <PrivateWrapper>
        <div className={grid.row}>
          <div className={`account ${styles.account}`}>
            <div className={styles.information} align="right">
              <div className={styles.balance}>
                <LiskAmount val={props.account.balance}/>
                <small> LSK</small>
              </div>
              <div className={`${styles.address} account-information-address`}>{props.account.address}</div>
              {props.autoLog ? <div className={styles.timer}>
                {((!props.account.expireTime || props.account.expireTime === 0)) ?
                  <span><FontIcon value='locked' className={styles.lock}/> {props.t('Account locked!')}</span> : <div>
                    <FontIcon value='unlocked' className={styles.lock}/> {props.t('Address timeout in')} <i> </i>
                    <Countdown
                      date={props.account.expireTime}
                      renderer={CountDownTemplate}
                      onComplete={() => props.removePassphrase()}
                    />
                  </div>}
              </div>
                : <div className={styles.timer}>
                  {props.account.passphrase ? '' : <span>
                    <FontIcon value='locked' className={styles.lock}/> {props.t('Account locked!')}
                  </span>
                  }
                </div>
              }
            </div>
            <RelativeLink to='saved-accounts' className={styles.avatar}>
              <AccountVisual address={props.account.address} size={69}/>
            </RelativeLink>
            <div className={styles.menu}>
              <figure className={styles.iconCircle}>
                <RelativeLink className={`${styles.link} saved-accounts`}
                  to='saved-accounts'><FontIcon value='more'/></RelativeLink>
              </figure>
            </div>
          </div>
        </div>
      </PrivateWrapper>
      {shouldShowActionButton() && <Link to='/'><ActionButton>{props.t('Use Lisk-App')}</ActionButton></Link>}
    </header>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
});

export default connect(mapStateToProps)(Header);
