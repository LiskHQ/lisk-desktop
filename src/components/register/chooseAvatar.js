import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../constants/routes';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import registerStyles from './register.css';
import styles from './chooseAvatar.css';

class ChooseAvatar extends React.Component {
  constructor() {
    super();

    this.state = {
      deselect: {},
    };

    this.getAvatarAnimationClassName = this.getAvatarAnimationClassName.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
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

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleNextStep() {
    const { accounts, selected, nextStep } = this.props;
    if (selected.address) {
      nextStep({ accounts });
    } else {
      const animateClass = `${styles.animate}`;
      clearTimeout(this.timeout);
      this.wrapperRef.classList.add(animateClass);
      this.timeout = setTimeout(() => this.wrapperRef.classList.remove(animateClass), 1250);
    }
  }

  render() {
    const {
      t, handleSelectAvatar, accounts, selected,
    } = this.props;
    const { deselect } = this.state;

    return (
      <React.Fragment>
        <span className={`${registerStyles.stepsLabel}`}>{t('Step 1 / 4')}</span>
        <div className={`${registerStyles.titleHolder} ${grid['col-xs-10']}`}>
          <h1 className={styles.title}>
            {t('Choose your avatar')}
          </h1>
          <p className={styles.text}>{t('Each avatar is a unique visual representation of your Lisk address.')}</p>
        </div>
        <div
          ref={this.setWrapperRef}
          className={`
          ${styles.avatarsHolder} ${grid['col-xs-10']}
          ${selected.address ? styles.avatarSelected : ''}
          choose-avatar`}
        >
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
                key={key}
              >
                <AccountVisual
                  address={account.address}
                  size={74}
                />
              </span>
            ))
          }
        </div>
        <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
          <Link className={`${registerStyles.button} ${registerStyles.backButton}`} to={routes.splashscreen.path}>
            <TertiaryButtonV2>
              {t('Go back')}
            </TertiaryButtonV2>
          </Link>
          <span className={`${registerStyles.button}`}>
            <PrimaryButtonV2
              className="get-passphrase-button"
              onClick={this.handleNextStep}
            >
              {t('Continue')}
            </PrimaryButtonV2>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(ChooseAvatar);
