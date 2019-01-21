import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
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
      deselect: {},
    };

    this.getAvatarAnimationClassName = this.getAvatarAnimationClassName.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getAvatarAnimationClassName({ address, selected, previous }) {
    return selected === address
      ? styles.selected
      : (previous === address && styles.deselect) || '';
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.setState({
        deselect: prevProps.selected,
      });
    }
  }

  render() {
    const {
      t, handleSelectAvatar, accounts, selected, nextStep,
    } = this.props;
    const { deselect } = this.state;

    return (
      <React.Fragment>
        <span className={`${registerStyles.stepsLabel}`}>{t('Step 1 / 4')}</span>
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
          ${styles.avatarsHolder} ${grid['col-xs-10']}
          ${selected.address ? styles.avatarSelected : styles.animate}
          choose-avatar`}>
          {
            accounts.map((account, key) => (
              <span
                className={
                  this.getAvatarAnimationClassName({
                    address: account.address,
                    selected: selected.address,
                    previous: deselect.address,
                  })
                }
                onClick={() => handleSelectAvatar(account)}
                key={key}>
                <AccountVisual
                  address={account.address}
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
            <PrimaryButtonV2
              className={'get-passphrase-button'}
              onClick={() => nextStep({ accounts })}
              disabled={!selected.address}>
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
