import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from './../toolbox/buttons/button';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import styles from './accountInit.css';

class AccountInitialization extends React.Component {
  closeInfo() {
    this.props.nextStep();
  }

  componentDidMount() {
    const { account } = this.props;
    const needsNoAccountInit = account.serverPublicKey || account.balance === 0;
    if (needsNoAccountInit) {
      this.props.nextStep();
    }
  }

  render() {
    const { account, t, nextStep } = this.props;

    return (<Box className={`${styles.wrapper} ${grid.row}`}>
      <header>
        <h2>{t('Initialize Lisk ID')}</h2>
        <p>{t('It is recommended that you initialize your Lisk ID.')}</p>
        <p>{t('The easiest way to do this is to send LSK to yourself by clicking this button. ' +
            'It will cost you only the usual 0.1 LSK transaction fee.')}</p>
        <p>
          <a target='_blank' href='https://help.lisk.io/account-security/should-i-initialize-my-lisk-account' rel='noopener noreferrer'>
            {t('Why should I initialize my Lisk ID?')} <FontIcon>arrow-right</FontIcon>
          </a>
        </p>
      </header>
      <div></div>
      <footer>
        <div className={grid.row} >
          <div className={grid['col-xs-4']}>
            <Button
              label={t('Discard')}
              onClick={this.closeInfo.bind(this)}
              className={`account-init-discard-button ${styles.button}`}
            />
          </div>
          <div className={grid['col-xs-8']}>
            <Button
              label={t('Next')}
              onClick={() => nextStep({ address: account.address, amount: 0.1 })}
              className={`account-init-button ${styles.button}`}/>
          </div>
        </div>
        <div className='subTitle'>{t('Confirmation in the next step')}</div>
      </footer>
    </Box>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(translate()(AccountInitialization));
