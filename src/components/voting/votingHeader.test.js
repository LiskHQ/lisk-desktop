import React from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import VotingHeader from './votingHeader';

chai.use(sinonChai);
describe('VotingHeader', () => {
  const search = sinon.spy();
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<VotingHeader search={search}></VotingHeader>);
  });

  it('should render an Input', () => {
    expect(wrapper.find('Input')).to.have.lengthOf(1);
  });

  it('should render i.material-icons with text of "search" when this.search is not called', () => {
    // expect(wrapper.find('i.material-icons')).to.have.lengthOf(1);
    expect(wrapper.find('i.material-icons').text()).to.be.equal('search');
  });

  it('should render i.material-icons with text of "close" when this.search is called', () => {
    wrapper.instance().search('query', '555');
    expect(wrapper.find('i.material-icons').text()).to.be.equal('close');
  });

  it('should this.props.search when this.search is called', () => {
    wrapper.instance().search('query', '555');
    expect(search).to.have.been.calledWith('555');
  });


  it('should this.props.search when this.search is called', () => {
    wrapper.instance().search('query', '555');
    expect(search).to.have.been.calledWith('555');
  });


  it('click on i.material-icons should clear vlaue of search input', () => {
    wrapper.instance().search('query', '555');
    wrapper.find('i.material-icons').simulate('click')
    expect(wrapper.state('query')).to.be.equal('');
  });
});
