/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addSearchParamsToUrl, parseSearchParams } from 'src/utils/searchParams';

import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import { isEmpty } from 'src/utils/helpers';
import WelcomeView from '@account/components/AccountDetails/WelcomeView';
import { ManageAccountsContent } from '@account/components/ManageAccounts';
import AccountOverview from '@account/components/AccountDetails/AccountOverview';
import { useAccounts, useCurrentAccount } from '../../hooks';
import styles from './accountDetails.css';

const AccountDetails = () => {
  const history = useHistory();
  const [currentAccount] = useCurrentAccount();
  const { accounts } = useAccounts();
  const { t } = useTranslation();
  const params = parseSearchParams(history.location.search);

  useEffect(() => {
    if (params.recipient !== undefined) {
      addSearchParamsToUrl(history, { modal: 'send' });
    }
  }, []);

  function renderComponent() {
    const isFistAccount = isEmpty(currentAccount) && accounts.length === 0;
    const hasAccount = isEmpty(currentAccount) && accounts.length > 0;

    if (isFistAccount) {
      return <WelcomeView />;
    }
    if (hasAccount) {
      return (
        <section>
          <Box className={styles.manageAccountBoxProp}>
            <BoxHeader>
              <h1>{t('Manage accounts')}</h1>
            </BoxHeader>
            <ManageAccountsContent
              truncate
              isRemoveAvailable
              history={history}
              className={styles.manageAccountsContentProp}
            />
          </Box>
        </section>
      );
    }
    return <AccountOverview address={params?.address} />;
  }

  return renderComponent();
};

export default AccountDetails;
