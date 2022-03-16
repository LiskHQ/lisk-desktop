/* istanbul ignore file */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withData from '@utils/withData';
import { getAccount } from '@api/account';
import { selectSearchParamValue } from '@utils/searchParams';
import { isEmpty } from '@utils/helpers';
import { selectActiveToken, selectSettings } from '@store/selectors';
import TabsContainer from '@toolbox/tabsContainer/tabsContainer';
import Overview from './overview';
import DelegateTab from './delegateProfile';
import VotesTab from './votes';
import Transactions from './transactions';

const Wallet = ({
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

const apis = {
  account: {
    apiUtil: (network, { token, ...params }) => getAccount({ network, params }, token),
    defaultData: {},
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      address: selectSearchParamValue(props.history.location.search, 'address'),
      network: state.network,
    }),
    transformResponse: response => response,
  },
};

const ComposedWallet = compose(
  withData(apis),
  withTranslation(),
)(Wallet);

export default ComposedWallet;
