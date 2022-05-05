/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'src/utils/helpers';
import { selectActiveToken, selectSettings } from '@common/store/selectors';
import { selectSearchParamValue } from 'src/utils/searchParams';
import TabsContainer from 'src/theme/tabs/tabsContainer/tabsContainer';
import Transactions from '@transaction/components/Explorer';
import Overview from './overview';
import DelegateTab from './delegateProfile';
import VotesTab from './votes';

const ExplorerLayout = ({ t, account, history }) => {
  const activeToken = useSelector(selectActiveToken);
  const { discreetMode } = useSelector(selectSettings);
  const address = selectSearchParamValue(history.location.search, 'address');

  useEffect(() => {
    account.loadData();
  }, [address]);

  if (!account || !account.data || isEmpty(account.data)) {
    return <div />;
  }

  const isDelegate = account.data.summary?.isDelegate;

  return (
    <section>
      <Overview
        isWalletRoute={false}
        activeToken={activeToken}
        discreetMode={discreetMode}
        account={account.data}
      />
      <TabsContainer name="main-tabs">
        <Transactions
          pending={[]}
          activeToken={activeToken}
          discreetMode={discreetMode}
          name={t('Transactions')}
          id="transactions"
          address={address}
        />
        {activeToken === 'BTC' ? null : (
          <VotesTab
            history={history}
            address={address}
            name={t('Voting')}
            id="voting"
          />
        )}
        {!isDelegate ? null : (
          <DelegateTab
            tabClassName="delegate-statistics"
            name={t('Delegate profile')}
            id="delegateProfile"
            account={account.data}
          />
        )}
      </TabsContainer>
    </section>
  );
};

export default ExplorerLayout;
