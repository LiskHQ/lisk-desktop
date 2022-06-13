import React from 'react';
import { withTranslation } from 'react-i18next';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './TransactionInfo.css';
import CustomTransactionInfo from './CustomTransactionInfo';

const Members = ({ members, t }) => (
  <section>
    <label>{t('Members')}</label>
    <div className={styles.membersContainer}>
      {members.map((member, i) => (
        <div
          className={styles.memberInfo}
          key={i + 1}
        >
          <WalletVisual address={member.address} />
          <div className={styles.memberDetails}>
            <p className={styles.memberTitle}>
              {member.address}
              <span>{`(${member.isMandatory ? t('Mandatory') : t('Optional')})`}</span>
            </p>
            <p className={styles.memberKey}>{member.publicKey}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const TransactionInfo = ({
  isMultisignature, t, rawTx, account, date, token, summaryInfo,
}) => (
  <>
    <CustomTransactionInfo
      t={t}
      transaction={rawTx}
      account={account}
      token={token}
      summaryInfo={summaryInfo}
    />
    {isMultisignature && (
      <>
        <section className={styles.msignRow}>
          <div className={styles.col}>
            <label>{t('Required signatures')}</label>
            <label>
              {account.keys.numberOfSignatures}
            </label>
          </div>
          <div className={styles.col}>
            <label>{t('Transaction fee')}</label>
            <label className="fee">
              <TokenAmount
                convert={false}
                val={rawTx.fee}
                token={token}
              />
            </label>
          </div>
        </section>
        <section className={styles.msignRow}>
          <div className={styles.col}>
            <label>{t('Date')}</label>
            <label>
              {date || '-'}
            </label>
          </div>
          <div className={styles.col}>
            <label>{t('Nonce')}</label>
            <label>
              {Number(rawTx.nonce)}
            </label>
          </div>
        </section>
        <Members t={t} members={account.keys.members} />
      </>
    )}
  </>
);

export default withTranslation()(TransactionInfo);
