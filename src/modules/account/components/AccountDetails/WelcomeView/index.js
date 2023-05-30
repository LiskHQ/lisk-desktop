import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from '@theme/Icon';
import DropdownButton from '@theme/DropdownButton';
import { PrimaryButton } from 'src/theme/buttons';
import stylesPrimaryButton from '@theme/buttons/css/primaryButton.css';
import routes from 'src/routes/routes';
import stylesSecondary from '@theme/buttons/css/secondaryButton.css';
import styles from './WelcomeView.css';

function AccountUniqueValueProposition({ className, valueProposition, bulletPointNr }) {
  const { title, description } = valueProposition;
  const { t } = useTranslation();

  return (
    <div className={classNames(className, styles.accountUniqueValueProposition)}>
      <div className={styles.bulletPointNr}>0{bulletPointNr}</div>
      <h4 className={styles.title}>{t(title)}</h4>
      <p className={styles.description}>{t(description)}</p>
    </div>
  );
}

const accountUniqueValuePropositions = [
  {
    title: 'Send and request tokens',
    description:
      'Creating an account is your first step in benefiting from blockchain technology. With your account, you can securely send and request tokens within and across blockchain applications.',
  },
  {
    title: 'Participate in blockchain governance',
    description:
      'Stake for your trusted validator and earn rewards or become a validator to secure the blockchain network.',
  },
  {
    title: 'Manage blockchain application assets',
    description: 'Send and receive blockchain application assets using your account.',
  },
];

export default function WelcomeView() {
  const { t } = useTranslation();

  return (
    <section className={styles.welcomeView}>
      <header className={styles.welcomeHeader}>
        <div className={styles.logoContainer}>
          <Icon name="liskLogoWhiteNormalized" height={32} />
        </div>
        <h1 className={styles.title}>{t('Welcome to Lisk')}</h1>
        <p className={styles.description}>
          {t(
            'If you are new to Lisk ecosystem, create an account by clicking on the “Create account”. If you have an account, then add it to your wallet by clicking on “Add account”.'
          )}
        </p>
        <div className={styles.actionButtons}>
          <DropdownButton
            className={classNames(styles.dropdownWrapper, 'input-with-dropdown-dropdown')}
            buttonClassName={classNames(
              stylesPrimaryButton.button,
              styles.createAccountBtn,
              styles.inputDropdownButton
            )}
            buttonLabel={
              <span>
                {t('Create account')} <Icon name="arrowWhiteDown" />
              </span>
            }
            size="s"
            ButtonComponent={PrimaryButton}
            align="right"
            showArrow
          >
            <Link to={`${routes.register.path}?strength=${128}`}>12 word passphrase</Link>
            <Link to={`${routes.register.path}?strength=${256}`}>24 word passphrase</Link>
          </DropdownButton>
          <Link
            className={classNames(stylesSecondary.button, styles.addAccountBtn)}
            to={routes.addAccountOptions.path}
          >
            {t('Add account')}
          </Link>
        </div>
      </header>
      <footer className={styles.welcomeFooter}>
        <h2 className={styles.welcomeFooterTitle}>{t('Why do I need an account?')}</h2>
        <div className={styles.accountUniqueValuePropositionListing}>
          {accountUniqueValuePropositions.map((valueProposition, index) => (
            <AccountUniqueValueProposition
              key={index}
              valueProposition={valueProposition}
              bulletPointNr={index + 1}
            />
          ))}
        </div>
      </footer>
    </section>
  );
}
