import { filterValidators } from './filterValidators';

const validators = {
  data: [
    {
      address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
      username: 'testUsername_1',
    },
    {
      address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y32',
      username: 'liskUsername_3',
    },
    {
      address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y53',
      username: 'testUsername_5',
    },
    {
      address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y74',
      username: 'liskUsername_7',
    },
  ],
};

describe('filterValidators', () => {
  it('properly filters validators based on username', () => {
    const filters = {
      search: 'lisk',
    };
    const expectedResult = {
      data: [
        {
          address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y32',
          username: 'liskUsername_3',
        },
        {
          address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y74',
          username: 'liskUsername_7',
        },
      ],
    };
    expect(filterValidators(validators, filters)).toEqual(expectedResult);
  });
  it('properly filters validators based on username and address', () => {
    const expectedResult = {
      data: [
        {
          address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y74',
          username: 'liskUsername_7',
        },
      ],
    };
    const filters = {
      search: 'lisk',
      address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y74',
    };
    expect(filterValidators(validators, filters)).toEqual(expectedResult);
  });
  it('return all data if filter not provided', () => {
    const filters = {};
    expect(filterValidators(validators, filters)).toEqual(validators);
  });
});
