import * as common from 'src/modules/common/mocks';
import * as auth from '@auth/mocks';
import * as blocks from '@block/mocks';
import * as legacy from '@legacy/mocks';
import * as network from '@network/mocks';
import * as tokens from '@token/fungible/mocks';
import * as transactions from '@transaction/mocks';
import * as posValidators from '@pos/validator/mocks';
import * as reward from '@reward/mocks';
import * as posRewards from '@pos/reward/mocks';
import * as blockchainApplicationExplore from '@blockchainApplication/explore/mocks';
import * as blockchainApplicationManage from '@blockchainApplication/manage/mocks';

export default [
  ...Object.values(auth),
  ...Object.values(blocks),
  ...Object.values(common),
  ...Object.values(blockchainApplicationExplore),
  ...Object.values(blockchainApplicationManage),
  ...Object.values(posValidators),
  ...Object.values(legacy),
  ...Object.values(network),
  ...Object.values(tokens),
  ...Object.values(transactions),
  ...Object.values(posRewards),
  ...Object.values(reward),
];
