import React from 'react';
import { useTranslation } from 'react-i18next';
import { TertiaryButton } from 'src/theme/buttons';
import { downloadJSON } from '@transaction/utils';
import Icon from 'src/theme/Icon';
import styles from './DownloadJSON.css';

function DownloadJSON({ encryptedPhrase, fileName }) {
  const { t } = useTranslation();

  const onDownload = () => {
    downloadJSON(encryptedPhrase, fileName);
  };

  return (
    <div className={styles.downloadLisk}>
      <Icon name="fileOutline" />
      <p className="option-value">{`${fileName}.json`}</p>
      <TertiaryButton
        className={styles.downloadBtn}
        size="xs"
        onClick={onDownload}
      >
        <span className={styles.buttonContent}>
          {t('Download')}
          <Icon name="downloadBlue" />
        </span>
      </TertiaryButton>
    </div>
  );
}

DownloadJSON.defaultProps = {
  encryptedPhrase: {
    error: 'no encrypted backup found',
  },
};

export default DownloadJSON;
