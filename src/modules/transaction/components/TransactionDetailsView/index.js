/* eslint-disable max-statements */
import React, { useMemo, useState } from 'react';
import { withRouter } from 'react-router';
import ReactJson from 'react-json-view';
import { useTranslation } from 'react-i18next';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { isEmpty } from 'src/utils/helpers';
import { parseSearchParams } from 'src/utils/searchParams';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Heading from 'src/modules/common/components/Heading';
import BoxHeader from 'src/theme/box/header';
import Table from 'src/theme/table';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import NotFound from './notFound';
import styles from './styles.css';
import TransactionEvents from '../TransactionEvents';
import { useTransactions } from '../../hooks/queries';
import TransactionDetailRow from '../TransactionDetailRow';
import header from './headerMap';
import { splitModuleAndCommand } from '../../utils';

const TransactionDetails = ({ location }) => {
  const transactionID = parseSearchParams(location.search).transactionID;
  const { t } = useTranslation();
  const [isParamsCollapsed, setIsParamsCollapsed] = useState(false);
  const { data: tokens } = useTokensBalance();
  const token = tokens?.data?.[0] || {};

  const {
    data: transactions,
    error,
    isLoading,
    isFetching,
  } = useTransactions({
    config: { params: { transactionID } },
  });
  const transaction = useMemo(() => transactions?.data?.[0] || {}, [transactions]);
  const transactionDetailList = useMemo(() => {
    if (error || isEmpty(transactions?.data)) return [];

    const { id, moduleCommand, sender = {}, nonce, fee, block = {}, executionStatus } = transaction;
    const [txModule, txType] = splitModuleAndCommand(moduleCommand);

    return [
      {
        label: t('Type'),
        value: `${txModule} ${txType}`,
        isCapitalized: true,
      },
      {
        label: t('Sender'),
        value: sender,
        type: 'address',
      },
      {
        label: t('Fee'),
        value: <TokenAmount val={fee} token={token} />,
      },
      {
        label: t('Date'),
        value: <DateTimeFromTimestamp fulltime time={block.timestamp} />,
      },
      {
        label: t('Nonce'),
        value: nonce,
      },
      {
        label: t('Status'),
        value: executionStatus,
        type: 'status',
      },
      {
        label: t('ID'),
        value: id,
        canCopy: true,
      },
      {
        label: t('Block ID'),
        value: block.id,
        canCopy: true,
        redirectLink: `/block/?=id${block.id}`,
      },
      {
        label: t('Block status'),
        value: block.isFinal ? 'Final' : 'Not final',
      },
      {
        label: t('Block height'),
        value: block.height,
      },
      {
        label: t('Parameters'),
        type: 'expand',
      },
    ];
  }, [transaction]);

  if (error || isEmpty(transactions?.data)) {
    return <NotFound t={t} />;
  }

  return (
    <div className={styles.wrapper}>
      <Heading title="Transaction details" className={styles.heading} />
      <div className={styles.body}>
        <Box isLoading={isLoading} className={styles.container}>
          <BoxHeader>
            <h1>{t('Details')}</h1>
          </BoxHeader>
          <BoxContent>
            <Table
              data={transactionDetailList}
              isLoading={isFetching}
              row={TransactionDetailRow}
              header={header(t)}
              headerClassName={styles.tableHeader}
              additionalRowProps={{
                isParamsCollapsed,
                onToggleJsonView: () => setIsParamsCollapsed((state) => !state),
              }}
            />
            <div
              data-testid="transaction-param-json-viewer"
              className={`${styles.jsonContainer} ${!isParamsCollapsed ? styles.shrink : ''}`}
            >
              <ReactJson name={false} src={transaction.params} />
            </div>
          </BoxContent>
        </Box>
        <Box isLoading={isLoading} className={styles.container}>
          <BoxHeader>
            <h1>{t('Events')}</h1>
          </BoxHeader>
          <BoxContent>
            <TransactionEvents blockId={transaction.block?.id} />
          </BoxContent>
        </Box>
      </div>
    </div>
  );
};

export default withRouter(TransactionDetails);
