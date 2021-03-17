import QRCode from 'qrcode.react';
import React from 'react';
import renderPaperwallet from '@utils/paperwallet';
import { SecondaryButton } from '../../toolbox/buttons';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import Icon from '../../toolbox/icon';
import styles from './passphraseBackup.css';
import PassphraseRenderer from '../passphraseRenderer';

class PassphraseBackup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showTip: false,
    };

    this.walletName = `${props.paperWalletName}.pdf`;
    this.generatePaperwallet = this.generatePaperwallet.bind(this);
    this.setCanvasRef = this.setCanvasRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /* istanbul ignore next */
  generatePaperwallet() {
    import(/* webpackChunkName: "jspdf" */ 'jspdf')
      .then((module) => {
        const JSPDF = module.default;
        const data = {
          ...this.props,
          qrcode: this.canvasRef.firstChild.toDataURL(),
        };
        renderPaperwallet(JSPDF, data, this.walletName);
      });
  }

  setCanvasRef(node) {
    this.canvasRef = node;
  }

  handleClick() {
    this.setState({ showTip: true });
    setTimeout(() => { this.setState({ showTip: false }); }, 3000);
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
                <span className={['tip', styles.tipContainer, !this.state.showTip && styles.hidden].join(' ')}>
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
              <p className={styles.infoFooterText}>{t('You can also download, print and store safely your passphrase.')}</p>
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
