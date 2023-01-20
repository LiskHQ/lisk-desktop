import React from 'react';
import { shallow } from 'enzyme';
import Dialog from '@theme/dialog/dialog';
import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import ClaimRewardsForm from '@pos/validator/components/ClaimRewardsForm';
import ClaimRewardsView from './index';

describe('ClaimRewardsView', () => {
  it('should render properly', () => {
    const wrapper = shallow(<ClaimRewardsView history={{}} />);

    expect(wrapper).toContainMatchingElement(Dialog);
    expect(wrapper).toContainMatchingElement(MultiStep);
    expect(wrapper).toContainMatchingElement(ClaimRewardsForm);
    expect(wrapper).toContainMatchingElement(TxSignatureCollector);
  });
});
