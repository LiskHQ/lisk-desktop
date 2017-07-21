import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './account.css';
import Address from './address';
import LiskAmount from '../liskAmount';
import { getAccountStatus } from '../../utils/api/account';

/**
 * Contains some of the important and basic information about the account
 *
 * @param {object} props - include properties of component
 */
class AccountComponent extends React.Component {
  componentDidMount() {
    this.update();
    document.addEventListener('beat', this.update.bind(this));
  }

  update() {
    const { onActivePeerUpdated } = this.props;
    return getAccountStatus(this.props.peers.data).then(() => {
      onActivePeerUpdated({ online: true });
    }).catch(() => {
      onActivePeerUpdated({ online: false });
    });
  }

  render() {
    const status = (this.props.peers.status && this.props.peers.status.online) ?
      <i className="material-icons online">check</i>
      : <i className="material-icons offline">error</i>;
    return (
      <section className={`${grid.row} ${styles.wrapper}`}>
        <article className={grid['col-xs-4']}>
          <Address {...this.props.account}></Address>
        </article>
        <article className={grid['col-xs-4']}>
          <div className="box">
            <h3 className={styles.title}>Peer</h3>
            <div className={styles['value-wrapper']}>
              <span id="accountStatus" className="status">
                {status}
              </span>
              <p className="inner primary">
                {this.props.peers.data.options.name}
              </p>
              <p className="inner secondary">
                {this.props.peers.data.currentPeer}
                <span> : {this.props.peers.data.port}</span>
              </p>
            </div>
          </div>
        </article>
        <article className={grid['col-xs-4']}>
          <div className="box">
            <h3 className={styles.title}>Balance</h3>
            <div className={styles['value-wrapper']}>
              <p className="inner primary full hasTip">
                <LiskAmount val={this.props.account.balance} /> LSK
              </p>
              <p className="inner secondary tooltip">
                Click to send all funds
              </p>
            </div>
          </div>
        </article>
      </section>
    );
  }
}

export default AccountComponent;
