import { cryptography } from '@liskhq/lisk-client';

const verifyMessageValidator = (inputs) => {
  let isCorrect = false;
  try {
    isCorrect = cryptography.verifyMessageWithPublicKey({
      publicKey: Buffer.from(inputs.publicKey, 'hex'),
      signature: Buffer.from(inputs.signature, 'hex'),
      message: inputs.message,
    });
  } catch (e) {
    isCorrect = false;
  }
  return isCorrect;
};

export default verifyMessageValidator;
