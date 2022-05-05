import routes from '@screens/router/routes';
import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import MultisigAccountDetails from './index';

describe('Multisignature account details', () => {
  const props = { t: str => str };
  const ordinaryAccountKeys = {
    numberOfSignatures: 0,
    optionalKeys: [],
    mandatoryKeys: [],
  };
  const address = '5059876081639179984L';
  const publicKey = '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a';
  const multisigAccountKeys = {
    numberOfSignatures: 1,
    optionalKeys: [publicKey],
    mandatoryKeys: ['86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19'],
  };

  describe('Ordinary account', () => {
    const store = {
      account: {
        info: {
          LSK: {
            address,
            publicKey,
            keys: ordinaryAccountKeys,
          },
        },
      },
    };

    it('should return null if the account is not multisig', () => {
      const wrapper = mountWithRouterAndStore(
        MultisigAccountDetails,
        props,
        {},
        store,
      );

      expect(wrapper).toEqual({});
    });
  });

  describe('Multisignature account', () => {
    const store = {
      account: {
        info: {
          LSK: {
            address,
            publicKey,
            keys: multisigAccountKeys,
          },
        },
      },
    };

    it('Create Members for each publicKey', () => {
      const wrapper = mountWithRouterAndStore(
        MultisigAccountDetails,
        props,
        { pathname: routes.wallet.path },
        store,
      );

      expect(wrapper.find('Member')).toHaveLength(2);
    });
  });
});
