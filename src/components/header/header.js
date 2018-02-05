import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Countdown from 'react-countdown-now';
import { FontIcon } from '../fontIcon';
import AccountVisual from '../accountVisual';
import SearchBar from '../searchBar';
import CountDownTemplate from './countDownTemplate';
import LiskAmount from '../liskAmount';
import Account from '../account';
import logo from '../../assets/images/Lisk-Logo.svg';
import PrivateWrapper from '../privateWrapper';
import { ActionButton } from './../toolbox/buttons/button';
import styles from './header.css';
import RelativeLink from '../relativeLink';
import routes from './../../constants/routes';

const Header = (props) => {
  const shouldShowActionButton = () => (
    !props.isAuthenticated &&
    props.location.pathname !== routes.login.url &&
    props.location.pathname !== routes.register.url &&
    !props.account.loading
  );
  const shouldShowSearchBar = () => props.location.pathname.includes('explorer') && !props.location.pathname.includes(routes.search.long);

  return (
    <header className={`${grid.row} ${styles.wrapper} mainHeader`}>
      <div className={`${grid['col-lg-6']} ${grid['col-md-6']} ${grid['col-xs-12']} ${styles.noPadding}`}>
        {shouldShowSearchBar() ? <SearchBar /> : <Account peers={props.peers} t={props.t}/>}
      </div>
      <div className={`${grid['col-lg-6']} ${grid['col-md-6']} ${grid['col-xs-12']} ${styles.noPadding}`}>
        <div className={`${grid.row} ${grid['between-xs']}`}>
          <div className={`${grid['col-lg-1']}`}>
            <img src={logo} className={`${styles.logo}`} />
          </div>
          <div className={`${grid['col-lg-11']}`}>
            <PrivateWrapper>
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
            </PrivateWrapper>
            {shouldShowActionButton() && <Link className={styles.actionButton} to='/'><ActionButton>{props.t('Use Lisk-App')}</ActionButton></Link>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
