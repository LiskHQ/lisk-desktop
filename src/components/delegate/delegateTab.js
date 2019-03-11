import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import voting from '../../constants/voting';
import BoxV2 from '../boxV2';
import { getUnixTimestampFromValue } from '../../utils/datetime';
import LiskAmount from '../liskAmount';
import i18n from '../../i18n';
import styles from './delegateTab.css';

const DelegateTab = ({ delegate, t }) => {
  moment.locale(i18n.language);
  const status = delegate && delegate.rank && delegate.rank <= voting.maxCountOfVotes ? t('Active') : t('Standby');
  const timeFromLastBlock = getUnixTimestampFromValue(delegate.lastBlock.timestamp);
  const delegateSince = getUnixTimestampFromValue(delegate.txDelegateRegister.timestamp);

  return (<BoxV2>
    <header>
      <h1>{t('Delegate stats')}</h1>
    </header>
    <main className={styles.wrapper}>
      <ul className={styles.delegateStats}>
        <li className={'rank'}>
          <span className={styles.label}>{t('Rank')}</span> {delegate.rank}
        </li>
        <li className={'status'}>
          <span className={styles.label}>{t('Status')}</span> {status}
        </li>
        <li className={'delegate-since'}>
          <span className={styles.label}>{t('Delegate since')}</span> {moment(delegateSince).format(t('DD MMM YYYY'))}
        </li>
        <li className={'vote-weight'}>
          <span className={styles.label}>{t('Vote weight')}</span> <span>
            <LiskAmount val={delegate.vote}/> {t('LSK')}</span>
        </li>
        <li className={'approval'}>
          <span className={styles.label}>{t('Approval')}</span> {delegate.approval}%
        </li>
        <li className={'productivity'}>
          <span className={styles.label}>{t('Productivity')}</span> {delegate.productivity}%
        </li>
        <li className={'blocks'}>
          <span className={styles.label}>{t('Blocks forged')}</span> {delegate.producedBlocks} ({delegate.missedBlocks})
        </li>
        <li className={'forged'}>
          <span className={styles.label}>{t('LSK forged')}</span> <span>
          <LiskAmount val={delegate.rewards}/> {t('LSK')}</span>
        </li>
        <li className={'last-forged'}>
          <span className={styles.label}>{t('Last Forged Block')}</span> {moment(timeFromLastBlock).fromNow(true)}
        </li>
      </ul>
    </main>
  </BoxV2>);
};

DelegateTab.propTypes = {
  delegate: PropTypes.shape({
    account: PropTypes.shape({
      publicKey: PropTypes.string.isRequired,
    }).isRequired,
    approval: PropTypes.number.isRequired,
    missedBlocks: PropTypes.number.isRequired,
    producedBlocks: PropTypes.number.isRequired,
    productivity: PropTypes.number.isRequired,
    rank: PropTypes.number.isRequired,
    rewards: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    vote: PropTypes.string.isRequired,
    lastBlock: PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
    }).isRequired,
    txDelegateRegister: PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

DelegateTab.defaultProps = {
  delegate: {
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
    lastBlock: { timestamp: 0 },
    txDelegateRegister: { timestamp: 0 },
  },
  t: v => v,
};

export default DelegateTab;
