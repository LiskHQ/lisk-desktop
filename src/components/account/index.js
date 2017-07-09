import React from 'react';
import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';
import styles from './account.css';
import Address from './address';
import FormattedNumber from '../formattedNumber';

/**
 * Contains some of the important and basic information about the account
 *
 * @param {object} props - include properties of component
 */
const Account = (props) => {
  const status = props.peers.online ?
    <i className="material-icons online">check</i>
    : <i className="material-icons offline">error</i>;
  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      <article className={grid['col-xs-4']}>
        <Address {...props.account}></Address>
      </article>
      <article className={grid['col-xs-4']}>
        <div className="box">
          <h3 className={styles.title}>Peer</h3>
          <div className={styles['value-wrapper']}>
            <span id="accountStatus" className="status">
              {status}
            </span>
            <p className="inner primary">
              {props.peers.active.options.name}
            </p>
            <p className="inner secondary">
              {props.peers.active.currentPeer}
              <span> : {props.peers.active.port}</span>
            </p>
          </div>
        </div>
      </article>
      <article className={grid['col-xs-4']}>
        <div className="box">
          <h3 className={styles.title}>Balance</h3>
          <div className={styles['value-wrapper']}>
            <p className="inner primary full hasTip">
              <FormattedNumber val={props.balance}></FormattedNumber> Lsk
            </p>
            <p className="inner secondary tooltip">
              Click to send all funds
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};
export default Account;
