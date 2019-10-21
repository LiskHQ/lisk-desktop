import React from 'react';
import { mount } from 'enzyme';
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

describe('withForgingStatus', () => {
  const className = 'dummy';
  const DummyComponent = () => <span className={className} />;
  const delegatesKey = 'delegates';

  const props = {
    [delegatesKey]: {
      isLoading: true,
      data: delegates,
      loadData: jest.fn(),
      clearData: jest.fn(),
      urlSearchParams: {},
    },
  };

  const setup = () => {
    const DummyComponentHOC = withForgingStatus(delegatesKey)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC {...props} />);
    return wrapper;
  };

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
});
