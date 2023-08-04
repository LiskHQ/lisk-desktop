import { expect } from 'chai';

export default class GenericStepDefinition {
  constructor(input, store) {
    this.wrapper = input;
    this.store = store;
  }

  /**
   * simulate click on a dom query
   */
  clickOnElement(selector) {
    this.wrapper.find(selector).first().simulate('click');
  }

  /**
   * check that dom query entry is disable or enable
   * if value of Status is equal to 'not' query shouldn't be disabled
   */
  checkDisableInput(query, status = '') {
    if (status === 'not') {
      expect(this.wrapper.find(query)).to.not.be.disabled();
    } else {
      expect(this.wrapper.find(query)).to.be.disabled();
    }
  }

  haveLengthOf(query, length) {
    expect(this.wrapper).to.have.exactly(length).descendants(query);
  }

  haveTextOf(query, text) {
    this.wrapper.update();
    expect(this.wrapper.find(query).first()).to.have.text(text);
  }

  haveInputValueOf(query, text) {
    expect(this.wrapper.find(query).first()).to.have.value(text);
  }

  fillInputField(value, field) {
    const selector = `.${field.replace(/ /g, '-')} input`;
    this.wrapper.find(selector).first().simulate('change', { target: { value } });
  }

  selectOptionItem(optionIndex, field) {
    const selector = `.${field.replace(/ /g, '-')} ul li`;
    this.wrapper
      .find(selector)
      .at(parseInt(optionIndex, 10) - 1)
      .simulate('click');
  }

  submitForm() {
    this.wrapper.find('form').simulate('submit', {});
  }

  shouldBeLoggedInAs(expectedPublicKey) {
    expect(this.store.getState().wallet.publicKey).to.equal(expectedPublicKey);
  }

  shouldSeeCountInstancesOf(count, selector) {
    expect(this.wrapper).to.have.exactly(count).descendants(selector);
  }

  debug(element = null) {
    if (!element) {
      console.log(this.wrapper.debug()); // eslint-disable-line no-console
    } else {
      console.log(this.wrapper.find(element).debug()); // eslint-disable-line no-console
    }
  }
}
