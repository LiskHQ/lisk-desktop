export const requestTokenSchema = {
  $id: '/lisk/request-token',
  title: 'Request token params',
  type: 'object',
  required: ['modal', 'recipient', 'amount', 'token', 'recipientChain'],
  properties: {
    token: {
      dataType: 'string',
      minLength: 16,
      maxLength: 16,
    },
    modal: {
      dataType: 'string',
      pattern: 'send',
    },
    amount: {
      dataType: 'string',
      format: 'double',
    },
    recipient: {
      dataType: 'string',
      minLength: 41,
      maxLength: 41,
    },
    recipientChain: {
      dataType: 'string',
      minLength: 8,
      maxLength: 8,
    },
    reference: {
      dataType: 'string',
      minLength: 0,
      maxLength: 20,
    },
  },
};
