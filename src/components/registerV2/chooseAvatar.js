import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import styles from './registerV2.css';

class ChooseAvatar extends React.Component {
  constructor() {
    super();

    this.state = {
      addresses: [],
    };
  }

  componentDidMount() {
    /* istanbul ignore next */
    const crypotObj = window.crypto || window.msCrypto;
    const passphrases = [...Array(5)].map(() =>
      generatePassphrase({
        seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
      }));
    const addresses = passphrases.map(pass => extractAddress(pass));
    this.setState({
      addresses,
    });
  }

  render() {
    const {
      t, handleSelectAvatar, selected,
    } = this.props;
    const { addresses } = this.state;
    return (
      <React.Fragment>
        <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
          <h1>{t('Choose your Avatar')}</h1>
          <p>{
            t('Each Avatar is a visual representation of the address, making it unique.')
          }</p>
        </div>
        <div className={`${styles.avatarsHolder} ${styles.animate}`}>
          {
            addresses.map((address, key) => (
              <span
                className={selected === address ? styles.selected : ''}
                onClick={() => handleSelectAvatar(address) }
                key={key}>
                <AccountVisual
                  address={address}
                  size={56}
                  />
              </span>
            ))
          }
        </div>

        <div className={`${styles.buttonsHolder} ${grid.row}`}>
          <Link className={`${styles.button} ${grid['col-xs-4']}`} to={routes.splashscreen.path}>
            <SecondaryButtonV2>
              <FontIcon className={styles.icon}>arrow-left</FontIcon>
              {t('Go Back')}
            </SecondaryButtonV2>
          </Link>
          <span className={`${styles.button} ${grid['col-xs-4']}`}>
            <PrimaryButtonV2 disabled={!selected}>
              {t('Confirm')}
              <FontIcon className={styles.icon}>arrow-right</FontIcon>
            </PrimaryButtonV2>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(ChooseAvatar);
