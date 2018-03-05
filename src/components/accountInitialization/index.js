import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from './../toolbox/buttons/button';
import Box from '../box';
import styles from './accountInit.css';

class AccountInitialization extends React.Component {
  closeInfo() {
    this.props.nextStep();
  }

  componentDidMount() {
    const { account } = this.props;
    if (account.serverPublicKey || account.balance === 0) {
      this.props.nextStep();
    }
  }

  render() {
    const { account, t } = this.props;

    return (<Box className={`${styles.wrapper} ${grid.row}`}>
      <header><h2>{t('Initialize Lisk ID')}</h2></header>
      <div className={styles.content}>
        <p>{t('It is recommended that you initialize your Lisk ID.')}</p>
        <p>The easiest way to do this is to send LSK to yourself by clicking this button.
          It will cost you only the usual 0.1 LSK transaction fee.</p>
      </div>
      <footer>
        <div className={grid.row} >
          <div className={grid['col-xs-4']}>
            <Button
              label={this.props.t('Discard')}
              onClick={this.closeInfo.bind(this)}
              type='button'
              className={`account-init-discard-button ${styles.button}`}
            />
          </div>
          <div className={grid['col-xs-8']}>
            <Button
              onClick={() => this.props.nextStep({ address: account.address, amount: 0.1 })}
              className={`account-init-button ${styles.button}`}>Next</Button>
            <div className='subTitle'></div>
          </div>
        </div>
      </footer>
    </Box>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(translate()(AccountInitialization));
