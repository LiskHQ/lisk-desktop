import React from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import links from '../../constants/externalLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import Paperwallet from '../../utils/paperwallet';
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

  generatePaperwallet() {
    const { account, t } = this.props;
    const qrcode = this.canvasRef.firstChild.toDataURL();
    const paperwallet = new Paperwallet({ account, t, qrcode });
    paperwallet.save();
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

    return (
      <React.Fragment>
        <span className={`${registerStyles.stepsLabel}`}>{t('Step 2 / 4')}</span>
        <div className={`${registerStyles.titleHolder}`}>
          <h1>
            <img src={key} />
            {t('Backup your Passphrase')}
          </h1>
          <p>{t('Your passphrase is both your login and password to your Lisk Hub.')}</p>
          <p>{
            t('You must keep it safe as it is the only way to access your wallet and cannot be recovered if lost.')
          }</p>
        </div>

        <div className={`${styles.optionsHolder} ${grid['col-sm-11']}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionIcon}`}>
              <img src={lock} />
            </div>
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
              <p className='option-value'>{account.passphrase}</p>
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
            <div className={`${styles.optionIcon}`}>
              <img src={pdf} />
            </div>
            <div className={`${styles.optionContent}`}>
              <h2>
                {t('Paper version')}
                <Tooltip
                  title={'Paperwallet'}
                  footer={
                    <a href="http://lisk.io"
                      rel="noopener noreferrer"
                      target="_blank">
                        {t('Read More')}
                    </a>}>
                  <p>
                    {t('You can print your passphrase to store in a safe place.')}
                    {t('It is highly recommended to delete PDF file after printing.')}
                  </p>
                </Tooltip>
              </h2>
              <div style={{ display: 'none' }} ref={this.setCanvasRef}>
                <QRCode value={account.address} />
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
              <FontIcon className={registerStyles.icon}>arrow-left</FontIcon>
              {t('Go Back')}
            </SecondaryButtonV2>
          </span>
          <span className={`${registerStyles.button} ${grid['col-xs-4']}`}>
            <PrimaryButtonV2
              className={'yes-its-safe-button'}
              onClick={() => nextStep({ account })}>
              {t('Continue')}
              <FontIcon className={registerStyles.icon}>arrow-right</FontIcon>
            </PrimaryButtonV2>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(BackupPassphrase);
