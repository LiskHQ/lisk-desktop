import React from 'react';
import { withTranslation } from 'react-i18next';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import styles from './TransactionInfo.css';
import CustomTransactionInfo from './CustomTransactionInfo';

const Members = ({ members, t }) => (
  <section>
    <label>{t('Members')}</label>
    <div className={styles.membersContainer}>
      {members.map((member, i) => (
        <div className={styles.memberInfo} key={i + 1}>
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
  isMultisignature,
  t,
  formProps,
  transactionJSON,
  account,
  date,
  token,
  summaryInfo,
}) => (
  <>
    <CustomTransactionInfo
      t={t}
      formProps={formProps}
      transactionJSON={transactionJSON}
      account={account}
      token={token}
      summaryInfo={summaryInfo}
    />
    {isMultisignature && (
      <>
        <section className={styles.msignRow}>
          <div className={styles.col}>
            <label>{t('Required signatures')}</label>
            <label>{account.keys.numberOfSignatures}</label>
          </div>
          <div className={styles.col}>
            <label>{t('Transaction fee')}</label>
            <label className="fee">
              <TokenAmount val={transactionJSON.fee} token={formProps.fields.token} />
            </label>
          </div>
        </section>
        <section className={styles.msignRow}>
          <div className={styles.col}>
            <label>{t('Date')}</label>
            <label>{date || '-'}</label>
          </div>
          <div className={styles.col}>
            <label>{t('Nonce')}</label>
            <label>{BigInt(transactionJSON.nonce).toString()}</label>
          </div>
        </section>
        <Members
          t={t}
          members={[
            ...account.keys.mandatoryKeys.map((publicKey) => ({
              publicKey,
              isMandatory: true,
              address: extractAddressFromPublicKey(publicKey),
            })),
            ...account.keys.optionalKeys.map((publicKey) => ({
              publicKey,
              isMandatory: false,
              address: extractAddressFromPublicKey(publicKey),
            })),
          ]}
        />
      </>
    )}
  </>
);

export default withTranslation()(TransactionInfo);
