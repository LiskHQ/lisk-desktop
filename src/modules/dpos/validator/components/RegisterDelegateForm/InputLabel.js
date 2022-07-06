import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'src/theme/Tooltip';
import styles from './form.css';

const InputLabel = ({ field }) => {
  const { t } = useTranslation();

  const config = {
    name: {
      title: t('Your name'),
      tip: t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.'),
    },
    generatorPublicKey: {
      title: t('Generator key'),
      tip: t('Run lisk keys:generate and copy the value of {{field}}', { field }),
    },
    blsPublicKey: {
      title: t('BLS Key'),
      tip: t('Run lisk keys:generate and copy the value of {{field}}', { field }),
    },
    proofOfPossession: {
      title: t('BLS Proof Of Possession'),
      tip: t('Run lisk keys:generate and copy the value of {{field}}', { field }),
    },
  };

  return (
    <label className={styles.label}>
      {config[field].title}
      <Tooltip position="right">
        <p>
          {config[field].tip}
        </p>
      </Tooltip>
    </label>
  );
};

export default InputLabel;
