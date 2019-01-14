import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import links from '../../constants/externalLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import HeaderV2 from '../headerV2/headerV2';
import lock from '../../assets/images/icons-v2/lock.svg';
import styles from './loginV2.css';

class LoginV2 extends React.Component {
  constructor() {
    super();

    this.state = {
      showPassphrase: false,
      isValid: false,
    };

    this.handleToggleShowPassphrase = this.handleToggleShowPassphrase.bind(this);
  }

  handleToggleShowPassphrase() {
    const showPassphrase = !this.state.showPassphrase;
    this.setState({ showPassphrase });
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
      <HeaderV2 showSettings={true} showNetwork={true} />
        <div className={`${styles.login} ${grid.row}`}>
          <div
            className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}>

            <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
              <h1>
                <img src={lock} />
                {t('Sign in with a Passphrase')}
              </h1>
              <p>
                {t('New to Lisk?')}
                <Link className={`${styles.link}`}
                  to={routes.registration.path}>
                  {t('Create an Account')}
                </Link>
              </p>
            </div>


            <div className={`${styles.inputsHolder}`}>
              <h2>
                {t('Type or insert your passphrase')}
                <Tooltip
                  className={`${styles.tooltip}`}
                  title={'What is passphrase?'}
                  footer={
                    <a href={links.howToStorePassphrase}
                      rel="noopener noreferrer"
                      target="_blank">
                        {t('Read More')}
                    </a>}>
                  <p>
                    {t('Passphrase is both your login and password combined. ')}
                    {t('You saved your password when registering your account.')}
                  </p>
                  <p>{t('You can use tab or space to go to the next field.')}</p>
                  <p>{t('For longer passphrases, simply paste it in the first input field.')}</p>
                </Tooltip>
              </h2>

              <div className={`${styles.inputs} ${grid.row}`}>
                {[...Array(12)].map((x, i) => (
                  <span key={i} className={`${grid['col-xs-2']}`}>
                    <input placeholder={i + 1} className={i % 2 === 0 ? styles.error : ''}
                      type={this.state.showPassphrase ? 'text' : 'password'} />
                  </span>
                ))}
              </div>

              <label className={`${styles.showPassphrase}`}>
                <input checked={this.state.showPassphrase}
                  type='checkbox' onChange={this.handleToggleShowPassphrase}/>
                <span className={`${styles.fakeCheckbox}`}>
                  <FontIcon className={`${styles.icon}`}>checkmark</FontIcon>
                </span>
                <span className={`${styles.label}`}>{t('Show passphrase')}</span>
              </label>

            </div>

            <div className={`${styles.buttonsHolder} ${grid.row}`}>
              <Link className={`${styles.button} ${grid['col-xs-4']}`} to={routes.splashscreen.path}>
                <SecondaryButtonV2>
                  <FontIcon className={`${styles.icon}`}>arrow-left</FontIcon>
                  {t('Go Back')}
                </SecondaryButtonV2>
              </Link>
              <span className={`${styles.button} ${grid['col-xs-4']}`}>
                <PrimaryButtonV2 disabled={!this.state.isValid}>
                  {t('Confirm')}
                  <FontIcon className={`${styles.icon}`}>arrow-right</FontIcon>
                </PrimaryButtonV2>
              </span>
            </div>

          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(LoginV2);
