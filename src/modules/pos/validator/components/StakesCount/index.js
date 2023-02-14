import Icon from '@theme/Icon';
import React from 'react';
import { usePosConstants, useSentStakes } from '@pos/validator/hooks/queries';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './StakesCount.css';

const StakesCount = ({ className, address, hideIcon }) => {
  const { t } = useTranslation();
  const { data: sentStakes } = useSentStakes({ config: { params: { address } } });
  const { data: posConstants } = usePosConstants();
  const availableStakes = (posConstants?.data?.maxNumberSentStakes - sentStakes?.meta?.count) || '0';

  return (
    <div className={classNames(styles.stakesCount, className)}>
      {!hideIcon && <Icon className={styles.stakingQueueActive}  name="stakingQueueActive" />}
      <span className={styles.availableStakes}>{availableStakes}</span>
      /10{' '}
      {t('{{stake}} still available in your account', {
        stake: availableStakes > 1 ? 'stakes' : 'stake',
      })}
    </div>
  );
};

export default StakesCount;
