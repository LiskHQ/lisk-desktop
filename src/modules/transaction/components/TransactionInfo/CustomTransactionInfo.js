import React from 'react';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import ClaimRewardsSummaryContent from '@transaction/components/ClaimRewardsSummaryContent';
import { ChangeCommissionInfo } from '@pos/validator/components/ChangeCommission/Info/ChangeCommissionInfo';
import StakeValidator from '../StakeValidate';
import Reclaim from '../Reclaim';
import Send from '../Send';
import RegisterValidator from '../RegisterValidator';
import UnlockBalance from '../UnlockBalance';
import RegisterMultisignatureGroup from '../RegisterMultisignatureGroup';
import GenericTxParams from '../GenericTxParams';

export default (props) => {
  switch (props.formProps.moduleCommand) {
    case MODULE_COMMANDS_NAME_MAP.reclaim: return <Reclaim {...props} />;
    case MODULE_COMMANDS_NAME_MAP.registerValidator: return <RegisterValidator {...props} />;
    case MODULE_COMMANDS_NAME_MAP.transfer:
    case MODULE_COMMANDS_NAME_MAP.crossChainTransfer: return <Send {...props} />;
    case MODULE_COMMANDS_NAME_MAP.stake: return <StakeValidator {...props} />;
    case MODULE_COMMANDS_NAME_MAP.changeCommission: return <ChangeCommissionInfo {...props} />;
    case MODULE_COMMANDS_NAME_MAP.claimRewards: return <ClaimRewardsSummaryContent {...props} />;
    case MODULE_COMMANDS_NAME_MAP.unlock: return <UnlockBalance {...props} />;
    case MODULE_COMMANDS_NAME_MAP.registerMultisignature:
      return <RegisterMultisignatureGroup {...props} />;
    default:
      return <GenericTxParams {...props} />;
  }
};
