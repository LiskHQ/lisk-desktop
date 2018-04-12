import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { TertiaryButton } from './../toolbox/buttons/button';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import LiskAmount from '../liskAmount';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';
import routes from './../../constants/routes';
import styles from './sendTo.css';

class SendTo extends React.Component {
  render() {
    return (<Box className={`${styles.wrapper} ${grid.row}`}>
      <section className={styles.content}>
        <div className={`
      ${grid['col-xs-12']}
      ${grid['col-sm-7']}
      ${grid['col-md-12']}
      ${grid['col-lg-12']}
      ${grid['middle-sm']}
      ${grid.row}
      `}>
          <AccountVisual
            address={this.props.address}
            className={`
          ${grid['col-xs-4']}
          ${grid['col-sm-5']}
          ${grid['col-md-12']}
          ${grid['col-lg-12']}
          ${grid['middle-sm']}
          `}
            size={144} sizeS={90}/>
          <div className={`${styles.account}
        ${grid['col-xs-8']}
        ${grid['col-sm-7']}
        ${grid['col-md-12']}
        ${grid['col-lg-12']}
        `}>
            <h2>
              <span>
                {
                  this.props.notLoading
                    ? <LiskAmount val={this.props.balance}/>
                    : null
                } <small className={styles.balanceUnit}>LSK</small>
              </span>
            </h2>
            <CopyToClipboard value={this.props.address} className={`${styles.address}`} copyClassName={styles.copy} />
            {
              this.props.delegateUsername ?
                <div className={styles.delegateRow}>
                  {this.props.t('Delegate')}
                  <span className={`${styles.delegateUsername} delegate-name`}>{this.props.delegateUsername}</span>
                </div>
                : null
            }
          </div>
        </div>
        <div className={`
      ${grid['col-xs-12']}
      ${grid['col-sm-5']}
      ${grid['col-md-12']}
      ${grid['col-lg-12']}
      ${grid['middle-sm']}
      ${styles.sendButton}
      `}>
          <Link to={`${routes.wallet.path}?recipient=${this.props.address}`}>
            <TertiaryButton className={`${styles.button} send-to-address`} >
              <FontIcon value={'send-token'}/> {this.props.t('Send to this address')}
            </TertiaryButton>
          </Link>
        </div>
      </section>
    </Box>
    );
  }
}

export default SendTo;
