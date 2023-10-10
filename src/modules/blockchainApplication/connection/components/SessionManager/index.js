import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '@libs/wcm/hooks/useSession';
import DialogLink from '@theme/dialog/link';
import { useAccounts } from '@account/hooks';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import Table from 'src/theme/table';
import SessionRow from './SessionRow';
import header from './tableHeader';
import styles from './SessionManager.css';

const SessionManager = () => {
  const history = useHistory();
  const { sessions, disconnect, hasLoaded } = useSession();
  const { t } = useTranslation();
  const { accounts } = useAccounts();

  return (
    <Box main isLoading={!hasLoaded} className={`${styles.wrapper} pairings-list-box`}>
      <div className={styles.addButtonWrapper}>
        <DialogLink
          history={history}
          component={accounts.length > 0 ? 'connectionProposal' : 'NoAccountView'}
        >
          <PrimaryButton className="add-button">
            <span className={styles.buttonContent}>
              <Icon name="plus" />
              <span>{t('Connect Wallet')}</span>
            </span>
          </PrimaryButton>
        </DialogLink>
      </div>
      <BoxContent className={`${styles.content} pairings-list`}>
        <Table
          showHeader
          headerClassName={styles.tableHeader}
          data={sessions}
          isLoading={!hasLoaded}
          row={SessionRow}
          header={header(t)}
          canLoadMore={false}
          additionalRowProps={{
            t,
            disconnect,
          }}
          emptyState={{
            message: t("You haven't paired with any applications yet."),
            illustration: 'emptyWalletConnectionsIllustration',
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default SessionManager;
