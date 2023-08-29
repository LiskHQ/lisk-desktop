import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { TertiaryButton, SecondaryButton } from '@theme/buttons';
import renderPaperWallet from 'src/utils/paperWallet';
import PassphraseRenderer from '@wallet/components/passphraseRenderer';
import CopyToClipboard from '@common/components/copyToClipboard';
import Icon from '@theme/Icon';
import { useCurrentAccount } from '@account/hooks';
import { truncateAddress } from '@wallet/utils/account';
import { downloadJSON } from '@transaction/utils';
import styles from './passphraseBackup.css';

// eslint-disable-next-line max-statements
const PassphraseBackup = ({ t, passphrase, paperWalletName, jsonBackup = false }) => {
  const [showTip, setShowTip] = useState(false);
  const canvasRef = useRef();
  const walletName = `${paperWalletName}.pdf`;
  const [currentAccount] = useCurrentAccount();
  const { name: accountName = '', address = '' } = currentAccount?.metadata ?? {};
  const appendAccountName = `-${accountName}`;
  const fileName = `${address}${accountName ? appendAccountName : ''}-lisk-account`;
  const truncatedFilename = `${truncateAddress(fileName)}.json`;

  /* istanbul ignore next */
  const generatePaperWallet = () => {
    import(/* webpackChunkName: "jspdf" */ 'jspdf').then(async (module) => {
      const JSPDF = module.default;
      const data = {
        t,
        passphrase,
        paperWalletName,
        now: new Date(),
        qrcode: canvasRef.current.firstChild.toDataURL(),
      };
      await renderPaperWallet(JSPDF, data, walletName);
    });
  };

  const handleClick = () => {
    setShowTip(true);
    setTimeout(() => {
      setShowTip(false);
    }, 3000);
  };

  const downloadAccountJSON = () => {
    downloadJSON(currentAccount, fileName);
  };

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
                'Please write down these 12/24 words carefully, and store them in a safe place.'
              )}
            />
            <CopyToClipboard
              onClick={handleClick}
              value={passphrase}
              text={t('Copy')}
              Container={TertiaryButton}
              containerProps={{ size: 'xs', className: styles.copyPassphrase }}
              copyClassName={styles.copyIcon}
            />
            <div className={styles.copyButtonContainer}>
              <span className={['tip', styles.tipContainer, !showTip && styles.hidden].join(' ')}>
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
              <div style={{ display: 'none' }} ref={canvasRef}>
                <QRCode value={passphrase} />
              </div>
              <div className={styles.downloadLisk}>
                <Icon name="fileOutline" />
                <p className="option-value">{walletName}</p>
              </div>
              <SecondaryButton
                className={styles.downloadBtn}
                size="xs"
                onClick={generatePaperWallet}
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
                  {truncatedFilename}
                </span>
                <span onClick={downloadAccountJSON}>
                  <span>{t('Download')}</span>
                  <Icon name="downloadBlue" className={styles.downloadIcon} />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PassphraseBackup;
