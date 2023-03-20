import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import routes from 'src/routes/routes';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import styles from './accountCreationTips.css';

const AccountCreationTips = () => {
  const { t } = useTranslation();

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>
          <span>{t('Welcome to')}</span>
          &nbsp;
          <span className={styles.name}>{t('Lisk')}</span>
        </h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} coin-container`}>
        <header>
          <h5>{t('Don’t have a Lisk account yet?')}</h5>
          <p>
            {t(
              'If you are new to Lisk ecosystem, create an account by clicking on the “Create account”. If you have an account, then add it to your wallet by clicking on “Add account”.'
            )}
          </p>
          <div className={styles.actions}>
            <Link to={routes.register.path} data-testid="link">
              <PrimaryButton>{t('Create account')}</PrimaryButton>
            </Link>
            <Link to={routes.addAccountOptions.path} data-testid="link">
              <SecondaryButton>{t('Add account')}</SecondaryButton>
            </Link>
          </div>
        </header>
        <ul className={styles.tips}>
          <li>
            <h5>{t('Why do I need an account?')}</h5>
          </li>
          <li>
            <span className={styles.number}>01</span>
            <div className={styles.tip}>
              <h5>{t('Send and request tokens')}</h5>
              <span>
                {t(
                  'Creating an account is your first step in benefiting from blockchain technology. With your account, you can securely send and request tokens.'
                )}
              </span>
            </div>
          </li>
          <li>
            <span className={styles.number}>02</span>
            <div className={styles.tip}>
              <h5>{t('Participate in blockchain governance')}</h5>
              <span>
                {t(
                  'Stake for your trusted validator or become a validator to secure the blockchain.'
                )}
              </span>
            </div>
          </li>
          <li>
            <span className={styles.number}>03</span>
            <div className={styles.tip}>
              <h5>{t('Monitor the Blockchain')}</h5>
              <span>
                {t(
                  'You can explore the decentralized network, monitor wallet activities, blocks, transactions, and inspect validators.'
                )}
              </span>
            </div>
          </li>
        </ul>
      </BoxContent>
    </Box>
  );
};

export default AccountCreationTips;
