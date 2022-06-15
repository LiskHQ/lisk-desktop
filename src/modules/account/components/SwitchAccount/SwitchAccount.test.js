import { useDispatch } from 'react-redux';
import mockSavedAccounts from '@tests/fixtures/accounts';
import routes from '@screens/router/routes';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { mountWithProps } from 'src/utils/testHelpers';
import history from 'src/utils/history';
import { OutlineButton } from 'src/theme/buttons';
import AccountRow from '../AccountRow';
import SwitchAccount from './SwitchAccount';

jest.mock('src/utils/history');

jest.mock('@account/hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));
jest.mock('src/utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

const mockDispatch = jest.fn();
useDispatch.mockReturnValue(mockDispatch);

describe('Switch account', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mountWithProps(SwitchAccount, {});
  });

  it('Should render properly', () => {
    expect(wrapper.find(AccountRow)).toHaveLength(mockSavedAccounts.length);
    expect(wrapper.find(AccountRow).first()).toHaveText(`${mockSavedAccounts[0].metadata.name}${mockSavedAccounts[0].metadata.address}`);
    expect(wrapper.find(OutlineButton)).toHaveText('Add another account');
  });

  it('Should work properly when clicking on clicking add account', () => {
    wrapper.find(OutlineButton).first().simulate('click');
    expect(history.push).toHaveBeenCalledWith(routes.addAccountOptions.path);
  });

  it('Should work properly when clicking on clicking select account', () => {
    wrapper.find(AccountRow).first().simulate('click');
    expect(removeSearchParamsFromUrl).toHaveBeenCalledWith(history, ['modal']);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
