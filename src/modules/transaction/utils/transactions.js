import {
  signTransaction,
  signMultiSignatureTransaction,
  computeMinFee,
} from '@liskhq/lisk-transactions';
import { validator } from '@liskhq/lisk-validator';
import { codec } from '@liskhq/lisk-codec';
import {
  baseTransactionSchema,
  getCommandParamsSchema,
  decodeTransaction,
  decodeBaseTransaction,
  encodeTransaction,
  toTransactionJSON,
  fromTransactionJSON,
} from './encoding';

export class Transaction {
  _paramsSchema = null;

  _networkStatus = null;

  _auth = null;

  transaction = {
    module: null,
    command: null,
    nonce: BigInt(0),
    fee: BigInt(0),
    senderPublicKey: null,
    params: {},
    signatures: [],
  }

  isLoading = true

  /**
   * Initialise transaction with required network and account information
   * @param {object} param transaction initialisation parameters
   */
  // eslint-disable-next-line max-statements
  init({
    pubkey,
    networkStatus,
    auth,
    commandParametersSchemas,
    module = null,
    command = null,
    encodedTransaction = null,
  }) {
    this.isLoading = false;
    this._networkStatus = networkStatus;
    this._auth = auth;
    this.transaction.senderPublicKey = Buffer.isBuffer(pubkey) ? pubkey : Buffer.from(pubkey, 'hex');
    this.transaction.module = module;
    this.transaction.command = command;
    this.transaction.params = {};
    this.transaction.signatures = [];
    let baseTrx = null;

    if (encodedTransaction) {
      baseTrx = decodeBaseTransaction(Buffer.from(encodedTransaction, 'hex'));
      this.transaction.module = baseTrx.module;
      this.transaction.command = baseTrx.command;
    } else if (!(this.transaction.module && this.transaction.command)) {
      throw new Error('Failed to initialise transaction');
    }

    this._paramsSchema = getCommandParamsSchema(
      this.transaction.module, this.transaction.command, commandParametersSchemas,
    );

    if (encodedTransaction) {
      this.transaction.params = codec.decode(this._paramsSchema, baseTrx.params);
    }
    this.computeFee();
  }

  /**
   * Update transaction object
   * @param {object} params transaction parameters
   * @returns void
   */
  update({
    params = null,
    nonce = null,
  }) {
    if (params) {
      this.transaction.params = codec.fromJSON(this._paramsSchema, params);
    }
    if (nonce) {
      this.transaction.nonce = BigInt(nonce);
    }
    this.computeFee();
  }

  /**
   * Sign transaction for a given privateKey and its options
   * @param {string} privateKey key to sign the transaction
   * @param {object} options transaction signing options {includeSenderSignature}
   * @returns void
   */
  // eslint-disable-next-line max-statements
  async sign(privateKey, options = { includeSenderSignature: false }) {
    // TODO: Update networkIdentifier to chainID once service endpoint is updated
    const chainID = Buffer.from(this._networkStatus.networkIdentifier, 'hex');
    const decodedTx = this.fromJSON(this.transaction);
    const { optionalKeys, mandatoryKeys } = this.transaction.params;
    const isMultiSignature = this._auth.numberOfSignatures > 0;
    const isMultiSignatureRegistration = (optionalKeys?.length || mandatoryKeys?.length)
      && options.includeSenderSignature;
    this._validateTransaction();

    if (isMultiSignature || isMultiSignatureRegistration) {
      const signedTx = signMultiSignatureTransaction(
        this.transaction,
        chainID,
        privateKey,
        {
          mandatoryKeys: this._auth.mandatoryKeys.map(k => Buffer.from(k, 'hex')),
          optionalKeys: this._auth.optionalKeys.map(k => Buffer.from(k, 'hex')),
        },
        this._paramsSchema,
        options.includeSenderSignature,
      );

      this.transaction = signedTx;
      return;
    }

    const signedTx = signTransaction(
      decodedTx,
      Buffer.from(this._networkStatus.networkIdentifier, 'hex'),
      Buffer.from(privateKey, 'hex'),
      this._paramsSchema,
    );
    this.transaction = signedTx;
  }

  /**
   * Compute transaction fee
   */
  computeFee() {
    this._validateTransaction();
    const computeMinFeeOptions = {
      minFeePerByte: this._networkStatus.genesis.minFeePerByte,
      numberOfSignatures: this._auth.numberOfSignatures || 1,
      numberOfEmptySignatures: 0,
    };

    if (this.transaction.module === 'auth' && this.transaction.command === 'registerMultisignature') {
      const { optionalKeys, mandatoryKeys } = this.transaction.params;

      computeMinFeeOptions.numberOfEmptySignatures = optionalKeys?.length
        + mandatoryKeys?.length
        - this._auth.numberOfSignatures;
    } else {
      const { optionalKeys, mandatoryKeys } = this._auth;
      computeMinFeeOptions.numberOfSignatures = optionalKeys?.length + mandatoryKeys?.length + 1;
    }

    this.transaction.fee = computeMinFee(
      this.transaction, this._paramsSchema, computeMinFeeOptions,
    );
  }

  /**
   * Decode encoded transaction
   * @param {buffer} encodedTransaction encoded transaction buffer
   * @returns transaction object
   */
  decode(encodedTransaction) {
    const transactionBuffer = Buffer.isBuffer(encodedTransaction)
      ? this.transaction
      : this.encode();
    return decodeTransaction(transactionBuffer, this._paramsSchema);
  }

  /**
   * Encode transaction object
   * @returns encoded transaction hex string
   */
  encode() {
    this._validateTransaction(this.transaction);
    return encodeTransaction(this.transaction, this._paramsSchema);
  }

  /**
   * Convert transaction object to JSON
   * @returns transaction in JSON format
   */
  toJSON() {
    this._validateTransaction(this.transaction);
    return toTransactionJSON(
      this.transaction,
      this._paramsSchema,
    );
  }

  /**
   * Convert transaction JSON to object
   * @returns transaction in Object format
   */
  fromJSON() {
    return fromTransactionJSON(this.transaction, this._paramsSchema);
  }

  /**
   * Validate transaction to be compatible with lisk protocol
   */
  _validateTransaction() {
    if (typeof this.transaction !== 'object' || this.transaction === null) {
      throw new Error('Transaction must be an object.');
    }
    const { params, ...rest } = this.transaction;
    validator.validate(baseTransactionSchema, {
      ...rest,
      params: Buffer.alloc(0),
    });

    if (Buffer.isBuffer(params)) {
      throw new Error('Transaction parameter is not decoded.');
    }
  }
}
