import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
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
    <section className={`${grid.row} ${styles.wrapper}`}>
      <article className={`${grid['col-sm-4']} ${grid['col-xs-12']}`}>
        <Address t={t} {...account}></Address>
      </article>
      <article className={`${grid['col-sm-4']} ${grid['col-xs-12']}`}>
        <div className="box">
          <div className={`${grid.row}`}>
            <div className={`${grid['col-sm-12']} ${grid['col-xs-4']}`}>
              <h3 className={styles.title}>
                {t('Peer')}
              </h3>
            </div>
            <div className={`${grid['col-sm-12']} ${grid['col-xs-8']}`}>
              <div className={styles['value-wrapper']}>
                <span id="accountStatus" className="status">
                  {status}
                </span>
                <p className="inner primary peer-network">
                  {t(peers.data.options.name)}
                </p>
                <p className="inner secondary peer">
                  {peers.data.currentPeer}
                  <span> : {peers.data.port}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
      <article className={`${grid['col-sm-4']} ${grid['col-xs-12']} balance`}>
        <div className="box">
          <div className={`${grid.row}`}>
            <div className={`${grid['col-sm-12']} ${grid['col-xs-4']}`}>
              <h3 className={styles.title}>{t('Balance')}</h3>
            </div>
            <div className={`${grid['col-sm-12']} ${grid['col-xs-8']}`}>
              <ClickToSend
                rawAmount={Math.max(0, account.balance - toRawLsk(0.1))} >
                <div className={styles['value-wrapper']}>
                  <p className="inner primary full hasTip balance-value">
                    <LiskAmount val={account.balance} /> LSK
                  </p>
                  <p className="inner secondary tooltip">
                    {t('Click to send all funds')}
                  </p>
                </div>
              </ClickToSend>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Account;
