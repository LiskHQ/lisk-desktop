import { MODULE_COMMANDS_MAP } from '@transaction/configuration/moduleAssets';

const getTxConfig = (t, transactions) => {
  const { params, fee } = transactions[0];

  return {
    icon: transactions[0].moduleCommandID === '2:0' ? undefined : MODULE_COMMANDS_MAP['2:0'].icon,
    subTitle: transactions[0].moduleCommandID === '2:0' ? t('Amount') : t('Fee'),
    value: transactions[0].moduleCommandID === '2:0' ? params.amount : fee,
  };
};

export default getTxConfig;
