import validators from '@tests/constants/validators';

export const getMockValidators = (address) => ({
  meta: {
    count: 2,
    offset: 0,
    total: 30,
  },
  data: address ? validators.filter((validator) => validator.address === address) : validators,
});

export const mockValidators = {
  meta: {
    count: 2,
    offset: 0,
    total: 30,
  },
  data: validators,
};
