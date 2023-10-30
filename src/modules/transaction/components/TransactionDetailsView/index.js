/* eslint-disable max-statements */
import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'src/utils/helpers';
import { parseSearchParams } from 'src/utils/searchParams';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Heading from 'src/modules/common/components/Heading';
import BoxHeader from 'src/theme/box/header';
import Table from 'src/theme/table';
import { useTheme } from 'src/theme/Theme';
import { useAppsMetaTokens } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import NotFound from './notFound';
import styles from './styles.css';
import TransactionEvents from '../TransactionEvents';
import { useFees, useTransactions } from '../../hooks/queries';
import TransactionDetailRow from '../TransactionDetailRow';
import header from './headerMap';
import { splitModuleAndCommand } from '../../utils';

const TransactionDetails = () => {
  const { search } = useLocation();
  const transactionID = parseSearchParams(search).transactionID;
  const showParams = JSON.parse(parseSearchParams(search).showParams || 'false');
  const { t } = useTranslation();
  const [isParamsCollapsed, setIsParamsCollapsed] = useState(showParams);
  const { data: fees } = useFees();
  const feeTokenID = fees?.data?.feeTokenID;
  const { data: token } = useAppsMetaTokens({
    config: { params: { tokenID: feeTokenID }, options: { enabled: !!feeTokenID } },
  });
  const feeToken = token?.data[0];

  const theme = useTheme();
  const jsonViewerTheme = theme === 'dark' ? 'tomorrow' : 'rjv-default';

  const {
    data: transaction,
    error,
    isLoading,
    isFetching,
  } = useTransactions({
    config: { params: { transactionID } },
  });
  const transactionData = useMemo(() => transaction?.data?.[0] || {}, [transaction]);
  const transactionMetaData = useMemo(() => {
    if (error || isEmpty(transactionData)) return [];

    const {
      id,
      moduleCommand,
      sender = {},
      nonce,
      fee,
      block = {},
      executionStatus,
    } = transactionData;
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
        value: <TokenAmount val={fee} token={feeToken} />,
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
        label: t('Execution status'),
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
        redirectLink: `/block?id=${block.id}`,
      },
      {
        label: t('Block status'),
        value: block.isFinal ? 'Final' : 'Pending',
      },
      {
        label: t('Block height'),
        value: block.height,
        redirectLink: `/block?id=${block.id}`,
      },
      {
        label: t('Parameters'),
        type: 'expand',
      },
    ];
  }, [transactionData]);

  if (error || (isEmpty(transactionMetaData) && !isFetching)) {
    return <NotFound t={t} />;
  }

  return (
    <div className={styles.wrapper}>
      <Heading title={t('Transaction')} />
      <div className={styles.body}>
        <Box isLoading={isLoading} className={styles.container}>
          <BoxHeader>
            <h1>{t('Details')}</h1>
          </BoxHeader>
          <BoxContent>
            <Table
              data={transactionMetaData}
              isLoading={isLoading}
              row={TransactionDetailRow}
              header={header(t)}
              headerClassName={styles.tableHeader}
              additionalRowProps={{
                isParamsCollapsed,
                onToggleJsonView: () => setIsParamsCollapsed((state) => !state),
              }}
            />
            {!isLoading && (
              <div
                data-testid="transaction-param-json-viewer"
                className={`${styles.jsonContainer} ${!isParamsCollapsed ? styles.shrink : ''}`}
              >
                <ReactJson name={false} src={transactionData.params} theme={jsonViewerTheme} />
              </div>
            )}
          </BoxContent>
        </Box>
        <Box isLoading={isLoading} className={styles.container}>
          <BoxHeader>
            <h1>{t('Events')}</h1>
          </BoxHeader>
          <BoxContent>
            <TransactionEvents transactionID={transactionID} />
          </BoxContent>
        </Box>
      </div>
    </div>
  );
};

export default TransactionDetails;
