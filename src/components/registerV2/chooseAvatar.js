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
import registerStyles from './registerV2.css';
import styles from './chooseAvatar.css';
import avatar from '../../assets/images/icons-v2/avatar.svg';

class ChooseAvatar extends React.Component {
  constructor() {
    super();

    this.state = {
      addresses: [],
    };

    this.getAvatarAnimationClassName = this.getAvatarAnimationClassName.bind(this);
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

  // eslint-disable-next-line class-methods-use-this
  getAvatarAnimationClassName(address, selected, previousSelected) {
    return selected === address
      ? styles.selected
      : (previousSelected === address && styles.unselected) || '';
  }

  render() {
    const {
      t, handleSelectAvatar, selected, previousAddress,
    } = this.props;
    const { addresses } = this.state;

    return (
      <React.Fragment>
        <div className={`${registerStyles.titleHolder} ${grid['col-xs-10']}`}>
          <h1>
            <img src={avatar} />
            {t('Choose your Avatar')}
          </h1>
          <p>{
            t('Each Avatar is a visual representation of the address, making it unique.')
          }</p>
        </div>
        <div className={`
          ${styles.avatarsHolder} ${styles.animate} ${grid['col-xs-10']}
          ${(selected && styles.avatarSelected) || ''}
        `}>
          {
            addresses.map((address, key) => (
              <span
                className={ this.getAvatarAnimationClassName(address, selected, previousAddress) }
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

        <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
          <Link className={`${registerStyles.button} ${grid['col-xs-4']}`} to={routes.splashscreen.path}>
            <SecondaryButtonV2>
              <FontIcon className={registerStyles.icon}>arrow-left</FontIcon>
              {t('Go Back')}
            </SecondaryButtonV2>
          </Link>
          <span className={`${registerStyles.button} ${grid['col-xs-4']}`}>
            <PrimaryButtonV2 disabled={!selected}>
              {t('Confirm')}
              <FontIcon className={registerStyles.icon}>arrow-right</FontIcon>
            </PrimaryButtonV2>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(ChooseAvatar);
