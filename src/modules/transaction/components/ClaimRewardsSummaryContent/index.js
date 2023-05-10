import React from 'react';
import { useCurrentAccount } from '@account/hooks';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import TokenAmount from '@token/fungible/components/tokenAmount';
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
        {rewardsClaimable.data?.map((rewardClaimable, index) => (
          <div key={index} className={styles.rewardLabel}>
            <TokenAmount val={rewardClaimable.reward} token={rewardClaimable} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimRewardsSummaryContent;
