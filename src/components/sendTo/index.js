import React from 'react';
import { translate } from 'react-i18next';
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
  constructor() {
    super();
    this.state = { isMobile: window.innerWidth < 1024 };
  }

  shouldComponentUpdate(nextProps, state) {
    return nextProps.address !== this.props.address || this.state.isMobile !== state.isMobile;
  }

  resizeWindow() {
    this.setState({ isMobile: window.innerWidth < 1024 });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeWindow.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow.bind(this));
  }
  render() {
    return (<Box className={`${styles.wrapper} ${grid.row}`}>
      <div className={`
      ${grid['col-xs-12']}
      ${grid['col-sm-6']}
      ${grid['col-md-12']}
      ${grid['col-lg-12']}
      ${grid['middle-sm']}
      ${grid.row}
      `}>
        <AccountVisual
          address={this.props.address}
          className={`
          ${grid['col-xs-4']}
          ${grid['col-sm-4']}
          ${grid['col-md-12']}
          ${grid['col-lg-12']}
          ${grid['middle-sm']}
          `}
          size={this.state.isMobile ? 90 : 144} />
        <div className={`${styles.account}
        ${grid['col-xs-8']}
        ${grid['col-sm-8']}
        ${grid['col-md-12']}
        ${grid['col-lg-12']}
        `}>
          <h2>
            <span>
              <LiskAmount val={this.props.balance}/>
            </span> <small className={styles.balanceUnit}>LSK</small>
          </h2>
          <CopyToClipboard value={this.props.address} className={`${styles.address}`} copyClassName={styles.copy} />
        </div>
      </div>
      <div className={`
      ${grid['col-xs-12']}
      ${grid['col-sm-6']}
      ${grid['col-md-12']}
      ${grid['col-lg-12']}
      ${grid['middle-sm']}
      ${styles.sendButton}
      `}>
        <Link
          to={`${routes.wallet.long}?address=${this.props.address}`}
        >
          <TertiaryButton className={styles.button} >
            <FontIcon value={'send-token'}/> {this.props.t('Send to this address')}
          </TertiaryButton>
        </Link>
      </div>
    </Box>
    );
  }
}

export default (translate()(SendTo));
