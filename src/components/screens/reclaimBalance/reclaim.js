import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CopyToClipboard from '@toolbox/copyToClipboard';
import Tooltip from '@toolbox/tooltip/tooltip';
import Icon from '@toolbox/icon';
import { PrimaryButton } from '@toolbox/buttons';
import DialogLink from '@toolbox/dialog/link';
import LiskAmount from '@shared/liskAmount';
import AccountVisualWithAddress from '@shared/accountVisualWithAddress';
import { getActiveTokenAccount } from '@utils/account';
import { fromRawLsk } from '@utils/lsk';
import styles from './reclaim.css';

const Reclaim = ({ t }) => {
  const account = useSelector(state => getActiveTokenAccount(state));
  const rawBalance = parseInt(account.token?.balance, 10);
  const hasEnoughtBalance = rawBalance > 1000000;

  return (
    <div className={styles.container}>
      <h4>{t('Update to your new account')}</h4>
      <p>
        {t('Your tokens and passphrase are safe.')}
        <br />
        {t('We kindly ask you to transfer your balance to the new account.')}
      </p>
      <section className={styles.box}>
        <div className={styles.accountContainer}>
          <div>
            <h5>{t('Old account')}</h5>
            <div className={styles.addressContainer}>
              <AccountVisualWithAddress address={account.legacy?.address} />
              <CopyToClipboard type="icon" value={account.legacy?.address} />
            </div>
            <p>
              <span>{`${t('Balance')}: `}</span>
              <LiskAmount val={fromRawLsk(parseInt(account.legacy?.balance, 10))} token="LSK" />
            </p>
          </div>
          <Icon name="arrowRightWithStroke" />
          <div>
            <h5>{t('New account')}</h5>
            <div className={styles.addressContainer}>
              <AccountVisualWithAddress address={account.summary?.address} />
              <CopyToClipboard type="icon" value={account.summary?.address} />
            </div>
            <p>
              <span>{`${t('Balance')}: `}</span>
              <LiskAmount val={rawBalance} token="LSK" />
            </p>
          </div>
        </div>
        <div>
          <h5 className={styles.listHeading}>{t('You will be able to:')}</h5>
          <ul className={styles.list}>
            <li>{t('Use your old passphrase ')}</li>
            <li>{t('Access your old address and transaction history')}</li>
          </ul>
        </div>
      </section>
      <section className={styles.box}>
        <h5 className={styles.listHeading}>{t('All you need to do:')}</h5>
        <ul className={styles.list}>
          <li className={`${styles.step} ${hasEnoughtBalance ? styles.check : styles.green}`}>
            <p>
              {t('Deposit at least 0.01 LSK to your new account')}
              <Tooltip position="right" size="m">
                <>
                  <p>
                    {t('Since you want to reclaim your LSK on the new blockchain, you need to pay the fee from your new account.')}
                  </p>
                  <br />
                  <p>
                    {t('Hence your LSK in your old account can not be used to pay the fee. Read more')}
                  </p>
                  <br />
                  <p className={styles.link}>
                    {t('Read more')}
                  </p>
                </>
              </Tooltip>
              <br />
              {!hasEnoughtBalance && (
                <>
                  <span>
                    {t('An initial one-time transfer fee will be deducted from the new account.')}
                  </span>
                  <br />
                  <span>
                    {t('Please use ')}
                    <span className={styles.link}>{t('external services')}</span>
                    {t(' to deposit LSK.')}
                  </span>
                </>
              )}
            </p>
          </li>
          <li className={`${styles.step} ${hasEnoughtBalance && styles.green}`}>
            <p>
              {t('Send a reclaim transaction')}
              <br />
              <span>
                {t('Once you have enough tokens on your new account you will be able to send a transaction.')}
              </span>
            </p>
          </li>
        </ul>
      </section>
      <DialogLink component="balanceReclaim">
        <PrimaryButton
          className={styles.button}
          disabled={!hasEnoughtBalance}
        >
            {t('Continue')}
        </PrimaryButton>
      </DialogLink>
    </div>
  );
};

export default withTranslation()(Reclaim);
