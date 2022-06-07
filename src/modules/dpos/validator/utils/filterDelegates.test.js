import { filterDelegates } from './filterDelegates';

const delegates = {
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

const filters = {
  search: 'lisk',
};

describe('filterDelegates', () => {
  it('properly filters delegates based on username', () => {
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
    expect(filterDelegates(delegates, filters)).toEqual(expectedResult);
  });
});
