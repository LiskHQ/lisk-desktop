import React from 'react';
import usePosToken from 'src/modules/pos/validator/hooks/usePosToken';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import Tooltip from 'src/theme/Tooltip';
import StakeItem from '../StakeItem';
import styles from '../TransactionInfo/TransactionInfo.css'; // @todo create dedicated css file for this component

const ItemList = ({ items, heading, rewards }) => {
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
            reward={rewards[address]?.amount}
          />
        ))}
      </div>
    </div>
  );
};

const InfoColumn = ({ title, children, className, toolTipText }) => (
  <div className={`${styles.infoColumn} ${className}`}>
    <span className={styles.infoTitle}>
      {title}
      {!!toolTipText && (
        <Tooltip position="top" indent>
          <p>{toolTipText}</p>
        </Tooltip>
      )}
    </span>
    <span className={styles.infoValue}>{children}</span>
  </div>
);

const StakeValidator = ({ t, account, summaryInfo, formProps }) => {
  const { token } = usePosToken();
  const addedLength = Object.keys(summaryInfo.added).length;
  const editedLength = Object.keys(summaryInfo.edited).length;
  const removedLength = Object.keys(summaryInfo.removed).length;
  const sentStakes = account?.pos?.sentStakes?.length ?? 0;
  const rewards = formProps.rewards;

  return (
    <>
      {!!addedLength && (
        <ItemList rewards={rewards} heading={t('Added stakes')} items={summaryInfo.added} />
      )}
      {!!editedLength && (
        <ItemList rewards={rewards} heading={t('Changed stakes')} items={summaryInfo.edited} />
      )}
      {!!removedLength && (
        <ItemList rewards={rewards} heading={t('Removed stakes')} items={summaryInfo.removed} />
      )}
      <div className={styles.infoContainer}>
        <InfoColumn title={t('Total stakes after confirmation')}>
          {`${sentStakes + addedLength - removedLength}/10`}
        </InfoColumn>
        {!!rewards.total && (
          <InfoColumn
            title={t('Total rewards')}
            toolTipText={t(
              'Total rewards credited to your account in effective to changes in stakes.'
            )}
          >
            <span className={styles.totalReward}>
              <TokenAmount val={rewards.total.toString()} token={token} />
            </span>
          </InfoColumn>
        )}
      </div>
    </>
  );
};

export default StakeValidator;
