import React from 'react';
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
  render() {
    const followedAccount = this.props.followedAccounts.find(account =>
      account.address === this.props.reciepientId);

    return (
      <div className={`${styles.resultBox}`}>
        <div></div>

        <div>
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

        <footer>
          <Button className={`okay-button ${styles.okButton}`}
            onClick={() => {
              // istanbul ignore else
              if (typeof this.props.finalCallback === 'function') {
                this.props.finalCallback();
              }
              this.props.reset();
              this.props.history.replace(this.props.history.location.pathname);
            }}>
            {this.props.t('Okay')}
          </Button>
          {followedAccount === undefined && this.props.followedAccounts.length > 0 ?
            <Button className={`add-follwed-account-button ${styles.addFollowedAccountButton}`}
              onClick={() => {
                this.props.nextStep({ address: this.props.reciepientId });
              }}>
              {this.props.t('Add Followed Account')}
            </Button> : null
          }
          <div className='subTitle'>{this.props.subTitle}</div>
        </footer>
      </div>

    );
  }
}

export default ResultBox;
