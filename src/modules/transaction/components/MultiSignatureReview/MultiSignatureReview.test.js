import React from 'react';
import { mount } from 'enzyme';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import Review from './index';

jest.mock('@token/fungible/hooks/queries');

describe('Multisignature Review component', () => {
  let wrapper;
  const props = {
    t: (v) => v,
    members: [
      {
        address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
        isMandatory: true,
      },
      {
        address: 'lskehj0am9afxdz8arztqajy52acnoubkzvmo9cjy',
        isMandatory: false,
        publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
      },
      { address: 'lskehj1am9afxdz8arztqajy52acnoubkzvmo9cjy', isMandatory: false },
      { address: 'lskehj2am9afxdz8arztqajy52acnoubkzvmo9cjy', isMandatory: false },
      { address: 'lskehj3am9afxdz8arztqajy52acnoubkzvmo9cjy', isMandatory: false },
    ],
    fee: 2000000,
    numberOfSignatures: 2,
  };

  beforeEach(() => {
    wrapper = mount(<Review {...props} />);
  });

  useTokenBalances.mockReturnValue({ data: mockAppsTokens });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElements(props.members.length, '.member-info');
    expect(wrapper.find('.infoColumn.info-numberOfSignatures')).toHaveText('Required signatures2');
    expect(wrapper.find('.infoColumn.info-fee')).toHaveText('Fees0.02 LSK');
  });
});
