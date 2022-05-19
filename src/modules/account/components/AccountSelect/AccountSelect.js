import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { OutlineButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import Table from 'src/theme/table';
import WalletVisual from '@wallet/components/walletVisual';
import styles from './AccountSelect.css';

function AccountRow({ data: { address, username } }) {
  return (
    <button className={styles.accountWraper}>
      <WalletVisual address={address} size={40} />
      <div align="left">
        <b className={`${styles.addressValue}`}>
          {username}
        </b>
        <p className={`${styles.addressValue}`}>
          {address}
        </p>
      </div>
    </button>
  );
}

const AccountSelect = () => {
  const { t } = useTranslation();

  const accounts = [
    {
      address: 'lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t',
      publicKey: '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972',
      username: 'test user',
    },
    {
      address: 'lsk74ar23k2zk3mpsnryxbxf5yf9ystudqmj4oj6e',
      publicKey: '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972',
      username: 'test user',
    },
    {
      address: 'lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t',
      publicKey: '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972',
      username: 'test user',
    },
  ];

  const onAddAccount = () => {};
  const onRemoveAccount = () => {};

  return (
    <>
      <div className={`${styles.accountSelect} ${grid.row}`}>
        <div
          className={`${styles.accountSelectWrapper} ${grid['col-xs-12']} ${grid['col-md-8']} ${grid['col-lg-6']}`}
        >
          <div className={styles.wrapper}>
            <div className={styles.headerWrapper}>
              <h1>{t('Manage accounts')}</h1>
            </div>
            <Box className={styles.accountListWrapper}>
              <Table
                data={accounts}
                header={[]}
                isLoading={false}
                row={AccountRow}
                canLoadMore={false}
                additionalRowProps={{}}
                emptyState={<span>no account</span>}
              />
            </Box>
            <OutlineButton
              className={`${styles.button} ${styles.addAccountBtn}`}
              onAddAccount={onAddAccount}
            >
              <Icon name="walletsMonitor" />
              {' '}
              Add another account
            </OutlineButton>
            <OutlineButton
              className={styles.button}
              onRemoveAccount={onRemoveAccount}
            >
              <Icon name="deleteIcon" />
              {' '}
              Remove an account
            </OutlineButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSelect;
