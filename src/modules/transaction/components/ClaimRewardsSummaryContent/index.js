import React from 'react';
import { useCurrentAccount } from '@account/hooks';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import styles from './ClaimRewardsSummaryContent.css';

const ClaimRewardsSummaryContent = ({ t }) => {
  const [
    {
      metadata: { address },
    },
  ] = useCurrentAccount();
  const { data: rewardsClaimable } = useRewardsClaimable({ config: { params: { address } } });

  return (
    <div className={styles.ClaimRewardsSummaryContent}>
      <h2 className={styles.title}>{t('Claim reward')}</h2>
      <div className={styles.rewardListing}>
        {rewardsClaimable.data?.map((rewardClaimable, index) => {
          const { reward, symbol, denomUnits, displayDenom } = rewardClaimable;
          const denom = denomUnits?.find((denomUnit) => denomUnit.denom === displayDenom);

          return (
            <div key={index} className={styles.rewardLabel}>
              {`${parseInt(reward, denom)} ${symbol}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClaimRewardsSummaryContent;
