/* eslint-disable max-statements */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'src/utils/helpers';
import { parseSearchParams, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Heading from 'src/modules/common/components/Heading';
import BoxHeader from 'src/theme/box/header';
import Table from 'src/theme/table';
import { useTheme } from 'src/theme/Theme';
import { useNetworkSupportedTokens } from '@token/fungible/hooks/queries/useNetworkSupportedTokens';
import TokenAmount from '@token/fungible/components/tokenAmount';
import DateTimeFromTimestamp from '@common/components/timestamp';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import NotFound from './notFound';
import styles from './styles.css';
import TransactionEvents from '../TransactionEvents';
import { useFees, useTransactions } from '../../hooks/queries';
import TransactionDetailRow from '../TransactionDetailRow';
import header from './headerMap';
import { getTransactionValue, splitModuleAndCommand } from '../../utils';

const TransactionDetails = () => {
  const { search } = useLocation();
  const history = useHistory();
  const paramsJsonViewRef = useRef();
  const transactionID = parseSearchParams(search).transactionID;
  const showParams = JSON.parse(parseSearchParams(search).showParams || 'false');
  const { t } = useTranslation();
  const [isParamsCollapsed, setIsParamsCollapsed] = useState(showParams);
  const { data: fees } = useFees();
  const feeTokenID = fees?.data?.feeTokenID;
  const [currentApplication] = useCurrentApplication();
  const { data: appsMetaTokens } = useNetworkSupportedTokens(currentApplication);
  const feeToken = appsMetaTokens?.find((token) => token.tokenID === feeTokenID);

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
      meta,
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
      meta?.recipient && {
        label: t('Recipient'),
        value: meta.recipient,
        type: 'address',
      },
      {
        label: t('Fee'),
        value: <TokenAmount val={fee} token={feeToken} />,
      },
      {
        label: t('Value'),
        value: getTransactionValue(transactionData, feeToken, appsMetaTokens),
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
    ].filter((value) => value);
  }, [transactionData]);

  if (error || (isEmpty(transactionMetaData) && !isFetching)) {
    return <NotFound t={t} />;
  }

  useEffect(() => {
    if (showParams && paramsJsonViewRef.current) paramsJsonViewRef.current.scrollIntoView();

    setIsParamsCollapsed(showParams);
  }, [showParams]);

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
                onToggleJsonView: () => {
                  setIsParamsCollapsed((state) => {
                    if (state) removeSearchParamsFromUrl(history, ['showParams']);
                    return !state;
                  });
                },
              }}
            />
            {!isLoading && (
              <div
                ref={paramsJsonViewRef}
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
