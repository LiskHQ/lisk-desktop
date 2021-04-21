import { mountWithRouterAndStore } from '@utils/testHelpers';
import { getTransactionBaseFees, getTransactionFee, create } from '@api/transaction';
import { tokenMap } from '@constants';
import useTransactionFeeCalculation from '@shared/transactionPriority/useTransactionFeeCalculation';
import { fromRawLsk } from '@utils/lsk';
import accounts from '../../../../../../test/constants/accounts';
import Summary from './index';
import flushPromises from '../../../../../../test/unit-test-utils/flushPromises';

jest.mock('@shared/transactionPriority/useTransactionFeeCalculation');
jest.mock('@api/transaction');

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const mockFeeFactor = 100;
getTransactionBaseFees.mockResolvedValue(transactionBaseFees);
getTransactionFee.mockImplementation((params) => {
  const selectedTransactionPriority = params.selectedPriority.selectedIndex;
  const fees = fromRawLsk(
    Object.values(transactionBaseFees)[selectedTransactionPriority] * mockFeeFactor,
  );
  return ({
    value: fees, feedback: '', error: false,
  });
});

useTransactionFeeCalculation.mockImplementation(() => ({
  minFee: { value: 0.001 },
}));

describe('Reclaim balance Summary', () => {
  const state = {
    account: {
      passphrase: 'test',
      info: {
        LSK: accounts.empty_account,
      },
    },
    settings: { token: tokenMap.LSK.key },
    network: {
      networks: {
        LSK: { networkIdentifier: 'sample_identifier' },
      },
    },
  };

  const props = {
    nextStep: jest.fn(),
    t: key => key,
  };

  const response = {
    amount: 1e10,
    nonce: '123',
  };

  it('renders properly Symmary component', () => {
    const wrapper = mountWithRouterAndStore(Summary, props, {}, state);
    const html = wrapper.html();
    expect(html).toContain(accounts.empty_account.legacy.address);
    expect(html).toContain(accounts.empty_account.summary.address);
    expect(html).toContain('98,970,000 LSK');
    expect(html).toContain('0.001 LSK');
    expect(html).toContain('confirm-button');
  });


  it('Go to next page when continue button is clicked', async () => {
    create.mockImplementation(() => Promise.resolve(response));
    const wrapper = mountWithRouterAndStore(Summary, props, {}, state);
    wrapper.find('button.confirm-button').simulate('click');
    await flushPromises();
    expect(create).toHaveBeenCalled();
    expect(props.nextStep).toBeCalledWith({ transactionInfo: response });
  });
});
