import React from 'react';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import styles from './walletDetails.css';
import LiskAmount from '../liskAmount';

class walletDetails extends React.Component {
  render() {
    const {
      balance, t, address, activeToken,
    } = this.props;

    return (
      <BoxV2 className={styles.wrapper}>
        <header>
          <h1>{t('Wallet Details')}</h1>
        </header>
        <section>
          <label>{t('Address')}</label>
          <div className={styles.value} >{address}</div>
        </section>
        <section>
          <label>{t('Balance')}</label>
          <div className={styles.value} ><LiskAmount val={balance} /> {activeToken}</div>
        </section>
      </BoxV2>
    );
  }
}

export default translate()(walletDetails);
