import React from 'react';
import moment from 'moment';
import { mount } from 'enzyme';
import { firstBlockTime } from '../../../../constants/datetime';
import defaultState from '../../../../../test/constants/defaultState';
import delegates from '../../../../../test/constants/delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import withForgingStatus from './withForgingStatus';

jest.mock('../../../../utils/api/lsk/liskService', () => ({
  getLastBlocks: jest.fn(() => Promise.resolve([
    {
      id: '3599899182780576212',
      height: 10322981,
      timestamp: 1569853530,
      generatorPublicKey: '88260051bbe6634431f8a2f3ac66680d1ee9ef1087222e6823d9b4d81170edc7',
    },
  ])),
  getNextForgers: jest.fn(() => Promise.resolve([
    {
      publicKey: '88260051bbe6634431f8a2f3ac66680d1ee9ef1087222e6823d9b4d81170edc7',
    },
  ])),
}));

const transformToLiskServiceFormat = ({ account, ...delegate }) => ({
  ...delegate,
  ...account,
});
const delegatesApiResponse = delegates.map(transformToLiskServiceFormat);

describe('withForgingStatus', () => {
  const className = 'dummy';
  const DummyComponent = jest.fn(() => <span className={className} />);
  const delegatesKey = 'delegates';
  const notForgingDeleagte = delegatesApiResponse[0];
  const forgingDelegates = delegatesApiResponse.slice(1);


  const generateBlock = height => ({
    height,
    timestamp: moment(firstBlockTime).unix() + height * 10,
    generatorPublicKey: forgingDelegates[height % forgingDelegates.length].publicKey,
  });

  const generate100Blocks = () => [...Array(100)].map((_, i) => generateBlock(i));

  const props = {
    [delegatesKey]: {
      isLoading: true,
      data: delegatesApiResponse,
      loadData: jest.fn(),
      clearData: jest.fn(),
      urlSearchParams: {},
    },
    latestBlocks: [],
  };

  const setup = (extraProps = {}) => {
    const DummyComponentHOC = withForgingStatus(delegatesKey)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC {...{ ...props, ...extraProps }} />);
    return wrapper;
  };

  afterEach(() => {
    liskService.getLastBlocks.mockReset();
  });

  it('should render passed component', () => {
    const wrapper = setup();
    expect(wrapper).toContainMatchingElement(`.${className}`);
  });

  it('should load blocks if not yet in redux store', () => {
    setup();
    expect(liskService.getLastBlocks).toHaveBeenCalledWith(
      { networkConfig: defaultState.network },
      { limit: 100 },
    );
  });

  it('should load last block of "Not forging" delegate', () => {
    setup({ latestBlocks: generate100Blocks() });
    jest.runAllTimers();
    expect(liskService.getLastBlocks).toHaveBeenCalledWith(
      { networkConfig: defaultState.network },
      { limit: 1, address: notForgingDeleagte.publicKey },
    );
  });
});
