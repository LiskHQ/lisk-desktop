import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import VoteWeight from '../../../shared/voteWeight';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import { tokenMap } from '../../../../constants/tokens';
import LiskAmount from '../../../shared/liskAmount';
import styles from './delegateProfile.css';

const delegateProfile = ({
  delegate, lastBlock, txDelegateRegister, address, nextForgers, t = str => str,
}) => {
  const { apiVersion } = useSelector(state => state.network.networks.LSK);
  useEffect(() => {
    delegate.loadData();
    txDelegateRegister.loadData();
  }, [address]);

  if (!delegate.data) return null;

  useEffect(() => {
    if (delegate.data.username) {
      lastBlock.loadData({
        generatorPublicKey: delegate.data.account.publicKey,
        limit: 1,
      });
    }
  }, [delegate.data.username]);

  const isActive = nextForgers.data.filter(item =>
    (item.username === delegate.data.username)).length;

  return (
    <Box>
      <BoxHeader>
        <h1>{t('Delegate stats')}</h1>
      </BoxHeader>
      <BoxContent className={styles.wrapper}>
        <ul className={styles.delegateStats}>
          <li className={apiVersion === '2' ? '' : 'hidden'}>
            <span className={styles.label}>
              {t('Rank')}
            </span>
            <span className={`${styles.rank} rank`}>
              {`#${delegate.data.rank}`}
            </span>
          </li>
          <li className="status">
            <span className={styles.label}>
              {t('Status')}
            </span>
            <span className={styles.status}>
              {isActive ? t('Active') : t('Standby')}
            </span>
          </li>
          <li className="delegate-since">
            <span className={styles.label}>{t('Delegate since')}</span>
            {
              txDelegateRegister.data ? (
                <DateTimeFromTimestamp
                  fulltime
                  className="date"
                  time={txDelegateRegister.data}
                  token="LSK"
                />
              ) : '-'
            }
          </li>
          <li className="vote">
            <span className={styles.label}>{t('Vote weight')}</span>
            <VoteWeight data={delegate.data} />
          </li>
          <li className="approval">
            <span className={styles.label}>{t('Approval')}</span>
            {`${formatAmountBasedOnLocale({ value: delegate.data.approval })}%`}
          </li>
          <li className="productivity">
            <span className={styles.label}>{t('Productivity')}</span>
            {`${formatAmountBasedOnLocale({ value: delegate.data.productivity })}%` }
          </li>
          <li className="blocks">
            <span className={styles.label}>{t('Blocks forged')}</span>
            {`${delegate.data.producedBlocks} (${delegate.data.missedBlocks})`}
          </li>
          <li className="forged">
            <span className={styles.label}>{t('LSK forged')}</span>
            <span>
              <LiskAmount val={delegate.data.rewards} />
              {` ${tokenMap.LSK.key}`}
            </span>
          </li>
          <li className="last-forged">
            <span className={styles.label}>{t('Last Forged Block')}</span>
            {
              typeof lastBlock.data === 'number' ? (
                <DateTimeFromTimestamp
                  fulltime
                  className="date"
                  time={lastBlock.data}
                  token="LSK"
                />
              ) : '-'
            }
          </li>
        </ul>
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(delegateProfile);
