import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Button from 'react-toolbox/lib/button';
import { PricedButtonComponent } from './index';
import i18n from '../../i18n';
import styles from './pricedButton.css';


describe('PricedButton', () => {
  let wrapper;
  const props = {
    fee: 5e8,
    onClick: sinon.spy(),
    t: (key, options) => i18n.t(key, options),
  };
  const insufficientBalance = 4.9999e8;
  const sufficientBalance = 6e8;

  it('renders <Button /> component from react-toolbox', () => {
    wrapper = shallow(<PricedButtonComponent {...props} balance={sufficientBalance} />);
    expect(wrapper.find(Button)).to.have.length(1);
  });

  describe('Sufficient funds', () => {
    beforeEach(() => {
      wrapper = shallow(<PricedButtonComponent {...props} balance={sufficientBalance} />);
    });

    it('renders a span saying "Fee: 5 LSK"', () => {
      expect(wrapper.find(`.${styles.fee}`).text()).to.be.equal(i18n.t('Fee: {{fee}} LSK', { fee: 5 }));
    });

    it('allows to click on Button', () => {
      wrapper.find(Button).simulate('click');
      expect(props.onClick).to.have.been.calledWithExactly();
    });
  });

  describe('Insufficient funds', () => {
    beforeEach(() => {
      wrapper = shallow(<PricedButtonComponent {...props} balance={insufficientBalance} />);
    });

    it('renders a span saying "Insufficient funds for 5 LSK fee"', () => {
      expect(wrapper.find(`.${styles.fee}`).text()).to.be.equal('Insufficient funds for 5 LSK fee');
    });

    it('sets the disabled attribute of the button', () => {
      const buttonProps = wrapper.find(Button).props();
      expect(buttonProps.disabled).to.be.equal(true);
    });
  });
});
