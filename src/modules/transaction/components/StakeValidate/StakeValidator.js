import React from 'react';
import usePosToken from 'src/modules/pos/validator/hooks/usePosToken';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import StakeItem from '../StakeItem';
import styles from '../TransactionInfo/TransactionInfo.css'; // @todo create dedicated css file for this component

const ItemList = ({ items, heading }) => {
  const { token } = usePosToken();

  return (
    <div className={styles.contentItem}>
      <span className={styles.contentHeading}>{heading}</span>
      <div className={styles.stakeItems}>
        {Object.keys(items).map((address) => (
          <StakeItem
            key={`stake-item-${address}`}
            address={address}
            stake={items[address]}
            title={items[address].name}
            token={token}
          />
        ))}
      </div>
    </div>
  );
};

const InfoColumn = ({ title, children, className }) => (
  <div className={`${styles.infoColumn} ${className}`}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>{children}</span>
  </div>
);

const StakeValidator = ({ t, account, summaryInfo }) => {
  const { token } = usePosToken();
  const addedLength = Object.keys(summaryInfo.added).length;
  const editedLength = Object.keys(summaryInfo.edited).length;
  const removedLength = Object.keys(summaryInfo.removed).length;
  const sentStakes = account?.pos?.sentStakes?.length ?? 0;

  return (
    <>
      {addedLength ? <ItemList heading={t('Added stakes')} items={summaryInfo.added} /> : null}
      {editedLength ? <ItemList heading={t('Changed stakes')} items={summaryInfo.edited} /> : null}
      {removedLength ? (
        <ItemList heading={t('Removed stakes')} items={summaryInfo.removed} />
      ) : null}
      <div className={styles.infoContainer}>
        <InfoColumn title={t('Total stakes after confirmation')}>
          {`${sentStakes + addedLength - removedLength}/10`}
        </InfoColumn>
        <InfoColumn title={t('Total rewards')}>
          <span className={styles.totalReward}>
            <TokenAmount val={200000000} token={token} />
          </span>
        </InfoColumn>
      </div>
    </>
  );
};

export default StakeValidator;
