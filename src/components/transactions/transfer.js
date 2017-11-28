import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Send from './../send';
import Receive from './../receiveDialog';
import styles from './transactions.css';

class Transfer extends React.Component {
  constructor() {
    super();
    this.activeTab = 'send';
    this.isEditable = true;
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

  render() {
    return (<div>
      { this.isEditable ?
        <div style={{ height: '250px' }}>
          <h3 style={{ color: 'black' }}>Transfer</h3>
          <h4 style={{ color: '#3C5068' }}>Quickly send and request LSK token</h4>
          <div className={`${grid.row} ${styles.tab} `}>
            <div className={`${grid['col-xs-6']} ${this.activeTab === 'send' ? styles.tabActive : styles.tabInactive}`}
              style={{ cursor: 'pointer' }}
              onClick={this.setActive.bind(this, 'send')}>
            Send
            </div>
            <div className={`${grid['col-xs-6']} ${this.activeTab === 'receive' ? styles.tabActive : styles.tabInactive}`}
              style={{ cursor: 'pointer' }}
              onClick={this.setActive.bind(this, 'receive')}>
            Request
            </div>
          </div>
        </div>
        : <div style={{ height: '250px' }}>
          <h3 style={{ color: 'black' }}>Confirm transfer</h3>
          <div style={{ opacity: '0.8',
            backgroundImage: 'linear-gradient(90deg, #3023AE 0%, #53A0FD 48%, #B4EC51 100%)',
            height: '150px',
            width: '150px',
            borderRadius: '100%',
            margin: '13px 0px',
          }}>
          </div>
        </div>
      }
      {this.activeTab === 'send'
        ? <Send isEditable={this.isEditable}
          next={this.next.bind(this)}
          back={this.back.bind(this)} />
        : <Receive/>
      }
    </div>);
  }
}

export default Transfer;
