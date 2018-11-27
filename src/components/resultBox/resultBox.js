import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from '../toolbox/buttons/button';
import { FontIcon } from '../fontIcon';
import CopyToClipboard from '../copyToClipboard';

import styles from './resultBox.css';
import check from '../../assets/images/icons/check.svg';

class ResultBox extends React.Component {
  componentDidMount() {
    if (typeof this.props.onMount === 'function') {
      this.props.onMount(true, 'ResultBox');
    }
  }

  isNotYetFollowed(address) {
    return this.props.followedAccounts.find(account => account.address === address) === undefined;
  }

  render() {
    return (
      <div className={`${grid.row} ${grid['center-lg']} ${styles.resultBox}`}>
        <div className={`${grid['col-lg-4']}`}>
          <header>
            <div className={styles.header}>
              {this.props.success
                ? <img src={check} className={styles.icon}/>
                : <FontIcon value='error' className={styles.icon}/>
              }
            </div>
            <h2 className='result-box-header'>{this.props.title}</h2>
          </header>

          <p className='result-box-message'>
            {this.props.body}
          </p>
          {this.props.copy ?
            <CopyToClipboard value={this.props.copy.value}
              text={this.props.copy.title}
              className={`${styles.copy}`} /> :
            null
          }
        </div>

        <footer className={`${grid['col-lg-4']}`}>
          <Button className={`okay-button ${grid['col-lg-2']} ${styles.okButton}`}
            onClick={() => {
              this.props.transactionFailedClear();
              // istanbul ignore else
              if (typeof this.props.finalCallback === 'function') {
                this.props.finalCallback();
              }
              this.props.reset();
              this.props.history.replace(this.props.history.location.pathname);
            }}>
            {this.props.t('Okay')}
          </Button>
          {this.props.success &&
            this.props.reciepientId && this.isNotYetFollowed(this.props.reciepientId) ?
            <Button className={`add-follwed-account-button ${styles.addFollowedAccountButton}`}
              onClick={() => {
                this.props.nextStep({ address: this.props.reciepientId });
              }}>
              {this.props.t('Add to followed accounts')}
            </Button> : null
          }
          {!this.props.success && this.props.account.hwInfo ?
            <Button className={`add-follwed-account-button ${styles.addFollowedAccountButton}`}
              onClick={() => {
                this.props.transactionFailedClear();
                this.props.prevStep({
                  success: null,
                  account: this.props.account,
                  recipient: this.props.recipient,
                  amount: this.props.amount,
                  password: { value: '' },
                });
              }}>
              {this.props.t('Retry')}
            </Button> : null
          }
          <div className='subTitle'>{this.props.subTitle}</div>
        </footer>
      </div>

    );
  }
}

export default ResultBox;
