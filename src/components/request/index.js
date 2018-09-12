import React from 'react';
import { translate } from 'react-i18next';
import QRCode from 'qrcode.react';
import CopyToClipboard from '../copyToClipboard/index';
import TransferTabs from './../transferTabs';
import { Button } from './../toolbox/buttons/button';
import { FontIcon } from '../fontIcon';
import styles from './request.css';

class Request extends React.Component {
  render() {
    const { t, setTabSend, account } = this.props;
    const link = `lisk://wallet?recipient=${account.address}`;

    return (
      <div className={`${styles.wrapper}`}>
        <div>
          <header>
            <h2 className={styles.desktopTitle} >{t('Transfer')}</h2>
            <h2 className={styles.mobileTitle} >{t('Request')}</h2>
          </header>
          <TransferTabs setTabSend={setTabSend} isActiveTabSend={false}/>
        </div>
        <div className={styles.body}>
          <div className={`${styles.qrCode} ${styles.magnified} request-qr-code`}>
            <QRCode value={account.address} />
          </div>
          <CopyToClipboard
            value={account.address}
            className={styles.copy}/>
          <a className={`${styles.emailLink} ${styles.paddingLeft}`}
            href={`mailto:?subject=Request LSK to ${account.address}&body=Hey there, here is a link you can use to send me LSK via your wallet: ${encodeURIComponent(link)}`}>
            {t('Send request via E-mail')} <FontIcon value='arrow-right'/>
          </a>
        </div>
        <footer>
          <Button className='specify-request' onClick={() => this.props.nextStep({ address: account.address })}>{this.props.t('Request specific amount')}</Button>
          <div className='subTitle'></div>
        </footer>
      </div>
    );
  }
}

export default translate()(Request);

