import QRCode from 'qrcode.react';
import React from 'react';
import renderPaperWallet from '@common/utilities/paperWallet';
import { SecondaryButton } from 'src/theme/buttons';
import PassphraseRenderer from '@wallet/components/passphraseRenderer';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Icon from 'src/theme/Icon';
import styles from './passphraseBackup.css';

class PassphraseBackup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showTip: false,
    };

    this.walletName = `${props.paperWalletName}.pdf`;
    this.generatePaperWallet = this.generatePaperWallet.bind(this);
    this.setCanvasRef = this.setCanvasRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /* istanbul ignore next */
  generatePaperWallet() {
    import(/* webpackChunkName: "jspdf" */ 'jspdf').then((module) => {
      const JSPDF = module.default;
      const data = {
        ...this.props,
        qrcode: this.canvasRef.firstChild.toDataURL(),
      };
      renderPaperWallet(JSPDF, data, this.walletName);
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

  render() {
    const { t, account } = this.props;

    return (
      <>
        <div className={`${styles.optionsHolder}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <PassphraseRenderer showInfo passphrase={account.passphrase} />
              <div className={styles.copyButtonContainer}>
                <CopyToClipboard
                  onClick={this.handleClick}
                  value={account.passphrase}
                  text={t('Copy entire passphrase')}
                  copyClassName={styles.copyIcon}
                  Container={SecondaryButton}
                  containerProps={{ size: 'xs' }}
                />
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
          <div className={styles.hrSection} />
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <h2>{t('Paper wallet')}</h2>
              <p className={styles.infoFooterText}>
                {t(
                  'You can also download, print and store safely your passphrase.',
                )}
              </p>
              <div style={{ display: 'none' }} ref={this.setCanvasRef}>
                <QRCode value={account.passphrase} />
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
          </div>
        </div>
      </>
    );
  }
}

export default PassphraseBackup;
