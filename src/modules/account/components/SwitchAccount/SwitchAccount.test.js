import { useDispatch } from 'react-redux';
import mockSavedAccounts from '@tests/fixtures/accounts';
import routes from '@screens/router/routes';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { mountWithProps } from 'src/utils/testHelpers';
import history from 'src/utils/history';
import SwitchAccount from './SwitchAccount';

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
    expect(wrapper.find('.switch-account-list-item')).toHaveLength(mockSavedAccounts.length);
    expect(wrapper.find('.switch-account-list-item-address').first()).toHaveText(mockSavedAccounts[0].metadata.address);
    expect(wrapper.find('a')).toHaveText('Add another account');
    expect(wrapper.find('a').props().href).toEqual(routes.addAccountOptions.path);
  });

  it('Should work properly when clicking onAccountClick', () => {
    wrapper.find('.switch-account-list-item-address').first().simulate('click');
    expect(removeSearchParamsFromUrl).toHaveBeenCalledWith(history, ['modal']);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
