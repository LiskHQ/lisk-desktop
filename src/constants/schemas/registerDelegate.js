export default {
  $id: 'lisk/dpos/register',
  type: 'object',
  required: ['username'],
  properties: {
    username: {
      dataType: 'string',
      fieldNumber: 1,
      minLength: 1,
      maxLength: 20,
    },
  },
};
