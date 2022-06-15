import React from 'react';
import { mount } from 'enzyme';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { OutlineButton } from 'src/theme/buttons';
import AccountRow from '../AccountRow';
import SwitchAccount from './SwitchAccount';

jest.mock('@account/hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));

describe('Switch account', () => {
  it('Should render properly', () => {
    const wrapper = mount(<SwitchAccount />);

    expect(wrapper.find(AccountRow)).toHaveLength(mockSavedAccounts.length);
    expect(wrapper.find(AccountRow).first()).toHaveText(`${mockSavedAccounts[0].metadata.name}${mockSavedAccounts[0].metadata.address}`);
    expect(wrapper.find(OutlineButton).first()).toHaveText('Add another account');
  });
});
