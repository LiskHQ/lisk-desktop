import { smartRender } from 'src/utils/testHelpers';
import { toast } from 'react-toastify';
import { tokenMap, tokenKeys } from '@token/fungible/consts/tokens';
import accounts from '@tests/constants/wallets';
import AddBookmark from './AddBookmark';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Add a new bookmark component', () => {
  const bookmarks = {
    LSK: [],
  };
  const props = {
    token: {
      active: tokenMap.LSK.key,
    },
    bookmarks,
    network: {
      name: 'testnet',
      networks: {
        LSK: {
          serviceUrl: 'https://service.lisk.com',
        },
      },
    },
    bookmarkAdded: jest.fn(),
    bookmarkRemoved: jest.fn(),
    prevStep: jest.fn(),
  };
  const history = {
    push: jest.fn(),
    location: {
      search: `?address=${accounts.genesis.summary.address}L&modal=addBookmark&formAddress=${accounts.genesis.summary.address}&label=&isValidator=false`,
    },
  };
  const bookmarkDetails = {
    LSK: { address: accounts.genesis.summary.address, title: 'genesis' },
  };

  let wrapper;
  const config = {
    renderType: 'mount',
    historyInfo: history,
    queryClient: true,
  };

  beforeEach(() => {
    wrapper = smartRender(AddBookmark, props, config).wrapper;
  });

  afterEach(() => {
    history.push.mockClear();
    props.bookmarkAdded.mockClear();
    props.bookmarkRemoved.mockClear();
  });

  it('Should render properly and with pristine state', () => {
    expect(wrapper).not.toContainMatchingElement('.error');
    expect(wrapper).toContainMatchingElement('input[name="address"]');
    expect(wrapper).toContainMatchingElement('input[name="label"]');
    expect(wrapper.find('button.save-button')).toBeDisabled();
  });

  describe('Success scenarios', () => {
    tokenKeys.forEach((token) => {
      it(`Should add ${token} account`, () => {
        wrapper.setProps({ token: { active: token } });
        wrapper
          .find('input[name="address"]')
          .first()
          .simulate('change', {
            target: {
              value: bookmarkDetails[token].address,
              name: 'address',
            },
          });
        wrapper
          .find('input[name="label"]')
          .at(0)
          .simulate('change', {
            target: {
              value: `label-${token}`,
              name: 'label',
            },
          });
        expect(wrapper).not.toContainMatchingElement('.error');
        expect(wrapper.find('button').at(0)).not.toBeDisabled();
        wrapper.find('button.save-button').simulate('click');
        expect(props.bookmarkAdded).toBeCalled();
      });
    });

    it('should not be possible to change validator label', () => {
      const accountAddress = accounts.validator.summary.address;
      const accountUsername = accounts.validator.pos.validator.username;
      wrapper
        .find('input[name="address"]')
        .first()
        .simulate('change', {
          target: {
            value: accountAddress,
            name: 'address',
          },
        });
      const updatedProps = {
        ...props,
        account: { ...props.account, data: accounts.validator },
      };
      const updatedConfig = {
        ...config,
        historyInfo: {
          push: jest.fn(),
          location: {
            search: `?address=${accountAddress}L&modal=addBookmark&formAddress=${accountAddress}&label=${accountUsername}&isValidator=true`,
          },
        },
      };
      wrapper = smartRender(AddBookmark, updatedProps, updatedConfig).wrapper;
      expect(wrapper.find('input[name="label"]')).toHaveValue(accountUsername);
      expect(wrapper.find('input[name="label"]')).toHaveProp('readOnly', true);
      expect(wrapper.find('button').at(0)).not.toBeDisabled();
      wrapper.find('button').at(0).simulate('click');
    });
  });

  describe('Fail scenarios', () => {
    beforeEach(() => {
      const updatedProps = {
        ...props,
        bookmarks: {
          LSK: [bookmarkDetails.LSK],
        },
      };
      wrapper = smartRender(AddBookmark, updatedProps, config).wrapper;
    });

    tokenKeys.forEach((token) => {
      it(`should not be possible to add already bookmarked address - ${token}`, () => {
        wrapper
          .find('input[name="address"]')
          .first()
          .simulate('change', {
            target: {
              value: bookmarkDetails[token].address,
              name: 'address',
            },
          });
        expect(wrapper.find('input[name="address"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });

      it(`should not be possible to add already bookmarked name - ${token}`, () => {
        const bookmarkTitle = bookmarkDetails[token].title;
        wrapper
          .find('input[name="label"]')
          .first()
          .simulate('change', {
            target: {
              value: bookmarkTitle,
              name: 'label',
            },
          });
        wrapper
          .find('input[name="address"]')
          .first()
          .simulate('change', {
            target: {
              value: accounts.validator.summary.address,
              name: 'address',
            },
          });
        wrapper.find('button.save-button').simulate('click');
        expect(toast.error).toHaveBeenCalledTimes(1);
        expect(toast.error).toHaveBeenCalledWith(
          `Bookmark with name "${bookmarkTitle}" already exists`
        );
      });

      it(`should show error on invalid address - ${token}`, () => {
        wrapper
          .find('input[name="address"]')
          .first()
          .simulate('change', {
            target: {
              value: 'invalidAddress',
              name: 'address',
            },
          });
        expect(wrapper.find('input[name="address"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });

      it(`should show error on label too long - ${token}`, () => {
        wrapper
          .find('input[name="label"]')
          .first()
          .simulate('change', {
            target: {
              value: 'Really long bookmark name',
              name: 'label',
            },
          });
        expect(wrapper.find('input[name="label"]')).toHaveClassName('error');
        expect(wrapper).toContainMatchingElement('.error');
      });
    });
  });
});
