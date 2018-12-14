import { expect } from 'chai';
import Lisk from 'lisk-elements';
import transactionTypes from '../constants/transactionTypes';
import { createDelegateTX, createSendTX, createSecondPassphraseTX,
  createRawVoteTX, concatVoteLists,
  calculateTxId, getBufferToHex } from './rawTransactionWrapper';

describe('Raw Transaction Wrapper', () => {
  it('should return create send transaction with createSendTX with data', () => {
    const amount = 10;
    const senderPublicKey = '123pl';
    const recipientId = '123L';
    const data = [{ test: 'test' }];

    const createdTransaction = createSendTX(senderPublicKey, recipientId, amount, data);
    const expectedTransaction = {
      type: transactionTypes.send,
      amount: amount.toString(),
      fee: Lisk.transaction.constants.TRANSFER_FEE.toString(),
      senderPublicKey,
      recipientId,
      timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - 100,
      asset: { data },
    };
    expect(createdTransaction.asset).to.deep.equal(expectedTransaction.asset);
  });

  it('should return create send transaction with createSendTX without data', () => {
    const amount = 10;
    const senderPublicKey = '123pl';
    const recipientId = '123L';

    const createdTransaction = createSendTX(senderPublicKey, recipientId, amount);
    const expectedTransaction = {
      type: transactionTypes.send,
      amount: amount.toString(),
      fee: Lisk.transaction.constants.TRANSFER_FEE.toString(),
      senderPublicKey,
      recipientId,
      timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - 100,
      asset: {},
    };
    expect(createdTransaction.asset).to.deep.equal(expectedTransaction.asset);
  });

  it('should return create send transaction with createDelegateTX', () => {
    const senderPublicKey = '123pl';
    const username = 'test';
    const createdTransaction = createDelegateTX(senderPublicKey, username);
    const expectedTransaction = {
      type: transactionTypes.registerDelegate,
      amount: '0',
      fee: Lisk.transaction.constants.DELEGATE_FEE.toString(),
      senderPublicKey,
      recipientId: '',
      timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - 100,
      asset: {
        delegate: {
          username,
        },
      },
    };
    expect(createdTransaction).to.deep.equal(expectedTransaction);
  });

  it('should return create send transaction with createSecondPassphraseTX', () => {
    const senderPublicKey = '123pl';
    const secondPublicKey = 'test';
    const createdTransaction = createSecondPassphraseTX(senderPublicKey, secondPublicKey);
    const expectedTransaction = {
      type: transactionTypes.setSecondPassphrase,
      amount: '0',
      fee: Lisk.transaction.constants.SIGNATURE_FEE.toString(),
      senderPublicKey,
      recipientId: '',
      timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - 100,
      asset: {
        signature: {
          publicKey: secondPublicKey,
        },
      },
    };
    expect(createdTransaction).to.deep.equal(expectedTransaction);
  });

  it('should return create send transaction with createRawVoteTX', () => {
    const senderPublicKey = '123pl';
    const recipientId = 'test';
    const votedList = ['test'];
    const unvotedList = [];

    // eslint-disable-next-line
    const createdTransaction = createRawVoteTX(senderPublicKey, recipientId, votedList, unvotedList);
    const expectedTransaction = {
      type: transactionTypes.vote,
      amount: '0',
      fee: Lisk.transaction.constants.VOTE_FEE.toString(),
      senderPublicKey,
      recipientId,
      timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - 100,
      asset: { votes: concatVoteLists(votedList, unvotedList) },
    };
    expect(createdTransaction).to.deep.equal(expectedTransaction);
  });

  it('should return 7601088739759476607 for calling calculateTxId', () => {
    const transaction = {
      amount: '100',
      recipientId: '123L',
      senderPublicKey: '0b68c5d745d47998768a14b92b221ded2292e21b62846f8f968fdbcd9b52ae4d',
      timestamp: 65568696,
      type: 0,
      fee: '10000000',
      recipientPublicKey: null,
      asset: {},
      signature: 'ae6a6f11527213a5eb9b7b673579f06ec94722fd07c9cbd5269e0ce34b659453712c0ff259454dbad9eb4d3f713cb6deb446a18cea067dafa8828bed219f8104',
    };
    expect(calculateTxId(transaction)).to.equal('7601088739759476607');
  });

  it('should return 7601088739759476607 for calling getBufferToHex', () => {
    const buffer = Buffer.from([0xab, 0xcd, 0x12, 0x34]);
    expect(getBufferToHex(buffer)).to.equal('abcd1234');
  });
});
