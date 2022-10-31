import { mountWithRouter } from 'src/utils/testHelpers';
import Result from './Status';

const props = {
  t: s => s,
  transactions: { txSignatureError: null, signedTransaction: {} },
  statusInfo: { locked: 200, unlockable: 100, selfUnvote: undefined },
};

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));

describe('VotingQueue.Result', () => {
  it('renders properly', () => {
    const wrapper = mountWithRouter(Result, props);

    expect(wrapper).toContainMatchingElement('TxBroadcaster');
    expect(wrapper).toContainMatchingElement('button.back-to-wallet-button');
  });

  it('displays the locked message properly', () => {
    const wrapper = mountWithRouter(Result, { ...props, statusInfo: { locked: 200 } });
    const element = wrapper.find('TxBroadcaster');

    expect(element.text()).toContain('0.000002 LSK will be locked for voting.');
  });

  it('displays the unlocked message properly', () => {
    const wrapper = mountWithRouter(Result, { ...props, statusInfo: { unlockable: 300 } });
    const element = wrapper.find('TxBroadcaster');

    expect(element.text()).toContain('0.000003 LSK will be available to unlock in {{unlockTime}}h.');
  });

  it('displays the combined message properly', () => {
    const wrapper = mountWithRouter(Result, {
      ...props, statusInfo: { locked: 200, unlockable: 300 },
    });
    const element = wrapper.find('TxBroadcaster');

    expect(element.text()).toContain('You have now locked 0.000002 LSK for voting and may unlock 0.000003 LSK in {{unlockTime}} hours.');
  });
});
