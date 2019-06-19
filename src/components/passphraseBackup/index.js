import QRCode from 'qrcode.react';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import moment from 'moment';
import { InputV2 } from '../toolbox/inputsV2';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import CopyToClipboard from '../toolbox/copyToClipboard';
import Icon from '../toolbox/icon';
import Tooltip from '../toolbox/tooltip/tooltip';
import links from '../../constants/externalLinks';
import renderPaperwallet from '../../utils/paperwallet';
import styles from './passphraseBackup.css';

class PassphraseBackup extends React.Component {
  constructor(props) {
    super();

    this.walletName = `${props.paperWalletName}_${moment().format('YYYY_MM_DD_HH_mm')}.pdf`;
    this.generatePaperwallet = this.generatePaperwallet.bind(this);
    this.setCanvasRef = this.setCanvasRef.bind(this);
  }

  /* istanbul ignore next */
  generatePaperwallet() {
    const data = {
      ...this.props,
      qrcode: this.canvasRef.firstChild.toDataURL(),
    };
    renderPaperwallet(data, this.walletName);
  }

  setCanvasRef(node) {
    this.canvasRef = node;
  }

  render() {
    const {
      t, account,
    } = this.props;

    return (
      <React.Fragment>
        <div className={`${styles.optionsHolder}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <h2>
                {t('Passphrase')}

                <Tooltip
                  title={'Save the passphrase'}
                  footer={
                    <a href={links.howToStorePassphrase}
                      rel="noopener noreferrer"
                      target="_blank">
                        {t('Read More')}
                    </a>}>
                  <p>{
                    t('Store your passphrase in a safe place, possibly having more than one copy. You can use a password manager or a paperwallet. It is very important to ensure you do not lose access to your passphrase.')
                  }</p>
                </Tooltip>

              </h2>
              <div className={`${styles.inputs} ${grid.row} passphrase`}>
                {account.passphrase.split(' ').map((value, i) => (
                  <span key={i} className={`${grid['col-xs-2']}`}>
                    <InputV2
                      readOnly
                      value={value}
                    />
                  </span>
                ))}
              </div>
              <CopyToClipboard
                value={account.passphrase}
                text={t('Copy to Clipboard')}
                copyClassName={styles.copyIcon}
                Container={SecondaryButtonV2}
                containerClassName='extra-small'
                />
            </div>
          </div>
          <div className={styles.hrSection}>
            <p>{t('OR')}</p>
          </div>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <h2>
                {t('Paper Wallet')}
                <Tooltip
                  title={'Paper Wallet'}>
                  <p>
                    {t('You can print your passphrase to store in a safe place. ')}
                    {t('It is highly recommended to delete the PDF file and remove it from your Trash Folder too after printing it.')}
                  </p>
                </Tooltip>
              </h2>
              <div style={{ display: 'none' }} ref={this.setCanvasRef}>
                <QRCode value={account.passphrase} />
              </div>
              <div className={styles.downloadLisk}>
                <Icon name='fileOutline' />
                <p className='option-value'>{this.walletName}</p>
              </div>
              <SecondaryButtonV2 className='extra-small' onClick={this.generatePaperwallet} >
                {t('Download')}
              </SecondaryButtonV2>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PassphraseBackup;
