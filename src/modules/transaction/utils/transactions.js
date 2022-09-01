import {
  signTransaction,
  signMultiSignatureTransaction,
  computeMinFee,
} from '@liskhq/lisk-transactions';
import { validator } from '@liskhq/lisk-validator';
import { codec } from '@liskhq/lisk-codec';
import {
  getCommandParamsSchema,
  decodeTransaction,
  encodeTransaction,
  toTransactionJSON,
  fromTransactionJSON,
} from './encoding';

/**
 * Create transaction for network specific schema, metadata and nodeInfo
 *
 * @param {Object} commandSchemas Network specific transaction command schemas
 * @param {Object} networkMetadata Network specific metadata (includes nodeInfo and moduleMedata)
 *
 * @returns {create, sign, decode, encode, computeMinFee, toJSON, fromJSON}
 */
// eslint-disable-next-line import/prefer-default-export
export class Transaction {
  _networkStatus = null;

  _auth = null;

  _schema = {};

  _module = null

  _command = null

  _pubkey = null

  _transaction = null

  isLoading = true

  init({
    networkStatus,
    auth,
    commandParametersSchemas,
    module,
    command,
    pubkey,
  }) {
    this.loading = false;
    this._networkStatus = networkStatus;
    this._module = module;
    this._command = command;
    this.pubkey = pubkey;
    this._auth = auth;
    this._schema = getCommandParamsSchema(
      { module, command },
      commandParametersSchemas,
    );
  }

  /**
   * Create transaction object
   * @param {string} module - Module name e.g token
   * @param {string} command - Command name e.g transfer
   * @param {object} options - Transaction options e.g {nonce, pubkey}
   * @returns Transaction object
   */
  async create(
    params,
  ) {
    this._transaction = {
      module: this._module,
      command: this._command,
      nonce: BigInt(this._auth.nonce),
      senderPublicKey: Buffer.from(this._pubkey, 'hex'),
      params: codec.fromJSON(this._schema ?? {}, params),
      fee: BigInt(0),
      signatures: [],
    };
    this.computeFee();
  }

  /**
   * Sign transaction for a given privateKey and its options
   * @param {object} transaction
   * @param {string} privateKey
   * @param {object} options {includeSenderSignature, authAccount}
   * @returns
   */
  // eslint-disable-next-line max-statements
  async sign(privateKey, { includeSenderSignature = false }) {
    const chainID = Buffer.from(this._networkStatus.chainID, 'hex');
    const decodedTx = this.fromJSON(this._transaction);
    const { optionalKeys, mandatoryKeys } = this._transaction.params;
    const isMultiSignature = this._auth.numberOfSignatures > 0;
    const isMultiSignatureRegistration = (optionalKeys?.length || mandatoryKeys?.length)
      && includeSenderSignature;
    this._validateTransaction(decodedTx);

    if (isMultiSignature || isMultiSignatureRegistration) {
      const signedTx = signMultiSignatureTransaction(
        this._transaction,
        chainID,
        privateKey,
        {
          mandatoryKeys: this._auth.mandatoryKeys.map(k => Buffer.from(k, 'hex')),
          optionalKeys: this._auth.optionalKeys.map(k => Buffer.from(k, 'hex')),
        },
        this._schema,
        includeSenderSignature,
      );

      return this.toJSON(signedTx);
    }

    const signedTx = signTransaction(
      decodedTx,
      this._networkStatus.networkIdentifier,
      Buffer.from(privateKey, 'hex'),
      this._schema,
    );
    return this.toJSON(signedTx);
  }

  computeFee() {
    this._validateTransaction(this._transaction);

    // MultiSig registration

    const { optionalKeys, mandatoryKeys } = this._transaction.params;
    const isMultiSignatureRegistration = (optionalKeys?.length || mandatoryKeys?.length);
    const numberOfSignatures = this._auth.numberOfSignatures > 0
      ? this._auth.numberOfSignatures
      : 1;
    // Transaction from multisignature
    const computeMinFeeOptions = {
      minFeePerByte: this._networkStatus.genesisConfig.minFeePerByte,
      numberOfSignatures,
    };
    if (isMultiSignatureRegistration) {
      computeMinFeeOptions.numberOfEmptySignatures = optionalKeys?.length
        + mandatoryKeys?.length
        - this._auth.numberOfSignatures;
    }
    if (!isMultiSignatureRegistration) {
      computeMinFeeOptions.numberOfSignatures = optionalKeys?.length + mandatoryKeys?.length + 1;
    }
    this._transaction.fee = computeMinFee(this._transaction, this._schema, computeMinFeeOptions);
  }

  decode() {
    const transactionBuffer = Buffer.isBuffer(this._transaction)
      ? this._transaction
      : Buffer.from(this._transaction, 'hex');
    return decodeTransaction(transactionBuffer, this._schema, this._networkStatus);
  }

  encode() {
    this._validateTransaction(this._transaction);
    return encodeTransaction(this._transaction, this._schema, this._networkStatus);
  }

  toJSON() {
    this._validateTransaction(this._transaction);
    return toTransactionJSON(
      this._transaction,
      this._schema,
      this._networkStatus,
    );
  }

  fromJSON() {
    return fromTransactionJSON(this._transaction, this._schema, this._networkStatus);
  }

  _validateTransaction() {
    if (typeof this._transaction !== 'object' || this._transaction === null) {
      throw new Error('Transaction must be an object.');
    }
    const { params, ...rest } = this._transaction;
    validator.validate(this._schema.transaction, {
      ...rest,
      params: Buffer.alloc(0),
    });

    if (Buffer.isBuffer(params)) {
      throw new Error('Transaction parameter is not decoded.');
    }
  }
}
