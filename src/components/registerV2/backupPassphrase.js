import React from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import links from '../../constants/externalLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import renderPaperwallet from '../../utils/paperwallet';
import key from '../../assets/images/icons-v2/key.svg';
import lock from '../../assets/images/icons-v2/circle-lock.svg';
import pdf from '../../assets/images/icons-v2/pdf.svg';
import registerStyles from './registerV2.css';
import styles from './backupPassphrase.css';

class BackupPassphrase extends React.Component {
  constructor() {
    super();

    this.state = {
      passphraseCopied: false,
    };

    this.generatePaperwallet = this.generatePaperwallet.bind(this);
    this.setCanvasRef = this.setCanvasRef.bind(this);
  }

  textIsCopied() {
    this.setState({
      passphraseCopied: true,
    });

    this.timeout = setTimeout(() => {
      this.setState({
        passphraseCopied: false,
      });
    }, 3000);
  }

  /* istanbul ignore next */
  generatePaperwallet() {
    const data = {
      ...this.props,
      qrcode: this.canvasRef.firstChild.toDataURL(),
    };
    renderPaperwallet(data);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  setCanvasRef(node) {
    this.canvasRef = node;
  }

  render() {
    const {
      t, account, prevStep, nextStep,
    } = this.props;
    const { passphraseCopied } = this.state;
    console.log(account.passphrase);
    return (
      <React.Fragment>
        <span className={`${registerStyles.stepsLabel}`}>{t('Step 2 / 4')}</span>
        <div className={`${registerStyles.titleHolder}`}>
          <h1>
            {t('Save your Passphrase')}
          </h1>
          <p>{t('Passphrase is both your login and password combined.')}</p>
          <p>{
            t('Keep it safe, your passphrase is the only way to access your wallet.')
          }</p>
        </div>
        <div className={`${styles.optionsHolder} ${grid['col-sm-10']}`}>
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
                    t('We strongly recommend to store your passphrase in a safe place, such as on a password manager or paperwallet.')
                  }</p>
                </Tooltip>

              </h2>
              <div className={styles.passwordRow}>
                {account.passphrase.split(' ').map((word, index) =>
                  <div className={styles.passphraseField} key={`passwordField-${index}`}>{word}</div>
                )}
              </div>
              {/* <p className='option-value'>{account.passphrase}</p> */}
              <CopyToClipboard
                text={account.passphrase}
                onCopy={() => this.textIsCopied()}>
                <span className={`${styles.action} ${passphraseCopied && styles.copied}`}>
                  { !passphraseCopied ? t('Copy passphrase') : t('Copied!') }
                </span>
              </CopyToClipboard>
            </div>
          </div>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <h2>
                {t('Paper version')}
                <Tooltip
                  title={'Paperwallet'}>
                  <p>
                    {t('You can print your passphrase to be stored in a safe place. ')}
                    {t('It is highly recommended to delete the PDF and remove it from your trash after printing.')}
                  </p>
                </Tooltip>
              </h2>
              <div style={{ display: 'none' }} ref={this.setCanvasRef}>
                <QRCode value={account.passphrase} />
              </div>
              <p className='option-value'>{'Lisk.pdf'}</p>
              <span
                onClick={this.generatePaperwallet}
                className={`${styles.action}`}>{t('Download PDF')}</span>
            </div>
          </div>
        </div>

        <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
          <span className={`${registerStyles.button} ${grid['col-xs-4']}`}>
            <SecondaryButtonV2 onClick={prevStep}>
              {t('Go Back')}
            </SecondaryButtonV2>
          </span>
          <span className={`${registerStyles.button} ${grid['col-xs-4']}`}>
            <PrimaryButtonV2
              className={'yes-its-safe-button'}
              onClick={() => nextStep({ account })}>
              {t('Continue')}
            </PrimaryButtonV2>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(BackupPassphrase);
