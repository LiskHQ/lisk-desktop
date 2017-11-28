import React from 'react';
import styles from './account.css';

/**
 * Contains some of the important and basic information about the account
 *
 * @param {object} props - include properties of component
 */

const Account = ({ peers, t }) => {
  const status = (peers.status && peers.status.online) ?
    <i className="material-icons online">check</i> :
    <i className="material-icons offline">error</i>;

  return (
    <section className={styles.temp}>
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
    </section>
  );
};

export default Account;
