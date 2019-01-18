import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from './../toolbox/buttons/button';
import styles from './accountInit.css';
import fees from './../../constants/fees';
import { parseSearchParams } from './../../utils/searchParams';
import { fromRawLsk } from '../../utils/lsk';
import Piwik from '../../utils/piwik';

class AccountInitialization extends React.Component {
  closeInfo() {
    Piwik.trackingEvent('AccountInit', 'button', 'Close info dialog');
    this.props.nextStep();
  }

  componentDidMount() {
    const {
      account, nextStep, history, transactions, address,
    } = this.props;
    const search = Object.keys(parseSearchParams(history.location.search));
    const needsNoAccountInit = account.serverPublicKey
      || account.balance === 0
      || transactions.pending.length > 0;

    history.replace({
      pathname: history.location.pathname,
      search: '',
    });
    if (search.includes('initializeAccount') && !needsNoAccountInit) {
      nextStep({ account, accountInit: true }, 2);
    } else if (needsNoAccountInit || address || search.includes('wallet')) {
      nextStep();
    }
  }

  onNext() {
    const { account, nextStep } = this.props;
    Piwik.trackingEvent('AccountInit', 'button', 'Next step');
    nextStep({ account, accountInit: true }, 2);
  }

  render() {
    const { t } = this.props;

    return (<div className={`${styles.wrapper} account-initialization`}>
      <header>
        <h2>{t('Initialize Lisk ID')}</h2>
      </header>
      <div>
        <p>{t('It is recommended that you initialize your Lisk ID.')}</p>
        <p>{t('The easiest way to do this is to send LSK to yourself. It will cost you only the usual {{fee}} LSK transaction fee.', { fee: fromRawLsk(fees.send) })}</p>
      </div>
      <footer>
        <div className={` ${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`} >
          <div className={`${grid['col-xs-4']} ${grid['col-sd-6']} ${grid['col-md-5']} ${grid['col-lg-4']}`}>
            <Button
              label={t('Discard')}
              onClick={this.closeInfo.bind(this)}
              className={`account-init-discard-button ${styles.button}`}
            />
          </div>
          <div className={`${grid['col-xs-4']} ${grid['col-sd-6']} ${grid['col-md-5']} ${grid['col-lg-4']}`}>
            <Button
              label={t('Next')}
              onClick={this.onNext.bind(this)}
              className={`account-init-button ${styles.button}`}/>
          </div>
        </div>
        <div className='subTitle'>{t('Confirmation in the next step')}</div>
      </footer>
    </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  transactions: state.transactions,
});

export default connect(mapStateToProps)(translate()(AccountInitialization));
