import * as blocks from '@block/mocks';
import * as legacy from '@legacy/mocks';
import * as network from '@network/mocks';

export default [
  ...Object.values(blocks),
  ...Object.values(legacy),
  ...Object.values(network),
];
