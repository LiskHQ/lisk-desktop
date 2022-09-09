import React from 'react';
import { mount } from 'enzyme';
import GuideTooltip, { GuideTooltipItem } from './guideTooltip';

describe('GuideTooltip', () => {
  it('should render GuideTooltip correctly', () => {
    const wrapper = mount(
      <GuideTooltip>
        <GuideTooltipItem color="red">test1</GuideTooltipItem>
        <GuideTooltipItem color="blue">test2</GuideTooltipItem>
      </GuideTooltip>
    );
    expect(wrapper).toContainExactlyOneMatchingElement('.guideTooltipContentList');
    expect(wrapper).toContainMatchingElement('.guideTooltipContentListItem');
    expect(wrapper).toContainMatchingElement('.quarterTile');
    expect(wrapper).toContainMatchingElement('.quarterTile .green');
  });
});
