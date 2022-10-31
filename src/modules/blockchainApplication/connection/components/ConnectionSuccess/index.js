import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PAIRING_PROPOSAL_STATUS } from '@libs/wcm/constants/lifeCycle';
import { withRouter } from 'react-router';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import { removeSearchParamsFromUrl, parseSearchParams } from 'src/utils/searchParams';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './connectionSuccess.css';

const SessionSuccess = ({ history }) => {
  const { t } = useTranslation();
  const timeout = useRef();
  const { status, name = 'web app' } = parseSearchParams(history.location.search);
  const messages = {
    [PAIRING_PROPOSAL_STATUS.APPROVAL_SUCCESS]: t('Successfully paired with {{name}}', { name }),
    [PAIRING_PROPOSAL_STATUS.APPROVAL_FAILURE]: t('Failed to pair with {{name}}', { name }),
    [PAIRING_PROPOSAL_STATUS.REJECTION_SUCCESS]: t('Rejected the pairing request from {{name}}', { name }),
    [PAIRING_PROPOSAL_STATUS.REJECTION_FAILURE]: t('An error occurred while rejecting the pairing request from {{name}}', { name }),
    default: t('An error occurred while responding to {{name}}', { name }),
  }

  const redirectToHome = () => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      removeSearchParamsFromUrl(history, ['modal', 'status', 'name']);
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
          <h6>{messages[PAIRING_PROPOSAL_STATUS[status] ?? 'default']}</h6>
          <span>{t('Redirecting to dashboard...')}</span>
        </div>
      </Box>
    </Dialog>
  );
};

export default withRouter(SessionSuccess);
