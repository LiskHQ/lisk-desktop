import React from 'react';
import { expect } from 'chai';

import { mountWithContext } from '../../../test/utils/mountHelpers';
import Search from './index';

describe('Search', () => {
  it('should render noResults compoennt" ', () => {
    const wrapper = mountWithContext(<Search />, {});
    expect(wrapper.find('EmptyState')).to.be.present();
    expect(wrapper.find('EmptyState')).to.have.prop('title', 'No results');
  });
});

