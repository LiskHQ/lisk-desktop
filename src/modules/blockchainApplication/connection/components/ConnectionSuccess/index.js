import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { withRouter } from 'react-router';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './connectionSuccess.css';

const SessionSuccess = ({ history }) => {
  const { t } = useTranslation();
  const { data } = useContext(ConnectionContext);

  const redirectToHome = () => {
    setTimeout(() => {
      removeSearchParamsFromUrl(history, ['modal']);
    }, 1000);
  };

  useEffect(() => {
    redirectToHome();
  });

  if (!data.proposal?.params?.proposer) {
    return <div />;
  }

  const { proposer } = data.proposal.params;
  const hasError = history.location.search.indexOf('error') > -1;

  return (
    <Dialog className={styles.wrapper}>
      <Box>
        <div className={styles.wrapper}>
          <figure>
            <img src={liskLogo} />
          </figure>
          <h3>{proposer.metadata.name}</h3>
        </div>
        <div>
          {
            hasError
              ? <h6 className={styles.error}>{t('Connection failed!')}</h6>
              : <h6>{t('Connection successful!')}</h6>
          }
          <span>{t('Redirecting to dashboard...')}</span>
        </div>
      </Box>
    </Dialog>
  );
};

export default withRouter(SessionSuccess);
