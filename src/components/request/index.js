import React from 'react';
import { translate } from 'react-i18next';
import QRCode from 'qrcode.react';
import CopyToClipboard from '../copyToClipboard/index';
import TransferTabs from './../transferTabs';
import { FontIcon } from '../fontIcon';
import styles from './request.css';

class Request extends React.Component {
  render() {
    const { t, setTabSend, account } = this.props;

    return (
      <div className={`${styles.wrapper}`}>
        <div>
          <header>
            <h2 className={styles.desktopTitle} >{t('Transfer')}</h2>
            <h2 className={styles.mobileTitle} >{t('Request')}</h2>
            <span className={styles.subTitle}>{t('Quickly send and request LSK token')}</span>
          </header>
          <TransferTabs setTabSend={setTabSend} isActiveTabSend={false}/>
        </div>
        <div className={styles.body}>
          <div className={`${styles.qrCode} request-qr-code`}>
            <QRCode value={account.address} />
          </div>
          <CopyToClipboard
            value={account.address}
            className={styles.copy}/>
          <a className={styles.emailLink}
            href={`mailto:?subject=My Lisk ID&body=Hey there, this is my Lisk ID: ${account.address}`}>
            Send request via E-mail <FontIcon value='arrow-right'/>
          </a>
        </div>
        <footer>
        </footer>
      </div>
    );
  }
}

export default translate()(Request);

