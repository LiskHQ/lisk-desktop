import Icon from '@theme/Icon';
import React from 'react';
import { usePosConstants, useSentStakes } from '@pos/validator/hooks/queries';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './StakesCount.css'

const StakesCount = ({ className, sentStakesQueryConfig, hideIcon }) => {
  const { t } = useTranslation();
  const { data: sentStakes } = useSentStakes(sentStakesQueryConfig);
  const { data: posConstants } = usePosConstants();
  const stakingAvailable = (posConstants?.data?.maxNumberSentStakes - sentStakes?.meta?.count) || '0';

  return (
    <div className={classNames(styles.stakesCount, className)}>
      {
        !hideIcon && <Icon name="stakingQueueActive" />
      }
      <span>{stakingAvailable}</span>
      /10 {t('{{stake}} still available in your account', { stake: stakingAvailable > 1 ? 'stakes' : 'stake' })}
    </div>
  )
}

export default StakesCount;