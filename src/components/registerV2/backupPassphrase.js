import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { generatePassphrase } from '../../utils/passphrase';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import key from '../../assets/images/icons-v2/key.svg';
import lock from '../../assets/images/icons-v2/lock.svg';
import pdf from '../../assets/images/icons-v2/pdf.svg';
import styles from './registerV2.css';
import passphraseStyles from './backupPassphrase.css';

class BackupPassphrase extends React.Component {
  constructor() {
    super();

    this.state = {
      passphrase: '',
      passphraseCopied: false,
    };
  }

  componentDidMount() {
    const crypotObj = window.crypto || window.msCrypto;
    const passphrase = generatePassphrase({
      seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
    });
    this.setState({
      passphrase,
    });
  }

  textIsCopied() {
    this.setState({
      passphraseCopied: true,
    });
  }

  render() {
    const { t } = this.props;
    const { passphraseCopied } = this.state;
    return (
      <React.Fragment>
        <div className={`${styles.titleHolder}`}>
          <h1>
            <img src={key} />
            {t('Backup your Passphrase')}
          </h1>
          <p>{t('Passphrase is both your login and password combined')}</p>
          <p>{t('Keep it safe is only way to access the wallet')}</p>
        </div>

        <div className={`${passphraseStyles.optionsHolder} ${grid['col-xs-10']}`}>
          <div className={`${passphraseStyles.option}`}>
            <div className={`${passphraseStyles.optionIcon}`}>
              <img src={lock} />
            </div>
            <div className={`${passphraseStyles.optionContent}`}>
              <h2>{t('Passphrase')}<span className={passphraseStyles.infoIcon}/></h2>
              <p>{this.state.passphrase}</p>
              <CopyToClipboard
                text={this.state.passphrase}
                onCopy={() => this.textIsCopied()}>
                <span className={`${passphraseStyles.action} ${passphraseCopied && passphraseStyles.copied}`}>
                  { !passphraseCopied ? t('Copy passphrase') : t('Copied!') }
                </span>
              </CopyToClipboard>
            </div>
          </div>

          <div className={`${passphraseStyles.option}`}>
            <div className={`${passphraseStyles.optionIcon}`}>
              <img src={pdf} />
            </div>
            <div className={`${passphraseStyles.optionContent}`}>
              <h2>{t('Paper version')}<span className={passphraseStyles.infoIcon}/></h2>
              <p>{'Lisk.pdf'}</p>
              <a className={`${passphraseStyles.action}`} href='#'>{t('Download PDF')}</a>
            </div>
          </div>
        </div>

        <div className={`${styles.buttonsHolder} ${grid.row}`}>
          <Link className={`${styles.button} ${grid['col-xs-4']}`} to={routes.splashscreen.path}>
            <SecondaryButtonV2>
              <FontIcon className={styles.icon}>arrow-left</FontIcon>
              {t('Go Back')}
            </SecondaryButtonV2>
          </Link>
          <span className={`${styles.button} ${grid['col-xs-4']}`}>
            <PrimaryButtonV2>
              {t('Continue')}
              <FontIcon className={styles.icon}>arrow-right</FontIcon>
            </PrimaryButtonV2>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(BackupPassphrase);
