import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from 'react-countdown-now';
import { FontIcon } from '../fontIcon';
import AccountVisual from '../accountVisual';
import SearchBar from '../searchBar';
import CountDownTemplate from './countDownTemplate';
import CopyToClipboard from '../copyToClipboard';
import LiskAmount from '../liskAmount';
import Account from '../account';
import logo from '../../assets/images/logo-beta.svg';
import PrivateWrapper from '../privateWrapper';
import { ActionButton } from './../toolbox/buttons/button';
import styles from './header.css';
import { step } from './../app/onboardingStyles';
import routes from './../../constants/routes';

class Header extends React.Component {
  componentDidMount() {
    this.props.addSteps([
      {
        title: '10 minutes session timeout',
        text: 'After 10 minutes of inactivity time we log you out to prevent others from accessing your Lisk ID. ' +
        'Will be reset as soon you get active. \n' +
        'Or you reset timer by clicking on the clock symbol.',
        selector: '.account-timer',
        position: 'bottom',
        style: step,
      },
    ]);
  }

  shouldShowActionButton() {
    const { pathname } = this.props.location;
    return !this.props.isAuthenticated
      && !this.props.account.loading
      && pathname !== routes.login.path
      && ![routes.register.path, routes.addAccount.path]
        .some(el => pathname.includes(el));
  }

  shouldShowSearchBar() {
    const { pathname } = this.props.location;
    return ![`${routes.explorer.path}${routes.search.path}`, routes.register.path, routes.addAccount.path]
      .some(el => pathname.includes(el)) && pathname !== routes.login.path;
  }

  render() {
    return (
      <header className={`${styles.wrapper} mainHeader`}>
        <div className={`${styles.loginInfo}`}>
          <div>
            <div style={{ display: 'inline-block', float: 'left' }}>
              <img src={logo} className={`${styles.logo}`}/>
            </div>
            <div style={{ display: 'inline-block' }}>
              <PrivateWrapper>
                <div className={`account ${styles.account}`}>
                  <div className={styles.information} align="right">
                    <div className={styles.balance}>
                      <LiskAmount val={this.props.account.balance}/>
                      <small> LSK</small>
                    </div>
                    <CopyToClipboard value={this.props.account.address} className={`${styles.address} account-information-address`}/>
                    {this.props.autoLog
                      ? <div className={`${styles.timer} account-timer`}>
                        {((this.props.account.expireTime &&
                          this.props.account.expireTime !== 0) &&
                          this.props.account.passphrase)
                          ?
                          <div>
                            {this.props.t('Address timeout in')} <i> </i>
                            <Countdown
                              date={this.props.account.expireTime}
                              renderer={CountDownTemplate}
                              onComplete={() => {
                                this.props.removeSavedAccountPassphrase();
                              }
                              }
                            />
                          </div>
                          : <div></div>}
                      </div>
                      : <div className={`${styles.timer} account-timer`}>
                        {this.props.account.passphrase ? '' : <span>
                          <FontIcon value='locked' className={styles.lock}/> {this.props.t('Account locked!')}
                        </span>
                        }
                      </div>
                    }
                  </div>
                  <Link to={`${routes.accounts.path}`} className={styles.avatar}>
                    <AccountVisual
                      address={this.props.account.address}
                      size={69} sizeS={40}
                    />
                  </Link>
                  <div className={styles.menu}>
                    <figure className={styles.iconCircle}>
                      <Link to={`${routes.accounts.path}`} className={`${styles.link} saved-accounts`}>
                        <FontIcon value='more'/>
                      </Link>
                    </figure>
                  </div>
                </div>
              </PrivateWrapper>
              { this.shouldShowActionButton() &&
                <Link className={styles.login} to='/'>
                  <ActionButton className={styles.button}>{this.props.t('Sign in')}</ActionButton>
                  <span className={styles.link}>
                    {this.props.t('Sign in')} <FontIcon value='arrow-right'/>
                  </span>
                </Link>
              }
            </div>
          </div>
        </div>
        <div className={`${styles.searchBar}`}>
          {this.shouldShowSearchBar() && <SearchBar/>}
          {this.props.account.loading ?
            null :
            <Account peers={this.props.peers} t={this.props.t}/>}
        </div>
      </header>
    );
  }
}


export default Header;
