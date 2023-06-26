import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import { PrimaryButton, OutlineButton } from '@theme/buttons';
import useSettings from '@settings/hooks/useSettings';
import { parseSearchParams, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { immutableDeleteFromArrayById } from 'src/utils/immutableUtils';
import styles from './DialogRemoveNetwork.css';

const DialogRemoveNetwork = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { name, serviceUrl } = parseSearchParams(history.location.search);
  const { customNetworks, setValue } = useSettings('customNetworks');

  const onCancel = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  const onConfirm = () => {
    const modifiedCustomNetworks = immutableDeleteFromArrayById(customNetworks, 'name', name);
    setValue(modifiedCustomNetworks);
    removeSearchParamsFromUrl(history, ['modal'], true);
    toast.info(t(`Network removed "${name}"`), { position: 'bottom-right' });
  };

  return (
    <Dialog hasClose className={styles.wrapper}>
      <Box className={styles.container}>
        <BoxHeader>
          <h2>{t('Remove network?')}</h2>
        </BoxHeader>
        <BoxContent>
          <div className={`${styles.content}`}>
            <p className={styles.networkName}>{name}</p>
            <p className={styles.networkUrl}>{serviceUrl}</p>
          </div>
          <div className={`${grid.row} ${styles.details}`}>
            {t(
              'This network will no longer be stored on this device and will have to be added again to use.'
            )}
          </div>
          <div className={grid.row}>
            <div className={grid['col-xs-6']}>
              <OutlineButton className={styles.confirmBtn} onClick={onConfirm}>
                {t('Remove network')}
              </OutlineButton>
            </div>
            <div className={grid['col-xs-6']}>
              <PrimaryButton className={styles.cancelBtn} onClick={onCancel}>
                {t('Cancel remove')}
              </PrimaryButton>
            </div>
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default DialogRemoveNetwork;
