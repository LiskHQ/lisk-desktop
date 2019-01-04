import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import key from '../../assets/images/icons-v2/key.svg';
import lock from '../../assets/images/icons-v2/lock.svg';
import pdf from '../../assets/images/icons-v2/pdf.svg';
import registerStyles from './registerV2.css';
import styles from './backupPassphrase.css';

class BackupPassphrase extends React.Component {
  constructor() {
    super();

    this.state = {
      passphraseCopied: false,
    };
  }

  textIsCopied() {
    this.setState({
      passphraseCopied: true,
    });
  }

  render() {
    const { t, account, prevStep } = this.props;
    const { passphraseCopied } = this.state;

    return (
      <React.Fragment>
        <span className={`${registerStyles.stepsLabel}`}>{t('Step 2 / 4')}</span>
        <div className={`${registerStyles.titleHolder}`}>
          <h1>
            <img src={key} />
            {t('Backup your Passphrase')}
          </h1>
          <p>{t('Passphrase is both your login and password combined')}</p>
          <p>{t('Keep it safe is only way to access the wallet')}</p>
        </div>

        <div className={`${styles.optionsHolder} ${grid['col-xs-10']}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionIcon}`}>
              <img src={lock} />
            </div>
            <div className={`${styles.optionContent}`}>
              <h2>{t('Passphrase')}<span className={styles.infoIcon}/></h2>
              <p>{account.passphrase}</p>
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
              <h2>{t('Paper version')}<span className={styles.infoIcon}/></h2>
              <p>{'Lisk.pdf'}</p>
              <a className={`${styles.action}`} href='#'>{t('Download PDF')}</a>
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
            <PrimaryButtonV2>
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
