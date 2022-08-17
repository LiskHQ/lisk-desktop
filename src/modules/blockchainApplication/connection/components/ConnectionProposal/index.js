import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import { PrimaryButton } from 'src/theme/buttons';
import { client } from '@libs/wcm/utils/connectionCreator';
import { Input } from 'src/theme';
import usePairings from '@libs/wcm/hooks/usePairings';
import styles from './ConnectionProposal.css';

const ConnectionProposal = () => {
  const [value, setValue] = React.useState('');
  const { setUri } = usePairings(!!client);
  const { t } = useTranslation();

  const clickHandler = () => {
    setUri(value);
  };

  return (
    <Dialog className={styles.wrapper} hasClose>
      <Box>
        <div className={styles.title}>
          <h3>{t('Application pairing')}</h3>
          <h6>{t('Input WalletConnect URI to pair with an application')}</h6>
        </div>
        <div>
          <div>
            <Input
              type="text"
              onChange={e => setValue(e.target.value)}
              value={value}
              className={styles.input}
              placeholder={t('Enter WalletConnect URI')}
            />
            <PrimaryButton
              onClick={clickHandler}
              disabled={value.length === 0}
            >
              {t('Start pairing')}
            </PrimaryButton>
          </div>
        </div>
      </Box>
    </Dialog>
  );
};

export default ConnectionProposal;
