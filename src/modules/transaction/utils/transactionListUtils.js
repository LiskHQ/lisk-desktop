import { MODULE_COMMANDS_MAP } from 'src/modules/transaction/configuration/moduleCommand';

const getTxConfig = (t, transactions) => {
  const { params, fee } = transactions[0];

  return {
    icon:
      transactions[0].moduleCommand === 'token:transfer'
        ? undefined
        : MODULE_COMMANDS_MAP['token:transfer'].icon,
    subTitle: transactions[0].moduleCommand === 'token:transfer' ? t('Amount') : t('Fee'),
    value: transactions[0].moduleCommand === 'token:transfer' ? params.amount : fee,
  };
};

export default getTxConfig;
