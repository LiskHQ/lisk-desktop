import React from 'react';
import Dialog from '@theme/dialog/dialog';
import BoxHeader from 'src/theme/box/header';
import Box from '@theme/box';
import BoxInfoText from '@theme/box/infoText';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import HwDeviceListing from 'src/modules/hardwareWallet/components/SelectHardwareDeviceModal/components/HwDeviceListing';
import styles from './SelectHardwareDeviceModal.css';

function SelectHardwareDeviceModal() {
  const { t } = useTranslation();

  return (
    <Dialog className={styles.SelectHardwareDeviceModal}>
      <Box>
        <BoxHeader className={styles.boxHeaderProp}>
          <h2 className={styles.hwTitle}>{t('Select hardware wallet device')}</h2>
        </BoxHeader>
        <BoxInfoText className={styles.boxInfoTextProp}>
          {t('Choose a hardware wallet to perform your transactions on add to your Lisk Desktop')}
        </BoxInfoText>
        <HwDeviceListing />
        <Link className={`${styles.backToWalletLink}`} to={routes.dashboard.path}>
          {t('Back to wallet')}
        </Link>
      </Box>
    </Dialog>
  );
}

export default SelectHardwareDeviceModal;
