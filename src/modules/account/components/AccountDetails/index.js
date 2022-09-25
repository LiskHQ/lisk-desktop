/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { parseSearchParams, addSearchParamsToUrl } from 'src/utils/searchParams';
import { transactionsRetrieved } from 'src/redux/actions';
import {
  selectAccount,
  selectActiveToken,
  selectSettings,
  selectTransactions,
} from 'src/redux/selectors';
import TabsContainer from 'src/theme/tabs/tabsContainer/tabsContainer';
import Transactions from '@transaction/components/WalletTransactions';
import Overview from '@wallet/components/overview/overview';
import TransactionEvents from '@transaction/components/TransactionEvents';

const AccountDetails = ({ t, history }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectAccount);
  const activeToken = useSelector(selectActiveToken);
  const { discreetMode } = useSelector(selectSettings);
  const { confirmed, pending } = useSelector(selectTransactions);
  const { address } = account.info[activeToken].summary;

  useEffect(() => {
    dispatch(transactionsRetrieved({ address }));
  }, [confirmed.length]);

  useEffect(() => {
    const params = parseSearchParams(history.location.search);
    if (params.recipient !== undefined) {
      addSearchParamsToUrl(history, { modal: 'send' });
    }
  }, []);
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
      <TabsContainer name="main-tabs">
        <Transactions
          pending={pending || []}
          confirmedLength={confirmed.length}
          activeToken={activeToken}
          discreetMode={discreetMode}
          name={t('Transactions')}
          id="Transactions"
          address={address}
        />
        <TransactionEvents address={address} name={t('Events')} id="Transaction Events" />
      </TabsContainer>
    </section>
  );
};

export default compose(withRouter, withTranslation())(AccountDetails);
