import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './account.css';
import Address from './address';
import LiskAmount from '../liskAmount';
import ClickToSend from '../send/clickToSend';
import { toRawLsk } from '../../utils/lsk';

/**
 * Contains some of the important and basic information about the account
 *
 * @param {object} props - include properties of component
 */
const Account = ({
  account, peers,
}) => {
  const status = (peers.status && peers.status.online) ?
      <i className="material-icons online">check</i>
      : <i className="material-icons offline">error</i>;

  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      <article className={grid['col-xs-4']}>
        <Address {...account}></Address>
      </article>
      <article className={grid['col-xs-4']}>
        <div className="box">
          <h3 className={styles.title}>Peer</h3>
          <div className={styles['value-wrapper']}>
            <span id="accountStatus" className="status">
              {status}
            </span>
            <p className="inner primary peer-network">
              {peers.data.options.name}
            </p>
            <p className="inner secondary peer">
              {peers.data.currentPeer}
              <span> : {peers.data.port}</span>
            </p>
          </div>
        </div>
      </article>
      <article className={`${grid['col-xs-4']} balance`}>
        <div className="box">
          <h3 className={styles.title}>Balance</h3>
          <ClickToSend
            rawAmount={Math.max(0, account.balance - toRawLsk(0.1))} >
            <div className={styles['value-wrapper']}>
              <p className="inner primary full hasTip balance-value">
                <LiskAmount val={account.balance} /> LSK
              </p>
              <p className="inner secondary tooltip">
                Click to send all funds
              </p>
            </div>
          </ClickToSend>
        </div>
      </article>
    </section>
  );
};

export default Account;
