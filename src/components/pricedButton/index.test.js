import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import Button from 'react-toolbox/lib/button';
import PricedButton from './index';

chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('DialogElement', () => {
  let wrapper;
  const props = {
    fee: 5e8,
    onClick: sinon.spy(),
  };
  const insufficientBalance = 4.9999e8;
  const sufficientBalance = 6e8;

  it('renders <Button /> component from react-toolbox', () => {
    wrapper = shallow(<PricedButton {...props} balance={sufficientBalance} />);
    expect(wrapper.find(Button)).to.have.length(1);
  });

  describe('Sufficient funds', () => {
    beforeEach(() => {
      wrapper = shallow(<PricedButton {...props} balance={sufficientBalance} />);
    });

    it('renders a span saying "Fee: 5 LSK"', () => {
      expect(wrapper.find('span').text()).to.be.equal('Fee: 5 LSK');
    });

    it('allows to click on Button', () => {
      wrapper.find(Button).simulate('click');
      expect(props.onClick).to.have.been.calledWith();
    });
  });

  describe('Insufficient funds', () => {
    beforeEach(() => {
      wrapper = shallow(<PricedButton {...props} balance={insufficientBalance} />);
    });

    it('renders a span saying "Insufficient funds for 5 LSK fee"', () => {
      expect(wrapper.find('span').text()).to.be.equal('Insufficient funds for 5 LSK fee');
    });

    it('sets the disabled attribute of the button', () => {
      const buttonProps = wrapper.find(Button).props();
      expect(buttonProps.disabled).to.be.equal(true);
    });
  });
});
