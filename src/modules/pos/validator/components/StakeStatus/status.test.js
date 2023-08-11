import { mountWithRouter, mountWithRouterAndQueryClient, smartRender } from 'src/utils/testHelpers';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import StakeStatus from '.';

const props = {
  t: (s) => s,
  transactions: { txSignatureError: null, signedTransaction: {} },
  statusInfo: { locked: 200, unlockable: 100, selfUnstake: undefined },
  posToken: mockAppsTokens.data[0],
  formProps: {
    rewards: { total: 0n },
  },
};

jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));
jest.mock('@network/hooks/useCommandsSchema');

describe('StakingQueue.Result', () => {
  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('renders properly', () => {
    const wrapper = mountWithRouter(StakeStatus, props);

    expect(wrapper).toContainMatchingElement('StakeSuccessfulModal');
  });

  it('displays the locked message properly', () => {
    const wrapper = mountWithRouterAndQueryClient(StakeStatus, {
      ...props,
      statusInfo: { locked: 200 },
    });
    const element = wrapper.find('StakeSuccessfulModal');

    expect(element.text()).toContain('0.000002 LSK will be locked for staking.');
  });

  it('displays the unlocked message properly', () => {
    const wrapper = mountWithRouterAndQueryClient(StakeStatus, {
      ...props,
      statusInfo: { unlockable: 300 },
    });
    const element = wrapper.find('BoxContent');

    expect(element.text()).toContain(
      ' 0.000003 LSK will be available to unlock when the locking period ends.'
    );
  });

  it('displays the unlocked message and rewards properly', () => {
    const wrapper = mountWithRouterAndQueryClient(StakeStatus, {
      ...props,
      formProps: {
        rewards: { total: 20000000n },
      },
      statusInfo: { unlockable: 300 },
    });
    const element = wrapper.find('BoxContent');

    expect(element.text()).toContain(
      ' 0.000003 LSK will be available to unlock when the locking period ends.0.2 LSK will be credited to your account due to changes in stakes.'
    );
  });

  it('displays the combined message properly', () => {
    const wrapper = mountWithRouterAndQueryClient(StakeStatus, {
      ...props,
      statusInfo: { locked: 200, unlockable: 300 },
    });
    const element = wrapper.find('BoxContent');

    expect(element.text()).toContain(
      'You have now locked 0.000002 LSK for staking and may unlock 0.000003 LSK when the locking period ends.'
    );
  });

  it('displays error modal', () => {
    const renderConfig = {
      renderType: 'mount',
      historyInfo: {
        push: jest.fn(),
        location: { search: '' },
      },
      queryClient: true,
      store: true,
      storeInfo: {
        settings: {
          network: {
            serviceUrl: 'http://testnet.io',
          },
        },
      },
    };
    const { wrapper } = smartRender(
      StakeStatus,
      {
        ...props,
        transactions: {
          txSignatureError: { message: 'error' },
          signedTransaction: { signatures: [] },
        },
      },
      renderConfig
    );

    const element = wrapper.find('TxBroadcaster');

    expect(element.text()).toContain(
      'An error occurred while signing your transaction. Please try again.'
    );
  });
});
