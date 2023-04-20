/* eslint-disable */
import wallets from '@tests/constants/wallets';
import { useNetworkStatus } from '@network/hooks/queries';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import SettingDialog from './SettingDialog';
import { mockNetworkStatus } from 'src/modules/network/__fixtures__';
import { mockBlockchainAppMeta } from 'src/modules/blockchainApplication/manage/__fixtures__';

jest.mock('@network/hooks/queries/useNetworkStatus');
jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');

useNetworkStatus.mockReturnValue({
  data: {
    ...mockNetworkStatus,
    data: { ...mockNetworkStatus.data, chainID: mockBlockchainAppMeta.data[0].chainID },
  },
  isLoading: false,
  isError: false,
  isFetched: true,
  refetch: jest.fn(),
});
useBlockchainApplicationMeta.mockReturnValue({
  data: mockBlockchainAppMeta,
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
});

describe('Setting', () => {
  const settings = {
    currency: undefined,
    statistics: false,
    discreetMode: false,
  };

  const account = {
    info: {
      LSK: {
        ...wallets.genesis,
        isValidator: false,
        username: 'lisk-desktop',
      },
    },
  };

  const t = (key) => key;
  let wrapper;

  const props = {
    transactions: { pending: [] },
    account: { token: 'LSK', passphrase: 'sample_passphrase' },
    settingsUpdated: jest.fn(),
    settings,
    t,
    isAuthenticated: true,
    location: {
      pathname: '/settings',
    },
  };

  describe('With no transaction in guest mode', () => {
    beforeEach(() => {
      wrapper = mountWithRouterAndQueryClient(SettingDialog, props);
    });

    it('should display Currency, Security, Advanced and Privacy settings sections with toggles', () => {
      expect(wrapper.find('section.currency')).toExist();
      expect(wrapper.find('section.currency')).toContainMatchingElement('CurrencySelector');
      expect(wrapper.find('section.appearance')).toExist();
      expect(wrapper.find('section.appearance')).toContainMatchingElement('Toggle');
      expect(wrapper.find('section.security')).toExist();
      expect(wrapper.find('section.security')).toContainMatchingElement('Toggle');
      expect(wrapper.find('section.advanced')).toExist();
      expect(wrapper.find('section.advanced')).toContainMatchingElement('Toggle');
      expect(wrapper.find('section.privacy')).toExist();
      expect(wrapper.find('section.privacy')).toContainMatchingElement('Toggle');
    });
  });

  // @todo - Move tests to currencySelector and toggle components
  // describe('With no transaction in guest mode', () => {
  //   beforeEach(() => {
  //     wrapper = mountWithRouter(SettingDialog, props);
  //   });

  //   it('should change autolog setting when clicking on checkbox', () => {
  //     wrapper.find('.autoLog input').at(0).simulate('change', { target: { name: 'autoLog' } });
  //   });

  //   it('should change discreet mode setting when clicking on checkbox', () => {
  //     wrapper.find('.discreetMode input').at(0).simulate('change', { target: { name: 'discreetMode' } });
  //     const expectedCallToSettingsUpdated = {
  //       discreetMode: !settings.discreetMode,
  //     };
  //     expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  //   });

  //   it('should change showNetwork setting when clicking on checkbox', () => {
  //     wrapper.find('.showNetwork input').at(0).simulate('change', { target: { name: 'showNetwork' } });
  //     const expectedCallToSettingsUpdated = {
  //       showNetwork: !settings.showNetwork,
  //     };
  //     expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  //   });

  //   it('should change usage statistics when clicking on checkbox', () => {
  //     wrapper.find('.statistics input').at(0).simulate('change', { target: { name: 'statistics' } });
  //     const expectedCallToSettingsUpdated = {
  //       statistics: !settings.statistics,
  //     };
  //     expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  //   });

  //   it('should change active currency setting to EUR', () => {
  //     wrapper.find('.currency input').simulate('focus');
  //     wrapper.find('.currency .options span').at(1).simulate('click', { target: { getAttribute: () => 'EUR' } });
  //     const expectedCallToSettingsUpdated = {
  //       currency: 'EUR',
  //     };
  //     expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  //   });
  // });

  // describe('With specific properties', () => {
  //   it('should update expireTime when updating autolog', () => {
  //     const accountToExpireTime = { ...account };
  //     const settingsToExpireTime = { ...settings };
  //     settingsToExpireTime.autoLog = false;
  //     accountToExpireTime.passphrase = accounts.genesis.passphrase;
  //     wrapper = mountWithRouter(SettingDialog, { ...props, account: accountToExpireTime, settings: settingsToExpireTime });

  //     wrapper.find('.autoLog input').at(0).simulate('change', { target: { name: 'autoLog' } });

  //   });
  // });
});
