import { MODULE_ASSETS_MAP } from '@transaction/configuration/moduleAssets';

const getTxConfig = (t, transactions) => {
  const { asset, fee } = transactions[0];

  return {
    icon: transactions[0].moduleAssetId === '2:0' ? undefined : MODULE_ASSETS_MAP['2:0'].icon,
    subTitle: transactions[0].moduleAssetId === '2:0' ? t('Amount') : t('Fee'),
    value: transactions[0].moduleAssetId === '2:0' ? asset.amount : fee,
  };
};

export default getTxConfig;
