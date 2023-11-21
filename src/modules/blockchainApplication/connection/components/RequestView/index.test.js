import React from 'react';
import { shallow } from 'enzyme';
import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import { useSession } from '@libs/wcm/hooks/useSession';
import Summary from '@wallet/components/RequestSignSummary';
import Status from '@wallet/components/RequestSignStatus';
import RequestSummary from '../RequestSummary';
import RequestView from './RequestView';

jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));
jest.mock('@libs/wcm/hooks/useSession');

describe('RequestView', () => {
  const mockRespond = jest.fn();
  useSession.mockReturnValue({
    respond: mockRespond,
  });

  it('should render properly getting data from URL', () => {
    const wrapper = shallow(<RequestView history={{}} />);

    expect(wrapper).toContainMatchingElement(Dialog);
    expect(wrapper).toContainMatchingElement(MultiStep);
    expect(wrapper).toContainMatchingElement(RequestSummary);
    expect(wrapper).toContainMatchingElement(Summary);
    expect(wrapper).not.toContainMatchingElement('Summary');
    expect(wrapper).toContainMatchingElement(TxSignatureCollector);
    expect(wrapper).not.toContainMatchingElement('TxSignatureCollector');
    expect(wrapper).toContainMatchingElement(Status);
    expect(wrapper).not.toContainMatchingElement('Status');
  });
});
