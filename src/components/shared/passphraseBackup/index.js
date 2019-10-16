import QRCode from 'qrcode.react';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import moment from 'moment';
import { Input } from '../../toolbox/inputs';
import { SecondaryButton } from '../../toolbox/buttons/button';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import Icon from '../../toolbox/icon';
import Tooltip from '../../toolbox/tooltip/tooltip';
import links from '../../../constants/externalLinks';
import renderPaperwallet from '../../../utils/paperwallet';
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
      t, account, subHeader,
    } = this.props;

    return (
      <React.Fragment>
        <div className={`${styles.optionsHolder}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <h2>{t('Passphrase')}</h2>
              {subHeader && <p className={styles.passphraseSubheader}>{subHeader}</p>}
              <div className={`${styles.inputs} ${grid.row} passphrase`}>
                {account.passphrase.split(' ').map((value, i) => (
                  <span key={i} className={`${grid['col-xs-2']}`}>
                    <Input
                      readOnly
                      value={value}
                    />
                  </span>
                ))}
              </div>
              <CopyToClipboard
                value={account.passphrase}
                text={t('Copy to clipboard')}
                copyClassName={styles.copyIcon}
                Container={SecondaryButton}
                containerProps={{ size: 'xs' }}
              />
            </div>
          </div>
          <div className={styles.hrSection}>
            <p>{t('OR')}</p>
          </div>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <h2>
                {t('Paper wallet')}
                <Tooltip
                  title="Paper wallet"
                >
                  <p>
                    {t('You can print your passphrase and store it in a safe place. ')}
                    {t('We highly recommend deleting the PDF file after printing.')}
                  </p>
                </Tooltip>
              </h2>
              <div style={{ display: 'none' }} ref={this.setCanvasRef}>
                <QRCode value={account.passphrase} />
              </div>
              <div className={styles.downloadLisk}>
                <Icon name="fileOutline" />
                <p className="option-value">{this.walletName}</p>
              </div>
              <SecondaryButton className={styles.downloadBtn} size="xs" onClick={this.generatePaperwallet}>
                {t('Download')}
              </SecondaryButton>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PassphraseBackup;
