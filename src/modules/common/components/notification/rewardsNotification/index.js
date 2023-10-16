import React, { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';
import DialogLink from '@theme/dialog/link';
import styles from './styles.css';

const RewardsNotification = () => {
  const {
    appEvents: {
      transactions: { rewards },
    },
  } = useContext(ApplicationBootstrapContext);
  const notification = rewards.length && BigInt(rewards[0]?.reward || 0) > BigInt(0);

  useEffect(() => {
    if (notification) {
      toast.info(
        <div className={styles.rewardInfo}>
          <p>You have an unclaimed reward for your stakes.</p>
          <DialogLink component="claimRewardsView" className={styles.rewardLink}>
            Claim rewards
          </DialogLink>
        </div>,
        {
          autoClose: false,
          draggable: false,
          closeButton: <span className={`${styles.closeBtn} dialog-close-button`} />,
          toastId: 'claimRewards',
        }
      );
    }
  }, [rewards]);

  return null;
};

export default RewardsNotification;
