import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ACTIONS, STATUS } from '@libs/wcm/constants/lifeCycle';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import { removeSearchParamsFromUrl, parseSearchParams } from 'src/utils/searchParams';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './ConnectionStatus.css';

const ConnectionStatus = ({ history }) => {
  const { t } = useTranslation();
  const timeout = useRef();
  const { status, action, name = 'web app' } = parseSearchParams(history.location.search);
  const messages = {
    [ACTIONS.APPROVE]: {
      [STATUS.SUCCESS]: t('Successfully paired with {{name}}', { name }),
      [STATUS.FAILURE]: t('Failed to pair with {{name}}', { name }),
    },
    [ACTIONS.REJECT]: {
      [STATUS.SUCCESS]: t('Rejected the pairing request from {{name}}', { name }),
      [STATUS.FAILURE]: t('An error occurred while rejecting the pairing request from {{name}}', { name }),
    },
    default: t('Encountered an error while connecting to {{name}} application.', { name }),
  }

  const redirectToHome = () => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      removeSearchParamsFromUrl(history, ['modal', 'status', 'name', 'action']);
    }, 3000);
  };

  useEffect(() => {
    redirectToHome();

    return () => clearTimeout(timeout.current);
  }, []);

  return (
    <Dialog className={styles.wrapper}>
      <Box>
        <div className={styles.wrapper}>
          <figure>
            <img src={liskLogo} />
          </figure>
          <h3>{name}</h3>
        </div>
        <div>
          <h6>{messages[action]?.[status] ?? messages.default}</h6>
          <span>{t('Returning to application...')}</span>
        </div>
      </Box>
    </Dialog>
  );
};

export default ConnectionStatus;
