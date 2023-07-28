import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ACTIONS, STATUS } from '@libs/wcm/constants/lifeCycle';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import walletConnectFallback from '@setup/react/assets/images/wallet-connect-fallback.svg';
import { parseSearchParams, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { sanitizeTextFromDomains } from 'src/utils/urlUtils';
import styles from './ConnectionStatus.css';

const ConnectionStatus = ({ history }) => {
  const { t } = useTranslation();
  const timeout = useRef();
  const { logoUrl, status, action, name = 'web app' } = parseSearchParams(history.location.search);
  const sanitizedName = sanitizeTextFromDomains(name);

  const messages = {
    [ACTIONS.APPROVE]: {
      [STATUS.SUCCESS]: t('Successfully paired with {{sanitizedName}}', { sanitizedName }),
      [STATUS.FAILURE]: t('Failed to pair with {{sanitizedName}}', { sanitizedName }),
    },
    [ACTIONS.REJECT]: {
      [STATUS.SUCCESS]: t('Rejected the pairing request from {{sanitizedName}}', { sanitizedName }),
      [STATUS.FAILURE]: t(
        'An error occurred while rejecting the pairing request from {{sanitizedName}}',
        {
          sanitizedName,
        }
      ),
    },
    default: t('Encountered an error while connecting to {{sanitizedName}} application.', {
      sanitizedName,
    }),
  };

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
            <img
              src={logoUrl || walletConnectFallback}
              alt="logo"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = walletConnectFallback;
              }}
            />
          </figure>
          <h3>{sanitizedName}</h3>
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
