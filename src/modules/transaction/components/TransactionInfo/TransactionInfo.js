import React from 'react';
import { withTranslation } from 'react-i18next';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import Icon from '@theme/Icon';
import styles from './TransactionInfo.css';
import CustomTransactionInfo from './CustomTransactionInfo';
import { joinModuleAndCommand } from '../../utils';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';

const Members = ({ members, t, isRegisterMultisignature }) => (
  <section>
    <label>{isRegisterMultisignature ? t('Existing members') : t('Members')}</label>
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
  nonceWarning,
  canResetNonce,
  resetTxNonce,
}) => {
  const isRegisterMultisignature =
    joinModuleAndCommand(transactionJSON) === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

  return (
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
              <label>
                {t('Nonce')}{' '}
                {nonceWarning && <Icon name="warningYellow" className={styles.warning} />}
                {canResetNonce && (
                  <Icon name="refresh" className={styles.reset} onClick={resetTxNonce} />
                )}
              </label>
              <label>{BigInt(transactionJSON.nonce).toString()}</label>
            </div>
          </section>
          <Members
            t={t}
            isRegisterMultisignature={isRegisterMultisignature}
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
};

export default withTranslation()(TransactionInfo);
