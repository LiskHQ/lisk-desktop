import * as blocks from '@block/mocks';
import * as network from '@network/mocks';

export default [
  ...Object.values(blocks),
  ...Object.values(network),
];
