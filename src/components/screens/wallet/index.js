/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../utils/withData';
import Overview from './overview';
import Transactions from './transactions';
import liskServiceApi from '../../../utils/api/lsk/liskService';

const Wallet = ({ transactions, t }) => {
  const account = useSelector(state => state.account);
  const activeToken = useSelector(state => state.settings.token.active);
  const { discreetMode } = useSelector(state => state.settings);

  return (
    <section>
      <Overview
        t={t}
        account={account.info[activeToken]}
        activeToken={activeToken}
        transactions={transactions.data}
        discreetMode={discreetMode}
      />
      <Transactions
        transactions={transactions}
        t={t}
      />
    </section>
  );
};

const ComposedWallet = compose(
  withData({
    transactions: {
      apiUtil: liskServiceApi.getTransactions,
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
)(Wallet);

export default ComposedWallet;
