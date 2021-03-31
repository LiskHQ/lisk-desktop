/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { parseSearchParams, addSearchParamsToUrl } from '@utils/searchParams';
import { transactionsRetrieved } from '@actions';
import { isEmpty } from '@utils/helpers';
import {
  selectAccount,
  selectActiveToken,
  selectSettings,
  selectTransactions,
} from '@store/selectors';
import Overview from './overview';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import DelegateTab from './delegateProfile';
import VotesTab from './votes';
import Transactions from './transactions';

const Wallet = ({ t, history }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectAccount);
  const activeToken = useSelector(selectActiveToken);
  const { discreetMode } = useSelector(selectSettings);
  const { confirmed, pending } = useSelector(selectTransactions);
  const isDelegate = !!account.info[activeToken].summary?.isDelegate;

  useEffect(() => {
    if (!confirmed.length && account.info && !isEmpty(account.info)) {
      const { address } = account.info[activeToken];
      dispatch(transactionsRetrieved({ address }));
    }
  }, [account.info]);

  useEffect(() => {
    const params = parseSearchParams(history.location.search);
    if (params.recipient !== undefined) {
      addSearchParamsToUrl(history, { modal: 'send' });
    }
  }, []);

  if (!account || !account.info || isEmpty(account.info)) return (<div />);

  return (
    <section>
      <Overview
        isWalletRoute
        activeToken={activeToken}
        discreetMode={discreetMode}
        account={account.info[activeToken]}
        hwInfo={account.hwInfo}
        transactions={confirmed}
      />
      <TabsContainer>
        <Transactions
          pending={pending || []}
          activeToken={activeToken}
          discreetMode={discreetMode}
          tabName={t('Transactions')}
          tabId="Transactions"
          address={account.info[activeToken].address}
        />
        {activeToken !== 'BTC' ? (
          <VotesTab
            history={history}
            address={account.info[activeToken].address}
            tabName={t('Votes')}
            tabId="votes"
          />
        ) : null}
        {isDelegate
          ? (
            <DelegateTab
              tabClassName="delegate-statistics"
              tabName={t('Delegate profile')}
              tabId="delegateProfile"
              account={account.info[activeToken]}
            />
          )
          : null}
      </TabsContainer>
    </section>
  );
};

export default withTranslation()(Wallet);
