import React from 'react';
import { expect } from 'chai';

import { mountWithContext } from '../../../test/utils/mountHelpers';
import SearchResult from './index';

describe('SearchResult', () => {
  it('should render noResults compoennt" ', () => {
    const wrapper = mountWithContext(<SearchResult />, {});
    expect(wrapper.find('EmptyState')).to.be.present();
    expect(wrapper.find('EmptyState')).to.have.prop('title', 'No results');
  });
});

