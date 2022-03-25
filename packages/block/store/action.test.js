import { actionTypes } from '@common/configuration';
import networks from '@network/configuration/networks';
import { getBlocks } from '@block/utilities/api';
import { getForgers, getDelegates } from '@dpos/utilities/api';
import blocks from '../../../tests/constants/blocks';
import forger from '@fixtures/forgers';
import delegate from '@fixtures/delegates';
import { olderBlocksRetrieved, forgersRetrieved } from './action';

jest.mock('@block/utilities/api', () => ({
  getBlocks: jest.fn(),
}));
jest.mock('@dpos/utilities/api', () => ({
  getForgers: jest.fn(),
  getDelegates: jest.fn(),
}));

describe('action: blocks', () => {
  const getState = () => ({
    network: {
      name: networks.mainnet.name,
      networks: {
        LSK: {
          serviceUrl: 'http://example.api',
        },
      },
    },
    blocks: {
      latestBlocks: [
        {
          ...blocks[0],
          height: 10322967,
        },
        blocks[1],
        blocks[2],
      ],
    },
  });

  const dispatch = jest.fn();

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('olderBlocksRetrieved', () => {
    it('should get blocks by batch and converts the block timestamp', async () => {
      const receivedBlock = {
        id: 'c4591583a761d6ad26632f8bfead1214ed42fabc8adb1d3957129277d9efeed1',
        height: 14730631,
        version: 2,
        timestamp: 1633345430,
        generatorAddress: 'lskgtrrftvoxhtknhamjab5wenfauk32z9pzk79uj',
        generatorPublicKey:
          '974bcc5ad09e80f48a81a1425eddfe4af3f332264a9b418196cb2c11e73f61f8',
        generatorUsername: 'grumlin',
        transactionRoot:
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        signature:
          'ca1069abb04b39bb232c61e5d6a230a1bff81c24b26ef6594998a8a75df7b9f94e2d31a4dbb704d7ecc93b9e8d65d9d0d8b0e24f356ca0bd802614118572070b',
        previousBlockId:
          '63640f2b98863854119b3669f069d6d1477b8bf678229bfa83a0f21d3de78525',
        numberOfTransactions: 0,
        totalForged: '100000000',
        totalBurnt: '0',
        totalFee: '0',
        reward: '100000000',
        isFinal: true,
        maxHeightPreviouslyForged: 14730515,
        maxHeightPrevoted: 14730563,
        seedReveal: '9e447a6ef6a39fac5ca85f36da8081ac',
      };
      getBlocks.mockResolvedValue({
        data: [receivedBlock],
        meta: { count: 1, offset: 0, total: 1 },
      });

      await olderBlocksRetrieved()(dispatch, getState);

      expect(getBlocks).toBeCalledTimes(2);
      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toBeCalledWith({
        type: actionTypes.olderBlocksRetrieved,
        data: {
          total: 1,
          list: [
            {
              ...receivedBlock,
              timestamp: 169236230,
            },
            {
              ...receivedBlock,
              timestamp: 169236230,
            },
          ],
        },
      });
    });
  });

  describe('forgersRetrieved', () => {
    it('dispatches a forgersRetrieved action', async () => {
      getForgers.mockResolvedValue({
        data: null,
      });

      await forgersRetrieved()(dispatch, getState);

      expect(getForgers).toBeCalledTimes(1);
      expect(getDelegates).not.toBeCalled();
      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toBeCalledWith({
        type: actionTypes.forgersRetrieved,
        data: {
          forgers: [],
          indexBook: {},
        },
      });
    });

    it('checks previous blocks and defines missed blocks', async () => {
      const forger1 = {
        ...forger,
        username: 'menfei',
        state: 'forging',
        address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y97',
      };
      const forger2 = {
        ...forger,
        state: 'awaitingSlot',
        address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y98',
      };
      const forger3 = {
        ...forger,
        state: 'missedBlock',
        address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
      };
      getForgers.mockResolvedValue({
        data: [forger1, forger2, forger3],
        meta: {
          count: 100,
          offset: 25,
          total: 43749,
        },
        links: {},
      });
      const delegate1 = {
        ...delegate,
        summary: {
          ...delegate.summary,
          address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y97',
        },
      };
      const delegate2 = {
        ...delegate,
        summary: {
          ...delegate.summary,
          address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y98',
        },
      };
      const delegate3 = {
        ...delegate,
        summary: {
          ...delegate.summary,
          address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
        },
      };
      getDelegates.mockResolvedValue({
        data: [delegate1, delegate2, delegate3],
      });

      await forgersRetrieved()(dispatch, getState);

      expect(getForgers).toBeCalledTimes(1);
      expect(getDelegates).toBeCalledTimes(1);
      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toBeCalledWith({
        type: actionTypes.forgersRetrieved,
        data: {
          forgers: [forger1, forger2, forger3],
          indexBook: {
            lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y97: 0,
            lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y98: 1,
            lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99: 2,
          },
        },
      });
    });
  });
});
