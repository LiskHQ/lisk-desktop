import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import BoxTabs from 'src/theme/tabs';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import Heading from 'src/modules/common/components/Heading/Heading';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Feedback from 'src/theme/feedback/feedback';
import LabeledValue from 'src/theme/labeledValue';
import TokenAmount from '@token/fungible/components/tokenAmount';
import Transactions from '@transaction/components/BlockDetailsTransactions';
import { truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import TransactionEvents from '@transaction/components/TransactionEvents';
import { useBlocks } from '../../hooks/queries/useBlocks';
import { useLatestBlock } from '../../hooks/queries/useLatestBlock';
import styles from './blockDetails.css';

const Generator = ({ generatorAddress, generatorUsername }) => {
  if (generatorUsername && generatorAddress) {
    return (
      <Link className={styles.generator} to={`${routes.explorer.path}?address=${generatorAddress}`}>
        <WalletVisual className={styles.avatar} address={generatorAddress} size={30} />
        <span>{generatorUsername}</span>
      </Link>
    );
  }

  return <span>None (Genesis block)</span>;
};

const getFields = (data = {}, token, t, currentHeight) => ({
  id: {
    label: t('Block ID'),
    value: (
      <CopyToClipboard
        text={truncateAddress(data.id)}
        value={data.id}
        className="tx-id"
        containerProps={{
          size: 'xs',
          className: 'copy-title',
        }}
        copyClassName={styles.copyIcon}
      />
    ),
  },
  height: {
    label: t('Height'),
    value: <CopyToClipboard value={data.height} />,
  },
  date: {
    label: t('Date'),
    value: <DateTimeFromTimestamp time={data.timestamp} />,
  },
  confirmations: {
    label: t('Confirmations'),
    value: data.height ? currentHeight - data.height : '-',
  },
  version: {
    label: t('Version'),
    value: data.version,
  },
  generator: {
    label: t('Generated by'),
    value: (
      <Generator
        generatorAddress={data.generator?.address ?? ''}
        generatorUsername={data.generator?.name ?? ''}
      />
    ),
  },
  reward: {
    label: t('Reward'),
    value: <TokenAmount val={data.reward} token={token} />,
  },
  totalBurnt: {
    label: t('Total burnt'),
    value: <TokenAmount val={data.totalBurnt} token={token} />,
  },
  networkFee: {
    label: t('Network fee'),
    value: <TokenAmount val={data.networkFee} token={token} />,
  },
  totalGenerated: {
    label: t('Status'),
    value: data.isFinal ? 'Final' : 'Pending',
  },
});

const Rows = ({ data, t, currentHeight }) => {
  const { data: tokens } = useTokenBalances();
  const token = tokens?.data?.[0] || {};

  const fields = getFields(data, token, t, currentHeight);

  const columns = Object.keys(fields).map((field) => (
    <LabeledValue
      key={field}
      label={fields[field].label}
      className={`${styles.dataRow} block-${field}`}
    >
      {fields[field].value}
    </LabeledValue>
  ));

  return <div className={styles.dataContainer}>{columns}</div>;
};

const BlockDetails = ({ height, id, history }) => {
  const {
    data: { height: currentHeight },
  } = useLatestBlock();
  const { t } = useTranslation();
  const {
    data: blocks,
    error,
    isLoading,
  } = useBlocks({
    config: {
      params: {
        ...(id && { blockID: id }),
        ...(height && { height }),
      },
    },
  });
  const [activeTab, setActiveTab] = useState('transactions');

  const tabs = {
    tabs: [
      {
        value: 'transactions',
        name: t('Transactions'),
        className: 'transactions',
      },
      {
        value: 'events',
        name: t('Events'),
        className: 'events',
      },
    ],
    active: activeTab,
    onClick: ({ value }) => setActiveTab(value),
  };

  const handleBackToBlocksMonitorPage = () => {
    history.push(routes.blocks.path);
  };

  return (
    <div className={styles.blockDetailsWrapper}>
      <Box isLoading={isLoading} width="full">
        <BoxHeader>
          <Heading title={t('Block details')} onGoBack={handleBackToBlocksMonitorPage} />
        </BoxHeader>
        <BoxContent className={error ? styles.errorFeedbackWrapper : ''}>
          {error ? (
            <Feedback
              className={styles.feedback}
              message={t('Failed to load block details.')}
              status="error"
            />
          ) : (
            <Rows data={blocks?.data?.[0] || {}} currentHeight={currentHeight} t={t} />
          )}
        </BoxContent>
      </Box>
      <Box className={styles.wrapper}>
        <BoxHeader>
          <BoxTabs {...tabs} />
        </BoxHeader>
        <BoxContent className={styles.content}>
          {activeTab === 'transactions' ? (
            <Transactions blockId={id} />
          ) : (
            <TransactionEvents blockID={id} />
          )}
        </BoxContent>
      </Box>
    </div>
  );
};

export default BlockDetails;
