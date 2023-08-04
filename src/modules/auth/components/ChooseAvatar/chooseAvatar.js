import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import WalletVisual from '@wallet/components/walletVisual';
import registerStyles from '../Signup/register.css';
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
    return selected === address ? styles.selected : (previous === address && styles.deselect) || '';
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
    const { t, handleSelectAvatar, accounts, selected } = this.props;
    const { deselect } = this.state;

    return (
      <>
        <div className={registerStyles.titleHolder}>
          <h1 className={styles.title}>{t('Choose your avatar')}</h1>
          <p>{t('This avatar will be linked to your new Lisk address.')}</p>
        </div>
        <div
          ref={this.setWrapperRef}
          className={`${styles.avatarsHolder} ${
            selected.address ? styles.avatarSelected : ''
          } choose-avatar`}
        >
          {accounts.map((account, key) => (
            <span
              className={this.getAvatarAnimationClassName({
                address: account.address,
                selected: selected.address,
                previous: deselect.address,
              })}
              onClick={() => handleSelectAvatar(account)}
              key={key}
            >
              <WalletVisual address={account.address} size={64} />
            </span>
          ))}
        </div>
        <div className={`${registerStyles.buttonsHolder} ${styles.buttons}`}>
          <Link
            className={`${registerStyles.button} ${registerStyles.backButton}`}
            to={routes.addAccountOptions.path}
          >
            <TertiaryButton>{t('Go back')}</TertiaryButton>
          </Link>
          <span className={`${registerStyles.button}`}>
            <PrimaryButton
              className={`${registerStyles.continueBtn} get-passphrase-button`}
              onClick={this.handleNextStep}
            >
              {t('Continue')}
            </PrimaryButton>
          </span>
        </div>
      </>
    );
  }
}

export default withTranslation()(ChooseAvatar);
