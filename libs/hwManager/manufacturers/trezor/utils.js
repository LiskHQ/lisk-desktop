/* eslint-disable no-bitwise */

export const getHardenedPath = (index) => {
  const hardeningConstant = 0x80000000;
  return [
    (44 | hardeningConstant) >>> 0,
    (134 | hardeningConstant) >>> 0,
    (index | hardeningConstant) >>> 0,
  ];
};

/**
 * toTrezorGrammar - function - Normalize transaction object that will be send to device
 * to show it in screen
 * @param {*} transaction - Object with transaction information
 */
export const toTrezorGrammar = ({
  amount,
  fee,
  senderPublicKey,
  requesterPublicKey,
  recipientId,
  ...rest
}) => {
  const transaction = {
    amount: parseInt(amount, 10),
    fee: parseInt(fee, 10),
    recipient_id: recipientId,
    sender_public_key: senderPublicKey,
    requester_public_key: requesterPublicKey,
    ...rest,
  };

  Object.keys(transaction).forEach((key) => {
    if (transaction[key] !== 0 && !transaction[key]) delete transaction[key];
  });

  return transaction;
};
