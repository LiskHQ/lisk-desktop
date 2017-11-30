import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Send from './../send';
import Receive from './../receiveDialog';
import styles from './transactions.css';
import { Button } from './../toolbox/buttons/button';
import copy from './../../assets/images/icons/copy.svg';

class Transfer extends React.Component {
  constructor() {
    super();
    this.activeTab = 'send';
    this.isEditable = true;
    this.transactions = [];
  }

  setActive(tab) {
    this.activeTab = tab;
    this.forceUpdate();
  }


  next() {
    this.isEditable = false;
    this.forceUpdate();
  }

  back() {
    this.isEditable = true;
    this.forceUpdate();
  }

  copyTransactionID() {
    this.props.copy(this.transactions[0].id);
  }

  transactionIsSuccessful() {
    if (this.props.pending.length > 0) this.transactions.push(this.props.pending[0]);
    return (this.props.pending.length === 0 && this.transactions.length > 0);
  }

  render() {
    return (<div>
      {!this.transactionIsSuccessful()
        ?
        <div>
          { this.isEditable
            ?
            <div className={styles.header}>
              <header>
                <h2>Transfer</h2>
                <span className={`${styles.subTitle} ${styles.transfer}`}>{this.props.t('Quickly send and request LSK token')}</span>
              </header>
              <div className='boxPadding'>
                <div className={`${grid.row} ${styles.tab} `}>
                  <div className={`${grid['col-xs-6']} ${this.activeTab === 'send' ? styles.tabActive : styles.tabInactive}`}
                    onClick={this.setActive.bind(this, 'send')}>Send</div>
                  <div className={`${grid['col-xs-6']} ${this.activeTab === 'receive' ? styles.tabActive : styles.tabInactive}`}
                    onClick={this.setActive.bind(this, 'receive')}>Request</div>
                </div>
              </div>
            </div>
            :
            <div className={styles.header}>
              <header>
                <h2>{this.props.t('Confirm transfer')}</h2>
              </header>
              <div className='boxPadding'>
                <div className={styles.temporaryAvatar}></div>
              </div>
            </div>
          }
          {this.activeTab === 'send'
            ?
            <Send isEditable={this.isEditable}
              next={this.next.bind(this)}
              back={this.back.bind(this)} />
            :
            <Receive/>
          }
        </div>

        :
        <div className={`${styles.modal} boxPadding`}>
          <div className={styles.header}>
            <i className={`${styles.temporarySuccessCheck} material-icons`}>check</i>
          </div>
          <header>
            <h2>{this.props.t('Thank you')}</h2>
          </header>
          <p>
            {this.props.t('Transaction is being processed and will be confirmed. ' +
              'It may take up to 15 minutes to be secured in the blockchain.')}
          </p>

          <div onClick={this.copyTransactionID.bind(this)} className={`${styles.copy}`}>
            <img src={copy} /> <span>{this.props.t('Copy Transaction-ID to clipboard')}</span>
          </div>

          <footer>
            <Button onClick={location.reload.bind(location)}>{this.props.t('Okay')}</Button>
            <div className='subTitle'></div>
          </footer>

        </div>
      }
    </div>);
  }
}

export default Transfer;
