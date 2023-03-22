import React from 'react';
import { shallow } from 'enzyme';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import SendSummary from '@token/fungible/components/SendSummary';
import SendStatus from '@token/fungible/components/SendStatus';
import RequestSummary from '../RequestSummary';
import RequestView from './RequestView';

jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));

describe('RequestView', () => {
  it('should render properly getting data from URL', () => {
    const wrapper = shallow(
      <RequestView history={{}} />
    );

    expect(wrapper).toContainMatchingElement(Dialog);
    expect(wrapper).toContainMatchingElement(MultiStep);
    expect(wrapper).toContainMatchingElement(RequestSummary);
    expect(wrapper).toContainMatchingElement(SendSummary);
    expect(wrapper).not.toContainMatchingElement('SendSummary');
    expect(wrapper).toContainMatchingElement(TxSignatureCollector);
    expect(wrapper).not.toContainMatchingElement('TxSignatureCollector');
    expect(wrapper).toContainMatchingElement(SendStatus);
    expect(wrapper).not.toContainMatchingElement('SendStatus');
  });
});
