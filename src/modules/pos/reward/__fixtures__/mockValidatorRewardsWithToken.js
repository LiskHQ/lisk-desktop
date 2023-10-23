import { mockAppsTokens } from '@token/fungible/__fixtures__';

export const mockValidatorRewards = {
  data: {
    lsko5yghbggbxxfbowg53qwknef9wax9yymqns3my: {
      stakerAddress: 'lskguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad',
      validatorAddress: 'lsko5yghbggbxxfbowg53qwknef9wax9yymqns3my',
      tokenID: '0000000100000000',
      amount: '975328109',
    },
    lskruwgk9vrrduhw65o3zz9ddqbadtbv7o85pzapb: {
      stakerAddress: 'lskguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad',
      validatorAddress: 'lskruwgk9vrrduhw65o3zz9ddqbadtbv7o85pzapb',
      tokenID: '0000000200000000',
      amount: '763135532',
    },
  },
};

export const mockValidatorRewardsWithToken = Object.values(mockValidatorRewards.data).map(
  (validatorWithRewards) => {
    const token = mockAppsTokens.data.find(
      (metaToken) => metaToken.tokenID === validatorWithRewards.tokenID
    );

    return {
      ...validatorWithRewards,
      ...token,
    };
  }
);
