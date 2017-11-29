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
            <div style={{ height: '300px' }}>
              <header>
                <h2>Transfer</h2>
                <span className={`${styles.subTitle} ${styles.transfer}`}>Quickly send and request LSK token</span>
              </header>
              <div className='boxPadding'>
                <div className={`${grid.row} ${styles.tab} `}>
                  <div className={`${grid['col-xs-6']} ${this.activeTab === 'send' ? styles.tabActive : styles.tabInactive}`}
                    style={{ cursor: 'pointer' }}
                    onClick={this.setActive.bind(this, 'send')}>Send</div>
                  <div className={`${grid['col-xs-6']} ${this.activeTab === 'receive' ? styles.tabActive : styles.tabInactive}`}
                    style={{ cursor: 'pointer' }}
                    onClick={this.setActive.bind(this, 'receive')}>Request</div>
                </div>

              </div>
            </div>
            :
            <div style={{ height: '300px' }}>
              <header>
                <h2>Confirm transfer</h2>
              </header>
              <div className='boxPadding'>
                <div style={{ opacity: '0.8',
                  backgroundImage: 'linear-gradient(90deg, #3023AE 0%, #53A0FD 48%, #B4EC51 100%)',
                  height: '150px',
                  width: '150px',
                  borderRadius: '100%',
                  margin: '13px 0px',
                }}>
                </div>
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
        <div style={{ textAlign: 'center' }} className='boxPadding'>
          <div style={{ height: '270px', position: 'relative' }}>
            <i style={{ position: 'absolute', bottom: '-20px', left: '155px', fontSize: '3em', color: '#FF6236' }} className="material-icons">check</i>
          </div>
          <header>
            <h2 style={{ paddingBottom: '0px' }}><div>Thank you</div> </h2>
          </header>
          <p style={{ fontSize: '1.125em', color: '#3C5068', lineHeight: '36px' }}>
          Transaction is being processed and will be confirmed. It may take up to 15 minutes to
          be secured in the blockchain.
          </p>

          <div onClick={this.copyTransactionID.bind(this)} className={`${styles.subTitle}`} style={{ color: '#2475B9' }}>
            <img src={copy} />
            <span>Copy txID to clipboard</span>
          </div>

          <footer>
            <Button styl={{ paddingBottom: '20px' }}>Okay</Button>
            <div className='subTitle'></div>
          </footer>

        </div>
      }
    </div>);
  }
}

export default Transfer;
