/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from '@common/utilities/helpers';
import { selectActiveToken, selectSettings } from '@common/store/selectors';
import { selectSearchParamValue } from '@screens/router/searchParams';
import TabsContainer from '@basics/tabs/tabsContainer/tabsContainer';
import Overview from './overview';
import DelegateTab from './delegateProfile';
import VotesTab from './votes';
import Transactions from './transactions';

const ExplorerLayout = ({
  t, account, history,
}) => {
  const activeToken = useSelector(selectActiveToken);
  const { discreetMode } = useSelector(selectSettings);
  const address = selectSearchParamValue(history.location.search, 'address');

  useEffect(() => {
    account.loadData();
  }, [address]);

  if (!account || !account.data || isEmpty(account.data)) return (<div />);

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
        {activeToken !== 'BTC' ? (
          <VotesTab
            history={history}
            address={address}
            name={t('Voting')}
            id="voting"
          />
        ) : null}
        {isDelegate
          ? (
            <DelegateTab
              tabClassName="delegate-statistics"
              name={t('Delegate profile')}
              id="delegateProfile"
              account={account.data}
            />
          )
          : null}
      </TabsContainer>
    </section>
  );
};

export default ExplorerLayout;
