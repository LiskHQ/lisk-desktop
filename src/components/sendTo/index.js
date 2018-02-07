import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TertiaryButton } from './../toolbox/buttons/button';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import LiskAmount from '../liskAmount';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';
import routes from './../../constants/routes';
import styles from './sendTo.css';

class SendTo extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.address !== this.props.address;
  }

  render() {
    return (<Box className={`${styles.wrapper}`}>
      <AccountVisual address={this.props.address} size={144}/>
      <div className={styles.account}>
        <h2>
          <span>
            <LiskAmount val={this.props.balance}/>
          </span> <small className={styles.balanceUnit}>LSK</small>
        </h2>
        <CopyToClipboard value={this.props.address} className={`${styles.address}`} copyClassName={styles.copy} />
      </div>
      <Link to={`${routes.wallet.long}?address=${this.props.address}`} >
        <TertiaryButton className={styles.button} >
          <FontIcon value={'send-token'}/> {this.props.t('Send to this address')}
        </TertiaryButton>
      </Link>
    </Box>
    );
  }
}

export default (translate()(SendTo));
