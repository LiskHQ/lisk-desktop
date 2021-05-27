import React from 'react';
import withData from '@utils/withData';
import { withTranslation } from 'react-i18next';
import { getAccounts } from '@api/account';
import AccountVisual from '@toolbox/accountVisual';
import LiskAmount from '@shared/liskAmount';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import VoteDelegate from './voteDelegate';
import Reclaim from './reclaim';
import Send from './send';
import RegisterDelegate from './registerDelegate';
import UnlockBalance from './unlockBalance';
import RegisterMultisignatureGroup from './registerMultisignatureGroup';
import styles from './transactionInfo.css';

const CustomTransactionInfo = ({ moduleAssetId, ...restProps }) => {
  switch (moduleAssetId) {
    case MODULE_ASSETS_NAME_ID_MAP.reclaimLSK: return <Reclaim {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.registerDelegate: return <RegisterDelegate {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.transfer: return <Send {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.voteDelegate: return <VoteDelegate {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.unlockToken: return <UnlockBalance {...restProps} />;
    case MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup:
      return <RegisterMultisignatureGroup {...restProps} />;
    default:
      return null;
  }
};

const Members = withData({
  accounts: {
    apiUtil: (network, { token, ...params }) => getAccounts({ network, params }, token),
    defaultData: [],
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      publicKeyList: [...props.keys.mandatoryKeys, ...props.keys.optionalKeys],
      network: state.network,
    }),
    autoload: true,
    transformResponse: response => response.data,
  },
})(({ accounts, keys, t }) => (
  <section>
    <label>{t('Members')}</label>
    <div className={styles.membersContainer}>
      {accounts.data?.map((account, i) => (
        <div
          className={styles.memberInfo}
          key={i + 1}
        >
          <AccountVisual address={account.summary.address} />
          <div className={styles.memberDetails}>
            <p className={styles.memberTitle}>
              {account.summary.username || account.summary.address}
              <span>{(i + 1) > keys.numberOfSignatures ? t('Optional') : t('Mandatory')}</span>
            </p>
            <p className={styles.memberKey}>{account.summary.publicKey}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
));

const TransactionInfo = ({
  isMultisignature, t, transaction, date, account, ...restProps
}) => (
  <>
    <CustomTransactionInfo
      t={t}
      transaction={transaction}
      account={account}
      {...restProps}
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
            <label>
              <LiskAmount
                val={restProps.fee || transaction.fee}
                token={tokenMap.LSK.key}
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
              {Number(transaction.nonce)}
            </label>
          </div>
        </section>
        <Members t={t} keys={{ numberOfSignatures: 1, mandatoryKeys: ['1849c3a63b7c336fec832fbf394457e86b9c3b2ceef6e1029fd4c0c35b16ed88', '096c6c53fa947754492981047628fc6ecc21808940ec5b7a0818d33f78495311'], optionalKeys: ['80e295a2d700934ba50ba14fbdf6aebce6f226915fa105ed0a6d202ba1c464a0', '820e421aaaacd58db8aab4d5e01f9ad9e37abfa57ed58ee6ad23b4b908bda5b0', '5251831e01ce3cdaae44ca542c22aac0ac43632cc8245ae1248f132b442ab540'] }} />
      </>
    )}
  </>
);

export default withTranslation()(TransactionInfo);
