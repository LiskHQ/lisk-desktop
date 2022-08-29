import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import BoxTabs from 'src/theme/tabs';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
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
import { useBlocks } from '../../hooks/queries/useBlocks';
import styles from './blockDetails.css';

const Generator = ({ generatorAddress, generatorUsername }) => {
  if (generatorUsername && generatorAddress) {
    return (
      <Link
        className={styles.generator}
        to={`${routes.explorer.path}?address=${generatorAddress}`}
      >
        <WalletVisual
          className={styles.avatar}
          address={generatorAddress}
          size={30}
        />
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
    value: (
      <DateTimeFromTimestamp time={data.timestamp} />
    ),
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
        generatorAddress={data.generatorAddress}
        generatorUsername={data.generatorUsername}
      />
    ),
  },
  totalForged: {
    label: t('Total forged'),
    value: <TokenAmount val={data.totalForged} token={token} />,
  },
  reward: {
    label: t('Reward'),
    value: <TokenAmount val={data.reward} token={token} />,
  },
  totalBurnt: {
    label: t('Total burnt'),
    value: <TokenAmount val={data.totalBurnt} token={token} />,
  },
  totalFee: {
    label: t('Total fee'),
    value: <TokenAmount val={data.totalFee} token={token} />,
  },
});

const Rows = ({ data, t, currentHeight }) => {
  const token = tokenMap.LSK.key;
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

const BlockDetails = ({
  currentHeight, height, id,
}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState({ params: {} });
  const { data: blocks, error, isLoading } = useBlocks({ config });
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    // Ensure query supports both ID and height
    if (id && !height) {
      setConfig({ params: { blockID: id } });
    }
    if (!id && height) {
      setConfig({ params: { height } });
    }
    if (id && height) {
      setConfig({ params: { blockID: id, height } });
    }
  }, [id, height]);

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

  return (
    <div>
      <Box isLoading={isLoading} width="full">
        <BoxHeader>
          <h1>{t('Block details')}</h1>
        </BoxHeader>
        <BoxContent>
          {error ? (
            <Feedback
              message={t('Failed to load block details.')}
              status="error"
            />
          ) : (
            <Rows
              data={blocks?.data ?? {}}
              currentHeight={currentHeight}
              t={t}
            />
          )}
        </BoxContent>
      </Box>
      <Box>
        <BoxHeader>
          <BoxTabs {...tabs} />
        </BoxHeader>
        <BoxContent>
          {activeTab === 'transactions' ? <Transactions blockId={id} /> : <div>eniola</div>}
        </BoxContent>
      </Box>
    </div>
  );
};

export default BlockDetails;
