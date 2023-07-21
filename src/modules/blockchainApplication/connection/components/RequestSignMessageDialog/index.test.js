import React from 'react';
import { shallow } from 'enzyme';
import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import { RequestSignMessageConfirmation } from '@blockchainApplication/connection/components/RequestSignMessageDialog/RequestSignMessageConfirmation';
import SignedMessage from '@message/components/signedMessage';
import { useSession } from '@libs/wcm/hooks/useSession';
import { context as defaultContext } from '@blockchainApplication/connection/__fixtures__/requestSummary';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import RequestSignMessageDialog from './index';

jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@libs/wcm/hooks/useEvents');
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

const reject = jest.fn();
useSession.mockReturnValue({ reject, sessionRequest: defaultContext.sessionRequest });
useEvents.mockReturnValue({
  events: [
    ...defaultContext.events,
    {
      name: EVENTS.SESSION_PROPOSAL,
      meta: {
        id: '1',
        params: {
          chainId: 'lisk:00000001',
          request: {
            params: {
              recipientChainID: '00000001',
            },
          },
        },
      },
    },
  ],
});

describe('RequestSignMessageDialog', () => {
  it('should render properly getting data from URL', () => {
    const wrapper = shallow(<RequestSignMessageDialog history={{}} />);

    expect(wrapper).toContainMatchingElement(Dialog);
    expect(wrapper).toContainMatchingElement(MultiStep);
    expect(wrapper).toContainMatchingElement(RequestSignMessageConfirmation);
    expect(wrapper).toContainMatchingElement(TxSignatureCollector);
    expect(wrapper).toContainMatchingElement(SignedMessage);
  });
});
