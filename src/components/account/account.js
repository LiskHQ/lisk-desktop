import React from 'react';
import styles from './account.css';
import Address from './address';
import LiskAmount from '../liskAmount';
import ClickToSend from '../clickToSend';
import { toRawLsk } from '../../utils/lsk';

/**
 * Contains some of the important and basic information about the account
 *
 * @param {object} props - include properties of component
 */

const Account = ({
  account, peers, t,
}) => {
  const status = (peers.status && peers.status.online) ?
    <i className="material-icons online">check</i> :
    <i className="material-icons offline">error</i>;

  return (
    <section className={styles.temp}>
      <Address t={t} {...account}></Address>
      <span className={styles.title}>
        {t('Peer')}
      </span>
      <span id="accountStatus" className="status">
        {status}
      </span>
      <span className="inner primary peer-network">
        {t(peers.data.options.name)}
      </span>
      <span className="inner secondary peer">
        {peers.data.currentPeer}
        <span> : {peers.data.port}</span>
      </span>
      <article className='balance'>
        <span>{t('Balance')}</span>
        <ClickToSend
          rawAmount={Math.max(0, account.balance - toRawLsk(0.1))} >
          <span className="inner primary full hasTip balance-value">
            <LiskAmount val={account.balance} /> LSK
          </span>
          <span className="inner secondary tooltip">
            {t('Click to send all funds')}
          </span>
        </ClickToSend>
      </article>
    </section>
  );
};

export default Account;
