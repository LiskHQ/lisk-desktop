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
import logo from '../../assets/images/Lisk-Logo.svg';
import PrivateWrapper from '../privateWrapper';
import { ActionButton } from './../toolbox/buttons/button';
import styles from './header.css';
import CustomCountDown from './customCountDown';
import Options from '../dialog/options';
import routes from './../../constants/routes';

class Header extends React.Component {
  /* istanbul ignore next */
  logOut() {
    this.props.logOut();
    this.props.closeDialog();
    this.props.history.replace(`${routes.dashboard.path}`);
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
    return ![routes.register.path, routes.addAccount.path]
      .some(el => pathname.includes(el));
  }

  openLogoutDialog() {
    this.props.setActiveDialog({
      childComponent: Options,
      childComponentProps: {
        title: this.props.t('Logout'),
        text: this.props.t('After logging out of your account you will be able to access the Dashboard, Settings and Search.'),
        firstButton: {
          text: this.props.t('Cancel'),
          onClickHandler: this.props.closeDialog,
        },
        secondButton: {
          text: this.props.t('Logout'),
          onClickHandler: this.logOut.bind(this),
        },
      },
    });
  }

  render() {
    const { peers, t, showNetworkIndicator } = this.props;
    return (
      <header className={`${styles.wrapper} mainHeader`}>
        <div>
          <div className={`${styles.searchBar}`}>
            {this.shouldShowSearchBar() && <SearchBar/>}
          </div>
          {this.props.account.loading
                ? null
                : <Account {...{ peers, t, showNetworkIndicator }} />}
        </div>

        <div className={`${styles.loginInfo}`}>
          <div>
            <div style={{ display: 'inline-block', float: 'left' }}>
              <img src={logo} className={`${styles.logo}`}/>
            </div>
            <div style={{ display: 'inline-block' }}>
              <PrivateWrapper>
                <div className={`account ${styles.account}`}>
                  <div className={styles.information} align="right">
                    <div className={`balance ${styles.balance}`}>
                      <LiskAmount val={this.props.account.balance}/>
                      <small> LSK</small>
                    </div>
                    <CopyToClipboard
                      value={this.props.account.address}
                      className={`${styles.address} account-information-address`}
                      copyClassName={styles.copy}
                    />

                    <div className={styles.timer}>
                      {this.props.autoLog
                        ? <div>
                          {((this.props.account.expireTime &&
                            this.props.account.expireTime !== 0) &&
                            this.props.account.passphrase)
                            ? <div className={styles.logoutInfo}>
                              <Countdown
                                date={this.props.account.expireTime}
                                renderer={CountDownTemplate}
                                onComplete={() => {
                                  this.props.logOut();
                                  this.props.history.replace(routes.login.path);
                                }}
                              >
                                <CustomCountDown
                                  closeDialog={this.props.closeDialog}
                                  history={this.props.history}
                                  setActiveDialog={this.props.setActiveDialog}
                                  resetTimer={this.props.resetTimer}
                                  autoLog={this.props.autoLog}
                                  t={this.props.t}
                                />
                              </Countdown>
                            </div>
                            : null
                          }
                        </div>
                        : null
                      }
                      <div
                        className={`${styles.logout} logout`}
                        onClick={() => this.openLogoutDialog() }>
                        <FontIcon value='logout' className={styles.logoutIcon} />
                        {this.props.t('Logout')}
                      </div>
                    </div>
                  </div>
                  <AccountVisual
                    address={this.props.account.address}
                    size={69} sizeS={40}
                  />
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
      </header>
    );
  }
}


export default Header;
