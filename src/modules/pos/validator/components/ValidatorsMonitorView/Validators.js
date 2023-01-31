/* eslint-disable complexity */
/* istanbul ignore file */
import React, { useRef, useState, useMemo } from 'react';
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

// eslint-disable-next-line max-statements
const ValidatorsMonitor = ({ watchList, registrations }) => {
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
  const { address } = currentAccount.metadata || {};
  const { data: validators, isLoading: isLoadingValidators } = useValidators({
    config: { params: { address } },
  });
  const isValidator = useMemo(() => !(!validators?.data?.length && !isLoadingValidators), [validators]);

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
        name: t('Inside round'),
        className: 'active',
      },
      {
        value: 'standby',
        name: t('Outside round'),
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
        name: t('Generating details'),
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
            <Link to={address ? routes.sentStakes.path : '#'}>
              <SecondaryButton disabled={!address}>Stakes</SecondaryButton>
            </Link>
            {isValidator ?
              <Link to={`${routes.validatorProfile.path}?address=${address}`} >
                <PrimaryButton className="register-validator">{t('My validator profile')}</PrimaryButton>
              </Link>
              : <DialogLink component="registerValidator">
                <PrimaryButton className="register-validator">{t('Register validator')}</PrimaryButton>
              </DialogLink>
            }
          </div>
        </div>
      </BoxHeader>
      {
        activeDetailTab === 'overview' ? (
          <ValidatorsOverview registrations={registrations} t={t} totalBlocks={total} />
        ) : (
          <GeneratingDetails
            t={t}
            generatedInRound={generatedInRound}
            startTime={blocks[generatedInRound]?.timestamp}
          />
        )
      }
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
    </Box >
  );
};

export default ValidatorsMonitor;
