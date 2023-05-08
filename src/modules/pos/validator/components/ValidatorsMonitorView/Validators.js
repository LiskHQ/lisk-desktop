/* eslint-disable complexity */
/* istanbul ignore file */
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxTabs from 'src/theme/tabs';
import useFilter from 'src/modules/common/hooks/useFilter';
import DialogLink from 'src/theme/dialog/link';
import { useCurrentAccount } from 'src/modules/account/hooks';
import Icon from 'src/theme/Icon';
import { ROUND_LENGTH } from '@pos/validator/consts';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import ValidatorsOverview from '../Overview/ValidatorsOverview';
import GeneratingDetails from '../Overview/GeneratingDetails';
import ValidatorsTable from '../ValidatorsTable';
import LatestStakes from '../LatestStakes';
import { useValidators } from '../../hooks/queries';
import styles from './Validators.css';

const ValidatorActionButton = ({ address, isValidator }) => {
  const { t } = useTranslation();

  if (!address) return null;

  if (isValidator) {
    return (
      <Link to={`${routes.validatorProfile.path}?address=${address}`}>
        <PrimaryButton className="register-validator">{t('My validator profile')}</PrimaryButton>
      </Link>
    );
  }

  return (
    <DialogLink component="registerValidator">
      <PrimaryButton className="register-validator">{t('Register validator')}</PrimaryButton>
    </DialogLink>
  );
};

// eslint-disable-next-line max-statements
const ValidatorsMonitor = ({ watchList }) => {
  const { t } = useTranslation();
  const timeout = useRef();
  const { filters, setFilter } = useFilter({});
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');
  const { data: blocksData } = useBlocks({ config: { params: { limit: 100 } } });
  const [currentAccount] = useCurrentAccount();

  const total = blocksData?.meta?.total ?? 0;
  const blocks = blocksData?.data ?? [];
  const generatedInRound = blocks.length ? blocks[0].height % ROUND_LENGTH : 0;
  const { address } = currentAccount?.metadata || {};
  const { data: validators, isLoading: isLoadingValidators } = useValidators({
    config: { params: { address } },
  });
  const isValidator = validators?.data?.length > 0 && !isLoadingValidators;

  const handleFilter = ({ target: { value } }) => {
    setSearch(value);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setFilter('search', value);
    }, 500);
  };

  const tabs = {
    tabs: [
      {
        value: 'active',
        name: t('Generators'),
        className: 'active',
      },
      {
        value: 'standby',
        name: t('Validators'),
        className: 'standby',
      },
      {
        value: 'sanctioned',
        name: t('Sanctioned'),
        className: 'sanctioned',
      },
      {
        value: 'stakes',
        name: t('Latest stakes'),
        className: 'stakes',
      },
    ],
    active: activeTab,
    onClick: ({ value }) => setActiveTab(value),
  };

  const pageTabs = {
    tabs: [
      {
        value: 'overview',
        name: t('Overview'),
        className: 'overview',
      },
      {
        value: 'generating-details',
        name: t('Generation details'),
        className: 'generating-details',
      },
    ],
    active: activeDetailTab,
    onClick: ({ value }) => setActiveDetailTab(value),
  };

  if (watchList.length) {
    tabs.tabs.push({
      value: 'watched',
      name: t('Watched'),
      className: 'watched',
    });
  }

  const commonProps = {
    blocks,
    activeTab,
    setActiveTab,
    filters,
  };

  const displayTab = (tab) => {
    if (tab === 'stakes') return <LatestStakes filters={filters} />;

    return <ValidatorsTable {...commonProps} />;
  };

  return (
    <Box>
      <BoxHeader className={`${styles.validatorPageWrapper}`}>
        <div className={grid.row}>
          <div className={grid['col-md-8']}>
            <h3>{t('Validators')}</h3>
            <BoxTabs {...pageTabs} />
          </div>
          <div className={grid['col-md-4']}>
            {!!address && (
              <Link to={routes.sentStakes.path}>
                <SecondaryButton>Stakes</SecondaryButton>
              </Link>
            )}
            <ValidatorActionButton isValidator={isValidator} address={address} />
          </div>
        </div>
      </BoxHeader>
      {activeDetailTab === 'overview' ? (
        <ValidatorsOverview t={t} totalBlocks={total} />
      ) : (
        <GeneratingDetails
          t={t}
          generatedInRound={generatedInRound}
          startTime={blocks[generatedInRound]?.timestamp}
        />
      )}
      <Box main>
        <BoxHeader className={`${styles.tabSelector} validators-table`}>
          {tabs.tabs.length === 1 ? <h2>{tabs.tabs[0].name}</h2> : <BoxTabs {...tabs} />}
          <span className={activeTab === 'stakes' ? 'hidden' : ''}>
            <Input
              icon={<Icon className={styles.searchIcon} name="searchActive" />}
              onChange={handleFilter}
              value={search}
              className={`${styles.filterValidators} filter-by-name`}
              size="m"
              placeholder={t('Search by name')}
            />
          </span>
        </BoxHeader>
        <BoxContent className={`${styles.content} validator-box`}>
          {displayTab(activeTab)}
        </BoxContent>
      </Box>
    </Box>
  );
};

export default ValidatorsMonitor;
