import React from 'react';
import withData from '@utils/withData';
import { withTranslation } from 'react-i18next';
import { getAccounts } from '@api/account';
import AccountVisual from '@toolbox/accountVisual';
import Converter from '@shared/converter';
import AccountMigration from '@shared/accountMigration';
import LiskAmount from '@shared/liskAmount';
import VoteItem from '@shared/voteItem';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import MultiSignatureReview from '@shared/multiSignatureReview';

import styles from './transactionInfo.css';

const ItemList = ({ items, heading }) => (
  <div className={styles.contentItem}>
    <span className={styles.contentHeading}>{heading}</span>
    <div className={styles.voteItems}>
      {Object.keys(items).map(address => (
        <VoteItem
          key={`vote-item-${address}`}
          address={address}
          vote={items[address]}
          title={items[address].username}
        />
      ))}
    </div>
  </div>
);

const InfoColumn = ({ title, children, className }) => (
  <div className={`${styles.infoColumn} ${className}`}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>
      {children}
    </span>
  </div>
);

const VoteDelegate = ({
  added, edited, removed, fee, t,
}) => {
  const addedLength = Object.keys(added).length;
  const editedLength = Object.keys(edited).length;
  const removedLength = Object.keys(removed).length;

  return (
    <>
      {addedLength ? <ItemList heading={t('Added votes')} items={added} /> : null}
      {editedLength ? <ItemList heading={t('Changed votes')} items={edited} /> : null}
      {removedLength ? <ItemList heading={t('Removed votes')} items={removed} /> : null}
      <div className={styles.infoContainer}>
        <InfoColumn title={t('Total votes after confirmation')} className="total-votes">{`${addedLength + editedLength}/10`}</InfoColumn>
        <InfoColumn title={t('Transaction fee')} className="fee">
          <LiskAmount val={fee} />
        </InfoColumn>
      </div>
    </>
  );
};

const RegisterMultisignatureGroup = ({
  t, members, fee, numberOfSignatures,
}) => (
  <MultiSignatureReview t={t} members={members} fee={fee} numberOfSignatures={numberOfSignatures} />
);

const Reclaim = ({ account, t }) => (
  <>
    <section>
      <AccountMigration account={account.info.LSK} showBalance={false} />
    </section>
    <section>
      <label>{t('Balance to reclaim')}</label>
      <LiskAmount
        val={Number(account.info.LSK.legacy.balance)}
        token={tokenMap.LSK.key}
      />
    </section>
  </>
);

const Send = ({
  fields, amount, token, transaction, t,
}) => {
  console.log(transaction);
  return (
    <>
      <section>
        <label>{t('Recipient')}</label>
        <label className="recipient-value">
          <AccountVisual address={fields.recipient.address} size={25} />
          <label className={`${styles.information} recipient-confirm`}>
            {fields.recipient.title || fields.recipient.address}
          </label>
          { fields.recipient.title ? (
            <span className={styles.secondText}>
              {fields.recipient.address}
            </span>
          ) : null }
        </label>
      </section>
      <section>
        <label>{t('Amount')}</label>
        <label className="amount-summary">
          {`${amount} ${token}`}
          <Converter className={styles.secondText} value={amount} />
        </label>
      </section>
    </>
  );
};

const RegisterDelegate = ({ account, nickname, t }) => (
  <section className="summary-container">
    <label className="nickname-label">{t('Your nickname')}</label>
    <div className={styles.userInformation}>
      <AccountVisual
        className={styles.accountVisual}
        address={account.summary?.address}
        size={25}
      />
      <span className={`${styles.nickname} nickname`}>{nickname}</span>
      <span className={`${styles.address} address`}>{account.summary?.address}</span>
    </div>
  </section>
);

const UnlockBalance = ({ account, t, transaction }) => (
  <>
    <section>
      <label>{t('Sender')}</label>
      <label>
        <AccountVisual address={account.summary.address} size={25} />
        <label>
          {account.summary.address}
        </label>
      </label>
    </section>
    <section className={styles.msignRow}>
      <div className={styles.col}>
        <label>{t('Transaction ID')}</label>
        <label>
          {transaction.id.readInt32LE()}
        </label>
      </div>
      <div className={styles.col}>
        <label>{t('Amount to unlock')}</label>
        <label>
          <LiskAmount
            val={transaction.asset.unlockObjects.reduce(
              (total, { amount }) => total + Number(amount), 0,
            )}
            token={tokenMap.LSK.key}
          />
        </label>
      </div>
    </section>
  </>
);

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
    {accounts.data?.map((account, i) => (
      <div
        className={`${styles.memberInfo} member-info`}
        key={`tx-info-msign-member-${i + 1}.`}
      >
        <AccountVisual address={account.summary.address} />
        <div className={styles.memberDetails}>
          <p className={styles.memberTitle}>
            {account.summary.username || account.summary.address}
            <span>{(i + 1) > keys.numberOfSignatures ? `(${t('Optional')})` : `(${t('Mandatory')})`}</span>
          </p>
          <p className={styles.memberKey}>{account.summary.publicKey}</p>
        </div>
      </div>
    ))}
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
              <LiskAmount val={transaction.fee} token={tokenMap.LSK.key} />
            </label>
          </div>
        </section>
        <section className={styles.msignRow}>
          <div className={styles.col}>
            <label>{t('Date')}</label>
            <label>
              {date}
            </label>
          </div>
          <div className={styles.col}>
            <label>{t('Nonce')}</label>
            <label>
              {Number(transaction.nonce)}
            </label>
          </div>
        </section>
        <Members t={t} keys={{ numberOfSignatures: 1, mandatoryKeys: ['1849c3a63b7c336fec832fbf394457e86b9c3b2ceef6e1029fd4c0c35b16ed88'], optionalKeys: ['80e295a2d700934ba50ba14fbdf6aebce6f226915fa105ed0a6d202ba1c464a0', '820e421aaaacd58db8aab4d5e01f9ad9e37abfa57ed58ee6ad23b4b908bda5b0'] }} />
      </>
    )}
  </>
);

export default withTranslation()(TransactionInfo);
