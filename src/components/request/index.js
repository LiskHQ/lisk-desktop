import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { settingsUpdated } from '../../actions/settings';
import Request from './request';

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
          <div className={`${styles.qrCode} ${styles.magnified} qr-code`}>
            <QRCode value={account.address} />
          </div>
          <CopyToClipboard
            value={account.address}
            className={styles.copy}/>
          <a className={`${styles.emailLink} ${styles.paddingLeft} email-link`}
            href={`mailto:?subject=Requesting LSK to ${account.address}&body=Hey there, here is a link you can use to send me LSK via your wallet: ${encodeURIComponent(link)}`}>
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

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Request));
