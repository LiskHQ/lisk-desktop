import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import VoteWeight from '../voteWeight';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';
import { getUnixTimestampFromValue } from '../../../utils/datetime';
import { tokenMap } from '../../../constants/tokens';
import LiskAmount from '../liskAmount';
import i18n from '../../../i18n';
import styles from './delegateTab.css';

const DelegateTab = ({
  delegate, account, t, nextForgers,
}) => {
  const { apiVersion } = useSelector(state => state.network.networks.LSK);
  moment.locale(i18n.language);
  delegate = {
    ...account.delegate,
    ...delegate.data,
  };
  const timeFromLastBlock = delegate.lastBlock !== '-'
    ? moment(getUnixTimestampFromValue(delegate.lastBlock)).format(t('DD MMM YY, HH:mm'))
    : '-';
  const delegateSince = delegate.txDelegateRegister
    ? getUnixTimestampFromValue(delegate.txDelegateRegister.timestamp)
    : '-';
  const isActive = nextForgers.data.filter(item => (item.username === delegate.username)).length;

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
              {`#${delegate.rank}`}
            </span>
          </li>
          <li className="status">
            <span className={styles.label}>
              {t('Status')}
            </span>
            <span className={styles.status}>
              {isActive ? t('Active') : t('Stand by')}
            </span>
          </li>
          <li className="delegate-since">
            <span className={styles.label}>{t('Delegate since')}</span>
            {moment(delegateSince).format(t('DD MMM YYYY'))}
          </li>
          <li className="vote">
            <span className={styles.label}>{t('Vote weight')}</span>
            <VoteWeight data={delegate} />
          </li>
          <li className="approval">
            <span className={styles.label}>{t('Approval')}</span>
            {`${formatAmountBasedOnLocale({ value: delegate.approval })}%`}
          </li>
          <li className="productivity">
            <span className={styles.label}>{t('Productivity')}</span>
            {`${formatAmountBasedOnLocale({ value: delegate.productivity })}%` }
          </li>
          <li className="blocks">
            <span className={styles.label}>{t('Blocks forged')}</span>
            {`${delegate.producedBlocks} (${delegate.missedBlocks})`}
          </li>
          <li className="forged">
            <span className={styles.label}>{t('LSK forged')}</span>
            <span>
              <LiskAmount val={delegate.rewards} />
              {` ${tokenMap.LSK.key}`}
            </span>
          </li>
          <li className="last-forged">
            <span className={styles.label}>{t('Last Forged Block')}</span>
            {timeFromLastBlock}
          </li>
        </ul>
      </BoxContent>
    </Box>
  );
};

DelegateTab.propTypes = {
  delegate: PropTypes.shape({
    data: PropTypes.shape({
      account: PropTypes.shape({
        publicKey: PropTypes.string.isRequired,
      }),
      approval: PropTypes.number,
      missedBlocks: PropTypes.number,
      producedBlocks: PropTypes.number,
      productivity: PropTypes.number,
      rank: PropTypes.number,
      rewards: PropTypes.string,
      username: PropTypes.string,
      vote: PropTypes.string,
      lastBlock: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      txDelegateRegister: PropTypes.shape({
        timestamp: PropTypes.number.isRequired,
      }),
    }).isRequired,
  }).isRequired,
  account: PropTypes.shape({
    publicKey: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

DelegateTab.defaultProps = {
  delegate: {
    data: {
      account: {
        publicKey: '',
      },
      approval: 0,
      missedBlocks: 0,
      producedBlocks: 0,
      productivity: 0,
      rank: 0,
      rewards: '',
      username: '',
      vote: '',
      lastBlock: '-',
      txDelegateRegister: { timestamp: 0 },
    },
  },
};

export default withTranslation()(DelegateTab);
