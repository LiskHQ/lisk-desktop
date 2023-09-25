import React from 'react';
import routes from 'src/routes/routes';
import { mountWithQueryClient } from 'src/utils/testHelpers';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import accounts from '@tests/constants/wallets';
import Regular from '.';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';

describe('TransactionResult Regular', () => {
  const props = {
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {
        senderPublicKey: accounts.genesis.summary.publicKey,
        signatures: [accounts.genesis.summary.publicKey],
      },
    },
    network: {
      networkIdentifier: 'networkIdentifier1',
      serviceUrl: 'http://testnet.io',
      networkVersion: '5.0.1',
    },
    application: {
      chainName: 'lisk',
      chainID: '04000000',
      networkType: 'devnet',
      serviceURLs: [{ http: 'http://devnet-service.liskdev.net:9901' }],
    },
    account: accounts.genesis,
    title: 'Test title',
    message: 'lorem ipsum',
    t: (t) => t,
    status: {
      code: txStatusTypes.signatureSuccess,
    },
    history: { push: jest.fn() },
    children: <div className="child-component">children element</div>,
    illustration: 'default',
    className: 'test-class',
    transactionBroadcasted: jest.fn(),
    resetTransactionResult: jest.fn(),
    moduleCommandSchemas: { [MODULE_COMMANDS_NAME_MAP.transfer]: 'test schema' },
  };

  it('should render properly and call props.transactionBroadcasted', () => {
    const wrapper = mountWithQueryClient(Regular, props);
    expect(wrapper.find('.test-class')).toExist();
    expect(wrapper.find('.result-box-header')).toHaveText(props.title);
    expect(wrapper.find('.body-message')).toHaveText(props.message);
    expect(wrapper.find('.child-component')).toExist();
    expect(props.transactionBroadcasted).toHaveBeenCalledWith(
      props.transactions.signedTransaction,
      props.moduleCommandSchemas
    );
  });

  it('should render properly when error', () => {
    const wrapper = mountWithQueryClient(Regular, {
      ...props,
      status: {
        code: txStatusTypes.signatureError,
        message: 'test error',
      },
    });
    expect(wrapper.find('.test-class')).toExist();
    expect(wrapper.find('.result-box-header')).toHaveText(props.title);
    expect(wrapper.find('.body-message')).toHaveText(props.message);
    expect(wrapper.find('.report-error-link')).toHaveText('Report the error via email');
    expect(wrapper.find('.report-error-link')).toHaveProp(
      'href',
      'mailto:desktopdev@lisk.com?&subject=User Reported Error - Lisk - &body=%0A%20%20%20%20%0AImportant%20metadata%20for%20the%20team%2C%20please%20do%20not%20edit%3A%0A%20%20%20%20%0D%0A%20%20%20%20Chain%20Name%3A%20lisk%2C%20Chain%20ID%3A%2004000000%2C%20Network%3A%20devnet%2C%20ServiceURL%3A%20http%3A%2F%2Fdevnet-service.liskdev.net%3A9901%0A%20%20%20%20%0D%0A%20%20%20%20Transaction%20Error%3A%20undefined%0A%20%20%20%20%0D%0A%20%20%20%20Transaction%3A%20undefined%0A%20%20%20%20%0D%0A%20%20%20%20API%20Error%20Message%3A%20lorem%20ipsum%0A%20%20'
    );
  });

  it('should navigate to wallet', () => {
    const wrapper = mountWithQueryClient(Regular, {
      ...props,
      status: {
        code: txStatusTypes.broadcastSuccess,
      },
    });
    wrapper.find('.back-to-wallet-button').at(0).simulate('click');
    expect(props.history.push).toHaveBeenCalledWith(routes.wallet.path);
  });
});
