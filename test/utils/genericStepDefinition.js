
import { expect } from 'chai';

export default class GenericStepDefinition {
  constructor(input, store) {
    this.wrapper = input;
    this.store = store;
  }
  /**
   * simulate click on a dom query
   * @param {String} selector - Valid css query selector
   */
  clickOnElement(selector) {
    this.wrapper.find(selector).first().simulate('click');
  }
  /**
   * check that dom query entry is disable or enable
   * if value of status is equal to 'not' query shouldn't be disabled
   * @param {String} query - dom query that we need to check that is disable or not
   * @param {String} status - possible values are 'not' and ''
   */
  checkDisableInput(query, status = '') {
    if (status === 'not') {
      expect(this.wrapper.find(query)).to.not.be.disabled();
    } else {
      expect(this.wrapper.find(query)).to.be.disabled();
    }
  }
  /**
   *
   * @param {String} query - dom query that we need to check length of that
   * @param {Integer} length
   */
  haveLengthOf(query, length) {
    expect(this.wrapper).to.have.exactly(length).descendants(query);
  }
  /**
   *
   * @param {String} query - dom query that we need to check text of that
   * @param {String} text - expect text of the dom query entry
   */
  haveTextOf(query, text) {
    expect(this.wrapper.find(query).first()).to.have.text(text);
  }
  /**
   *
   * @param {String} query - dom query that we need to check text of that
   * @param {String} text - expect text of the dom query entry
   */
  haveInputValueOf(query, text) {
    expect(this.wrapper.find(query).first()).to.have.value(text);
  }
  /**
   *
   * @param {String} value - The value to fill in input
   * @param {String} field - space separated class name of the input, without the initial dot
   */
  fillInputField(value, field) {
    const selector = `.${field.replace(/ /g, '-')} input`;
    this.wrapper.find(selector).first().simulate('change', { target: { value } });
  }
  /**
   *
   * @param {String} value - The index of option in the list to click on
   * @param {String} field - space separated class name of the input, without the initial dot
   */
  selectOptionItem(optionIndex, field) {
    const selector = `.${field.replace(/ /g, '-')} ul li`;
    this.wrapper.find(selector).at(parseInt(optionIndex, 10) - 1).simulate('click');
  }

  submitForm() {
    this.wrapper.find('form').simulate('submit', {});
  }

  /**
   *
   * @param {String} expectedPublicKey - Valid publicKey
   */
  shouldBeLoggedInAs(expectedPublicKey) {
    expect(this.store.getState().account.publicKey).to.equal(expectedPublicKey);
  }

  /**
   *
   * @param {Number} count - Valid publicKey
   * @param {String} selector - Valid css selector
   */
  shouldSeeCountInstancesOf(count, selector) {
    expect(this.wrapper).to.have.exactly(count).descendants(selector);
  }
  /**
   * prints rendered DOM by wrapper into console
   */
  debug() {
    console.log(this.wrapper.debug()); // eslint-disable-line no-console
  }
}
