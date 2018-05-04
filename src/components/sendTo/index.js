import React from 'react';
import { connect } from 'react-redux';
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
  constructor(props) {
    super(props);

    this.state = {
      account: {},
      delegateUsername: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.address === this.props.account.address) {
      this.setState({
        account: this.props.account,
        delegateUsername: this.props.account.isDelegate ?
          this.props.account.delegate.username : null,
      });
    } else if (nextProps.search.lastSearch) {
      this.setState({
        account: nextProps.search.accounts[nextProps.search.lastSearch],
        delegateUsername: nextProps.search.delegates[nextProps.search.lastSearch] ?
          nextProps.search.delegates[nextProps.search.lastSearch].username : null,
      });
    }
  }

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
          {this.state.account.address ?
            <AccountVisual
              address={this.state.account.address}
              size={144}
              sizeS={90}
              className={`
            ${grid['col-xs-4']}
            ${grid['col-sm-5']}
            ${grid['col-md-12']}
            ${grid['col-lg-12']}
            ${grid['middle-sm']}
            `} /> : null
          }
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
                    ? <LiskAmount val={this.state.account.balance}/>
                    : null
                } <small className={styles.balanceUnit}>LSK</small>
              </span>
            </h2>
            <CopyToClipboard value={this.state.account.address} className={`${styles.address}`} copyClassName={styles.copy} />
            {
              this.state.delegateUsername ?
                <div className={styles.delegateRow}>
                  {this.props.t('Delegate')}
                  <span className={`${styles.delegateUsername} delegate-name`}>{this.state.delegateUsername}</span>
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
          <Link to={`${routes.wallet.path}?recipient=${this.state.account.address}`}>
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
const mapStateToProps = state => ({
  account: state.account,
  search: state.search,
});
export default connect(mapStateToProps)(SendTo);
