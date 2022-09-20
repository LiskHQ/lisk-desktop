import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import routes from 'src/routes/routes';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Illustration from 'src/modules/common/components/illustration';
import styles from './accountCreationTips.css';

const AccountCreationTips = () => {
  const { t } = useTranslation();

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Get started')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.container} coin-container`}>
        <ul className={styles.tips}>
          <li>
            <span className={styles.number}>01</span>
            <div className={styles.tip}>
              <h5>{t('Your Lisk address')}</h5>
              <span>{t('The address is unique and can’t be changed. It’s yours. Find it in your home.')}</span>
            </div>
          </li>
          <li>
            <span className={styles.number}>02</span>
            <div className={styles.tip}>
              <h5>{t('A unique avatar')}</h5>
              <span>{t('The Avatar represents the address, making it easy to recognize.')}</span>
            </div>
          </li>
          <li>
            <span className={styles.number}>03</span>
            <div className={styles.tip}>
              <h5>{t('Manage your account')}</h5>
              <span>{t('Create or backup accounts to manage more than one account securely in your wallet.')}</span>
            </div>
          </li>
        </ul>
        <footer className={styles.actions}>
          <Link
            to={routes.register.path}
          >
            <PrimaryButton>
              {t('Create an account')}
            </PrimaryButton>
          </Link>
          <Link
            to={routes.addAccount.path}
          >
            <SecondaryButton>
              {t('Add an account')}
            </SecondaryButton>
          </Link>
        </footer>
        <Illustration name="eclipsedHumanoid" className={styles.illustration} />
      </BoxContent>
    </Box>
  );
};

export default AccountCreationTips;
