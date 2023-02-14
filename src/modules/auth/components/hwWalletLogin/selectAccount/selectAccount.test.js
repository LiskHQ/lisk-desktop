import { toast } from 'react-toastify';
import * as hwManager from '@wallet/utils/hwManager';
import { mountWithRouter } from 'src/utils/testHelpers';
import SelectAccount from './selectAccount';

jest.mock('@wallet/utils/hwManager');

describe('Select Account', () => {
  let wrapper;
  let props;

  const mockValue = [
    {
      summary: {
        address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
        balance: 100000000,
      },
    },
    {
      summary: {
        address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        balance: 500000000,
      },
      pos: {
        validator: {
          username: 'ABCD',
        },
      },
    },
    {
      summary: {
        address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
        balance: 200000000,
      },
    },
    {
      summary: {
        address: 'lsksckkjs2c8dnu7vhcku825cp62ed6eyxd8pbt6p',
        balance: 0,
      },
    },
    {
      legacy: {
        balance: 200000000,
      },
      summary: {
        address: 'lsksckkjs2c8dnu7vhcku825cp62ed6eyxd8pbt6p',
        balance: 0,
      },
    },
  ];

  beforeEach(() => {
    hwManager.getAccountsFromDevice.mockResolvedValue(mockValue);

    props = {
      devices: [
        { deviceId: 1, openApp: false, model: 'Ledger' },
        { deviceId: 2, model: 'Trezor' },
        { deviceId: '123abc', openApp: true, model: 'Ledger Nano S' },
      ],
      device: {
        deviceId: '123abc',
        model: 'Ledger Nano S',
        deviceModel: 'Ledger Nano S',
      },
      account: {
        summary: {
          address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
          balance: 100,
          publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
        },
        name: 'Lisk',
      },
      network: {},
      settings: {
        hardwareAccounts: {
          'Ledger Nano S': [
            {
              summary: {
                address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
              },
              name: 'Main',
            },
          ],
        },
      },
      t: v => v,
      history: {
        push: jest.fn(),
      },
      goBack: jest.fn(),
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      login: jest.fn(),
      settingsUpdated: jest.fn(),
    };
    jest.spyOn(toast, 'error');

    wrapper = mountWithRouter(SelectAccount, props, { search: '?tab=active' });
  });

  it('Should render SelectAccount properly', async () => {
    const html = wrapper.html();
    expect(html).toContain('create-account');
    expect(html).toContain('hw-container');
  });

  it('Should change name "label" of one account', async () => {
    await hwManager.getAccountsFromDevice({});
    wrapper.update();
    expect(wrapper.find('.hw-container')).toContainMatchingElement('.hw-account');
    wrapper.simulate('mouseover');
    wrapper.find('.edit-account').at(0).simulate('click');
    wrapper.setState({ accountOnEditMode: 0 });
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.save-account');
    wrapper.find('input.account-name').at(0).simulate('change', { target: { value: 'Lisk Account' } });
    wrapper.find('.save-account').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('.account-name').at(0).text()).toEqual('Lisk Account');
  });

  it('Should add another account to the list after do click on create account button', () => {
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.create-account');
    expect(wrapper).toContainMatchingElements(5, '.hw-account');
    wrapper.find('.create-account').at(0).simulate('click');
    wrapper.update();
    expect(wrapper).toContainMatchingElements(5, '.hw-account');
  });

  it('Should disable create new account button', () => {
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.create-account');
    expect(wrapper.find('.create-account').at(0)).toBeDisabled();
  });

  it('Should hide empty balance accounts', () => {
    wrapper.update();
    expect(wrapper.find('.hw-container').at(0)).toContainMatchingElements(5, '.hw-account');
    wrapper.find('input[name="hideEmptyAccounts"]').at(0).simulate('change', { target: { name: 'hideEmptyAccounts' } });
    wrapper.update();
    expect(wrapper.find('.hw-container').at(0)).toContainMatchingElements(3, '.hw-account');
  });

  it('Should call login function after click on a select account button', () => {
    wrapper.update();
    expect(wrapper.find('.hw-container')).toContainMatchingElement('.hw-account');
    wrapper.find('.select-account').at(0).simulate('click');
    expect(props.login).toBeCalled();
  });
});
