import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { withRouter } from 'react-router';
import usePairings from '@libs/wcm/hooks/usePairings';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import Table from 'src/theme/table';
import SessionRow from './SessionRow';
import header from './tableHeader';
import styles from './SessionManager.css';

const SessionManager = ({ history }) => {
  const { pairings, disconnect } = usePairings();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const addApplication = () => {
    addSearchParamsToUrl(history, { modal: 'connectionProposal' });
  };

  useEffect(() => {
    if (Array.isArray(pairings)) {
      setLoading(false);
    }
  }, [pairings]);

  return (
    <Box main isLoading={loading} className={`${styles.wrapper} pairings-list-box`}>
      <div className={styles.addButtonWrapper}>
        <PrimaryButton className="copy-button" onClick={addApplication}>
          <span className={styles.buttonContent}>
            <Icon name="plus" />
            <span>
              {t('Bridge application')}
            </span>
          </span>
        </PrimaryButton>
      </div>
      <BoxContent className={`${styles.content} pairings-list`}>
        <Table
          showHeader
          headerClassName={styles.tableHeader}
          data={pairings.slice(1)}
          isLoading={loading}
          row={SessionRow}
          header={header(t)}
          canLoadMore={false}
          additionalRowProps={{
            t,
            disconnect,
          }}
          emptyState={{
            message: t('You haven\'t paired with any applications yet.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default withRouter(SessionManager);
