import React from 'react';
import QRCode from 'qrcode.react';
import { TertiaryButton, SecondaryButton } from 'src/theme/buttons';
import renderPaperWallet from 'src/utils/paperWallet';
import PassphraseRenderer from '@wallet/components/passphraseRenderer';
import CopyToClipboard from '@common/components/copyToClipboard';
import Icon from '@theme/Icon';
import { downloadJSON } from '@transaction/utils';
import styles from './passphraseBackup.css';

class PassphraseBackup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showTip: false,
    };

    this.walletName = `${props.paperWalletName}.pdf`;
    this.setCanvasRef = this.setCanvasRef.bind(this);
    this.generatePaperWallet = this.generatePaperWallet.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.fileName = 'file.json';
  }

  /* istanbul ignore next */
  generatePaperWallet() {
    import(/* webpackChunkName: "jspdf" */ 'jspdf').then(async (module) => {
      const JSPDF = module.default;
      const data = {
        ...this.props,
        now: new Date(),
        qrcode: this.canvasRef.firstChild.toDataURL(),
      };
      await renderPaperWallet(JSPDF, data, this.walletName);
    });
  }

  setCanvasRef(node) {
    this.canvasRef = node;
  }

  handleClick() {
    this.setState({ showTip: true });
    setTimeout(() => {
      this.setState({ showTip: false });
    }, 3000);
  }

  downloadAccountJSON() {
    downloadJSON({}, this.fileName);
  }

  render() {
    const { t, passphrase, jsonBackup = false } = this.props;

    return (
      <>
        <div className={`${styles.optionsHolder}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <PassphraseRenderer
                showInfo
                passphrase={passphrase}
                subheader
                subheaderText={t(
                  'Please write down these 12 words carefully, and store them in a safe place.'
                )}
              />
              <CopyToClipboard
                onClick={this.handleClick}
                value={passphrase}
                text={t('Copy')}
                Container={TertiaryButton}
                containerProps={{ size: 'xs', className: styles.copyPassphrase }}
                copyClassName={styles.copyIcon}
              />
              <div className={styles.copyButtonContainer}>
                <span
                  className={[
                    'tip',
                    styles.tipContainer,
                    !this.state.showTip && styles.hidden,
                  ].join(' ')}
                >
                  <Icon color="red" name="warningRound" />
                  <p>{t('Make sure to store it somewhere safe')}</p>
                </span>
              </div>
            </div>
          </div>
          <div className={`${styles.option}`}>
            {!jsonBackup ? (
              <div className={`${styles.optionContent}`}>
                <h2>{t('Paper wallet')}</h2>
                <p className={styles.infoFooterText}>
                  {t('You can also download, print and store safely your passphrase.')}
                </p>
                <div style={{ display: 'none' }} ref={this.setCanvasRef}>
                  <QRCode value={passphrase} />
                </div>
                <div className={styles.downloadLisk}>
                  <Icon name="fileOutline" />
                  <p className="option-value">{this.walletName}</p>
                </div>
                <SecondaryButton
                  className={styles.downloadBtn}
                  size="xs"
                  onClick={this.generatePaperWallet}
                >
                  {t('Download')}
                </SecondaryButton>
              </div>
            ) : (
              <div className={`${styles.optionContent} ${styles.jsonWrapper}`}>
                <h2>{t('Encrypted file')}</h2>
                <p className={styles.infoFooterText}>
                  {t('Additionally, you can also download the encrypted json file.')}
                </p>
                <div>
                  <span>
                    <Icon name="filePlain" />
                    {this.fileName}
                  </span>
                  <span>
                    <span>{t('Download')}</span>
                    <Icon
                      name="downloadBlue"
                      className={styles.downloadIcon}
                      onClick={this.downloadAccountJSON}
                    />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default PassphraseBackup;
