import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MultiStepNav from './multiStepNav';

describe('MultiStep Navigation', () => {
  const steps = [
    { props: { title: 'Title 1' } },
    { props: { title: 'Title 2' } },
    { props: { title: 'Title 3' } },
  ];
  const wrongSteps = [
    { props: { title: 'Title 1' } },
    { props: { title: 'Title 2' } },
    { props: {} },
  ];

  it('Renders a navigation with all the titles', () => {
    const wrapperWithNav = mount(<MultiStepNav steps={steps} />);

    expect(wrapperWithNav.find('nav')).to.have.lengthOf(1);
    expect(wrapperWithNav.find('li')).to.have.lengthOf(5);
    expect(wrapperWithNav.find('li.title')).to.have.lengthOf(3);
    expect(wrapperWithNav.find('li.title').at(0).text()).to.be.equal('Title 1');
    expect(wrapperWithNav.find('li.title').at(1).text()).to.be.equal('Title 2');
    expect(wrapperWithNav.find('li.title').at(2).text()).to.be.equal('Title 3');
  });

  it('Should render no nav if showNav is false', () => {
    const noNavWrapper = mount(<MultiStepNav steps={steps} showNav={false} />);
    expect(noNavWrapper.find('nav')).to.have.lengthOf(0);
  });

  it('Should render no nav if any title is not defined', () => {
    const noNavWrapper = mount(<MultiStepNav steps={wrongSteps} />);
    expect(noNavWrapper.find('nav')).to.have.lengthOf(0);
  });
});
