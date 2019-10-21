import React from 'react';
import { mount } from 'enzyme';
import defaultState from '../../../../../test/constants/defaultState';
import delegates from '../../../../../test/constants/delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import withForgingStatus from './withForgingStatus';

jest.mock('../../../../utils/api/lsk/liskService', () => ({
  getLastBlocks: jest.fn(() => Promise.resolve([])),
  getNextForgers: jest.fn(() => Promise.resolve([])),
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
